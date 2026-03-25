import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const META_URL = "https://geojson.cn/api/china/_meta.json";
const GEO_DIR = path.join(ROOT, "public/geojson/china");
const META_FILE = path.join(ROOT, "src/entities/region/data/china-meta.json");
const SOURCE_FILE = path.join(ROOT, "src/entities/region/data/china-source.json");
const REGION_INDEX_FILE = path.join(ROOT, "src/entities/region/data/china-regions.json");

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "GeoMemo/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  await mkdir(GEO_DIR, { recursive: true });

  const meta = await fetchJson(META_URL);
  await writeFile(META_FILE, `${JSON.stringify(meta, null, 2)}\n`, "utf8");

  const root = meta.files?.[0];

  if (!root || !Array.isArray(root.children)) {
    throw new Error("Unexpected _meta.json format.");
  }

  const toCode = (filename) => filename.split("/").pop();

  const countryGeo = await fetchJson(`https://geojson.cn/api/china/${root.filename}.json`);
  await writeFile(path.join(GEO_DIR, `${toCode(root.filename)}.json`), `${JSON.stringify(countryGeo)}\n`, "utf8");

  const provinces = countryGeo.features.map((feature) => ({
    code: String(feature.properties?.code),
    name: String(feature.properties?.name ?? ""),
    fullname: String(feature.properties?.fullname ?? feature.properties?.name ?? ""),
    filename: String(feature.properties?.filename ?? ""),
  }));
  const citiesByProvince = {};

  for (const province of root.children) {
    if (!province.filename) {
      continue;
    }

    const provinceGeo = await fetchJson(`https://geojson.cn/api/china/${province.filename}.json`);
    const provinceCode = toCode(province.filename);

    await writeFile(
      path.join(GEO_DIR, `${provinceCode}.json`),
      `${JSON.stringify(provinceGeo)}\n`,
      "utf8",
    );

    citiesByProvince[provinceCode] = provinceGeo.features.map((feature) => ({
      code: String(feature.properties?.code),
      name: String(feature.properties?.name ?? ""),
      fullname: String(feature.properties?.fullname ?? feature.properties?.name ?? ""),
      filename: String(feature.properties?.filename ?? ""),
      level: Number(feature.properties?.level ?? 0),
      center: Array.isArray(feature.properties?.center) ? feature.properties.center : null,
    }));
  }

  const sourceInfo = {
    provider: "GeoJSON.CN",
    dataset: "China administrative divisions",
    api: "https://geojson.cn/api/china/",
    fetchedAt: new Date().toISOString(),
  };

  await writeFile(SOURCE_FILE, `${JSON.stringify(sourceInfo, null, 2)}\n`, "utf8");
  await writeFile(
    REGION_INDEX_FILE,
    `${JSON.stringify({ provinces, citiesByProvince }, null, 2)}\n`,
    "utf8",
  );
  console.log(`Saved China GeoJSON snapshot to ${GEO_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
