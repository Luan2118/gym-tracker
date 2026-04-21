export function readStorage<T>(key: string, fallbackValue: T[]): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallbackValue
  } catch {
    return fallbackValue;
  }
}

export function writeStorage<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}