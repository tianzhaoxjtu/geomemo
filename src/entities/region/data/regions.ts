import type { City, Province } from "../model/types";

export const provinces: Province[] = [
  {
    id: "heilongjiang",
    name: "Heilongjiang",
    code: "HLJ",
    shape: {
      path: "M580 40 L700 40 L760 110 L720 170 L620 180 L560 120 Z",
      labelX: 650,
      labelY: 110,
    },
    cityIds: ["haerbin", "qiqihaer", "mudanjiang"],
  },
  {
    id: "beijing",
    name: "Beijing",
    code: "BJ",
    shape: {
      path: "M520 150 L570 145 L590 185 L555 220 L510 205 Z",
      labelX: 550,
      labelY: 185,
    },
    cityIds: ["chaoyang", "haidian", "dongcheng"],
  },
  {
    id: "shaanxi",
    name: "Shaanxi",
    code: "SN",
    shape: {
      path: "M390 180 L460 165 L500 215 L470 300 L400 320 L360 250 Z",
      labelX: 435,
      labelY: 245,
    },
    cityIds: ["xian", "xianyang", "yanan"],
  },
  {
    id: "shanghai",
    name: "Shanghai",
    code: "SH",
    shape: {
      path: "M610 250 L650 250 L660 290 L630 315 L600 295 Z",
      labelX: 630,
      labelY: 283,
    },
    cityIds: ["pudong", "minhang", "jingan"],
  },
  {
    id: "zhejiang",
    name: "Zhejiang",
    code: "ZJ",
    shape: {
      path: "M560 280 L620 300 L630 380 L570 410 L525 355 Z",
      labelX: 580,
      labelY: 345,
    },
    cityIds: ["hangzhou", "ningbo", "wenzhou"],
  },
  {
    id: "sichuan",
    name: "Sichuan",
    code: "SC",
    shape: {
      path: "M260 250 L370 230 L410 300 L380 390 L280 405 L220 330 Z",
      labelX: 315,
      labelY: 320,
    },
    cityIds: ["chengdu", "mianyang", "leshan", "yibin"],
  },
  {
    id: "yunnan",
    name: "Yunnan",
    code: "YN",
    shape: {
      path: "M220 380 L320 390 L335 480 L250 520 L170 470 Z",
      labelX: 255,
      labelY: 448,
    },
    cityIds: ["kunming", "dali", "lijiang"],
  },
  {
    id: "guangdong",
    name: "Guangdong",
    code: "GD",
    shape: {
      path: "M450 390 L560 380 L590 470 L510 520 L430 470 Z",
      labelX: 510,
      labelY: 445,
    },
    cityIds: ["guangzhou", "shenzhen", "foshan", "zhuhai"],
  },
];

export const cities: City[] = [
  { id: "haerbin", name: "Harbin", provinceId: "heilongjiang", tile: { x: 90, y: 60, width: 140, height: 90 } },
  { id: "qiqihaer", name: "Qiqihar", provinceId: "heilongjiang", tile: { x: 250, y: 70, width: 130, height: 100 } },
  { id: "mudanjiang", name: "Mudanjiang", provinceId: "heilongjiang", tile: { x: 180, y: 190, width: 170, height: 110 } },

  { id: "chaoyang", name: "Chaoyang", provinceId: "beijing", tile: { x: 110, y: 90, width: 130, height: 100 } },
  { id: "haidian", name: "Haidian", provinceId: "beijing", tile: { x: 255, y: 110, width: 120, height: 90 } },
  { id: "dongcheng", name: "Dongcheng", provinceId: "beijing", tile: { x: 170, y: 210, width: 150, height: 100 } },

  { id: "xian", name: "Xi'an", provinceId: "shaanxi", tile: { x: 90, y: 80, width: 150, height: 110 } },
  { id: "xianyang", name: "Xianyang", provinceId: "shaanxi", tile: { x: 260, y: 90, width: 120, height: 100 } },
  { id: "yanan", name: "Yan'an", provinceId: "shaanxi", tile: { x: 160, y: 220, width: 180, height: 110 } },

  { id: "pudong", name: "Pudong", provinceId: "shanghai", tile: { x: 110, y: 90, width: 120, height: 110 } },
  { id: "minhang", name: "Minhang", provinceId: "shanghai", tile: { x: 250, y: 110, width: 120, height: 100 } },
  { id: "jingan", name: "Jing'an", provinceId: "shanghai", tile: { x: 165, y: 230, width: 150, height: 90 } },

  { id: "hangzhou", name: "Hangzhou", provinceId: "zhejiang", tile: { x: 90, y: 80, width: 140, height: 110 } },
  { id: "ningbo", name: "Ningbo", provinceId: "zhejiang", tile: { x: 250, y: 100, width: 130, height: 110 } },
  { id: "wenzhou", name: "Wenzhou", provinceId: "zhejiang", tile: { x: 150, y: 230, width: 190, height: 110 } },

  { id: "chengdu", name: "Chengdu", provinceId: "sichuan", tile: { x: 70, y: 70, width: 130, height: 100 } },
  { id: "mianyang", name: "Mianyang", provinceId: "sichuan", tile: { x: 220, y: 80, width: 130, height: 90 } },
  { id: "leshan", name: "Leshan", provinceId: "sichuan", tile: { x: 80, y: 200, width: 120, height: 90 } },
  { id: "yibin", name: "Yibin", provinceId: "sichuan", tile: { x: 220, y: 200, width: 150, height: 110 } },

  { id: "kunming", name: "Kunming", provinceId: "yunnan", tile: { x: 80, y: 90, width: 140, height: 110 } },
  { id: "dali", name: "Dali", provinceId: "yunnan", tile: { x: 240, y: 110, width: 130, height: 100 } },
  { id: "lijiang", name: "Lijiang", provinceId: "yunnan", tile: { x: 150, y: 230, width: 170, height: 100 } },

  { id: "guangzhou", name: "Guangzhou", provinceId: "guangdong", tile: { x: 60, y: 80, width: 140, height: 110 } },
  { id: "shenzhen", name: "Shenzhen", provinceId: "guangdong", tile: { x: 220, y: 90, width: 150, height: 90 } },
  { id: "foshan", name: "Foshan", provinceId: "guangdong", tile: { x: 80, y: 220, width: 140, height: 90 } },
  { id: "zhuhai", name: "Zhuhai", provinceId: "guangdong", tile: { x: 240, y: 210, width: 150, height: 100 } },
];

export const provincesById = Object.fromEntries(provinces.map((province) => [province.id, province]));
export const citiesById = Object.fromEntries(cities.map((city) => [city.id, city]));

export function getProvinceCities(provinceId: string) {
  return cities.filter((city) => city.provinceId === provinceId);
}
