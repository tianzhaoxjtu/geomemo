import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = path.join(__dirname, "..", "src", "data", "adminDivisions", "china-admin-divisions.json");

const dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
const errors = [];

function assert(condition, message) {
  if (!condition) {
    errors.push(message);
  }
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();

  for (const value of values) {
    if (seen.has(value)) {
      duplicates.add(value);
    }

    seen.add(value);
  }

  return [...duplicates];
}

const { standard, provinces } = dataset;
const prefectureUnits = dataset.prefectureUnits;
const provinceIds = provinces.map((province) => province.id);
const provinceZhNames = provinces.map((province) => province.zhName);
const provinceEnNames = provinces.map((province) => province.enName);
const prefectureUnitIds = prefectureUnits.map((unit) => unit.id);

assert(standard.provinceLevelUnitCount === 34, "Standard metadata must declare 34 province-level units.");
assert(standard.prefectureLevelUnitCount === 337, "Standard metadata must declare 337 second-level units.");
assert(provinces.length === 34, `Province count must be 34, received ${provinces.length}.`);
assert(
  prefectureUnits.length === 337,
  `Second-level unit count must be 337, received ${prefectureUnits.length}.`,
);
assert(!provinceIds.includes("100000"), "The national/root China node (100000) must not appear in province totals.");

const duplicateProvinceIds = findDuplicates(provinceIds);
const duplicateProvinceZhNames = findDuplicates(provinceZhNames);
const duplicateProvinceEnNames = findDuplicates(provinceEnNames);
const duplicatePrefectureUnitIds = findDuplicates(prefectureUnitIds);

assert(duplicateProvinceIds.length === 0, `Duplicate province ids: ${duplicateProvinceIds.join(", ")}`);
assert(duplicateProvinceZhNames.length === 0, `Duplicate province zh names: ${duplicateProvinceZhNames.join(", ")}`);
assert(duplicateProvinceEnNames.length === 0, `Duplicate province en names: ${duplicateProvinceEnNames.join(", ")}`);
assert(
  duplicatePrefectureUnitIds.length === 0,
  `Duplicate second-level unit ids: ${duplicatePrefectureUnitIds.join(", ")}`,
);

const provinceIdSet = new Set(provinceIds);
const prefectureUnitIdSet = new Set(prefectureUnitIds);
const mappedPrefectureUnitIds = new Set();

for (const province of provinces) {
  const duplicateMappedPrefectureUnitIds = findDuplicates(province.prefectureUnitIds);
  assert(
    duplicateMappedPrefectureUnitIds.length === 0,
    `Province ${province.id} has duplicate second-level unit ids in its mapping: ${duplicateMappedPrefectureUnitIds.join(", ")}`,
  );

  for (const prefectureUnitId of province.prefectureUnitIds) {
    mappedPrefectureUnitIds.add(prefectureUnitId);
    assert(
      prefectureUnitIdSet.has(prefectureUnitId),
      `Province ${province.id} references unknown second-level unit id ${prefectureUnitId}.`,
    );
  }
}

assert(
  mappedPrefectureUnitIds.size === 337,
  `Province-to-unit mapping must cover exactly 337 unique second-level units, received ${mappedPrefectureUnitIds.size}.`,
);

for (const prefectureUnit of prefectureUnits) {
  assert(
    prefectureUnit.administrativeLevel === "prefecture",
    `Second-level unit ${prefectureUnit.id} must have administrativeLevel "prefecture".`,
  );
  assert(
    provinceIdSet.has(prefectureUnit.parentProvinceId),
    `Second-level unit ${prefectureUnit.id} references invalid parent province ${prefectureUnit.parentProvinceId}.`,
  );

  const province = provinces.find((item) => item.id === prefectureUnit.parentProvinceId);
  assert(
    Boolean(province?.prefectureUnitIds.includes(prefectureUnit.id)),
    `Second-level unit ${prefectureUnit.id} is missing from province ${prefectureUnit.parentProvinceId}'s prefectureUnitIds mapping.`,
  );
}

for (const province of provinces) {
  const provincePrefectureUnits = prefectureUnits.filter((unit) => unit.parentProvinceId === province.id);
  const provincePrefectureUnitZhNames = provincePrefectureUnits.map((unit) => unit.zhName);
  const provincePrefectureUnitEnNames = provincePrefectureUnits.map((unit) => unit.enName);

  const duplicateProvincePrefectureUnitZhNames = findDuplicates(provincePrefectureUnitZhNames);
  const duplicateProvincePrefectureUnitEnNames = findDuplicates(provincePrefectureUnitEnNames);

  assert(
    duplicateProvincePrefectureUnitZhNames.length === 0,
    `Province ${province.id} has duplicate second-level zh names: ${duplicateProvincePrefectureUnitZhNames.join(", ")}`,
  );
  assert(
    duplicateProvincePrefectureUnitEnNames.length === 0,
    `Province ${province.id} has duplicate second-level en names: ${duplicateProvincePrefectureUnitEnNames.join(", ")}`,
  );
  assert(
    province.prefectureUnitIds.length === provincePrefectureUnits.length,
    `Province ${province.id} mapping length ${province.prefectureUnitIds.length} does not match second-level records ${provincePrefectureUnits.length}.`,
  );
}

if (errors.length > 0) {
  console.error("Administrative-division validation failed:");

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exit(1);
}

console.log("Administrative-division dataset is valid.");
console.log(`- Province-level units: ${provinces.length}`);
console.log(`- Second-level units: ${prefectureUnits.length}`);
console.log("- Root China node excluded from province totals: yes");
