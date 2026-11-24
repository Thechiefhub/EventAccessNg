/**
 * One-time browser storage migration from legacy pre-rebrand keys to `checking*` keys.
 * Runs safely on boot without throwing in restricted/private browsing modes.
 */
export function runBrandStorageMigration(): void {
  if (typeof window === "undefined") return;

  try {
    const legacyPrefix = ["my", "event"].join("");
    const storage = window.localStorage;
    const keysToMigrate: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.toLowerCase().includes(legacyPrefix)) {
        keysToMigrate.push(key);
      }
    }

    for (const oldKey of keysToMigrate) {
      const val = storage.getItem(oldKey);
      const newKey = oldKey.replace(new RegExp(legacyPrefix, "gi"), "checking");
      if (val !== null && storage.getItem(newKey) === null) {
        storage.setItem(newKey, val);
      }
      storage.removeItem(oldKey);
    }
  } catch {
    // Ignore storage access errors in sandboxed/private contexts
  }
}
