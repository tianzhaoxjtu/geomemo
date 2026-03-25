import { en } from "./en";
import { zhCN } from "./zh-CN";
import type { Locale, TranslationDictionary } from "../types";

export const messages: Record<Locale, TranslationDictionary> = {
  "zh-CN": zhCN,
  en,
};
