import type { Language } from '@wilkins/types';

/**
 * Locale dictionary type — nested string values, recursively resolving nested keys.
 */
export type LocaleDict = {
  [key: string]: string | LocaleDict;
};

/**
 * Resolves a dot-notation i18n key from a locale dictionary,
 * with simple {{variable}} interpolation support.
 *
 * @example
 *   t(dict, 'common.loading')              → "Loading…"
 *   t(dict, 'search.showing_results', { count: 5 })  → "Showing 5 results"
 */
export function t(
  dict: LocaleDict,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const parts = key.split('.');
  let current: LocaleDict | string = dict;

  for (const part of parts) {
    if (typeof current !== 'object' || current === null) {
      return key; // key not found — return raw key as fallback
    }
    const next: string | LocaleDict | undefined = current[part];
    if (next === undefined) return key;
    current = next;
  }

  if (typeof current !== 'string') return key;

  if (!vars) return current;

  return current.replace(/\{\{(\w+)\}\}/g, (_, varName) => {
    const val = vars[varName];
    return val !== undefined ? String(val) : `{{${varName}}}`;
  });
}

/**
 * Merges a partial locale dict on top of an English base,
 * so missing keys fall back gracefully.
 */
export function mergeWithFallback(base: LocaleDict, override: Partial<LocaleDict>): LocaleDict {
  const merged: LocaleDict = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (typeof value === 'object' && typeof merged[key] === 'object') {
      merged[key] = mergeWithFallback(merged[key] as LocaleDict, value as LocaleDict);
    } else if (value !== undefined) {
      merged[key] = value;
    }
  }
  return merged;
}

/** Returns the text direction for a given language code */
export function getTextDirection(lang: Language | string): 'ltr' | 'rtl' {
  const rtlCodes = ['ar', 'he', 'fa', 'ur', 'yi', 'dv'];
  const code = typeof lang === 'string' ? lang : lang.code;
  const base = code.split('-')[0];
  return base && rtlCodes.includes(base) ? 'rtl' : 'ltr';
}

/** Normalizes a language code to a canonical BCP-47 form */
export function normalizeLanguageCode(code: string): string {
  // Handle common aliases
  const aliases: Record<string, string> = {
    'zh': 'zh-CN',
    'zh-hans': 'zh-CN',
    'zh-hant': 'zh-TW',
    'pt-br': 'pt',
  };
  const lower = code.toLowerCase();
  return aliases[lower] ?? code;
}
