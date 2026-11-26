/**
 * LocalStorage Collection Helper
 * ──────────────────────────────
 * Safe browser/SSR-aware read & write wrapper for offline/demo mode.
 */

export function readLocalCollection(storageKey, fallbackData) {
  if (typeof window === 'undefined') return fallbackData;

  const existing = localStorage.getItem(storageKey);
  if (!existing) {
    localStorage.setItem(storageKey, JSON.stringify(fallbackData));
    return fallbackData;
  }

  try {
    return JSON.parse(existing);
  } catch {
    return fallbackData;
  }
}

export function writeLocalCollection(storageKey, data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }
}
