const SNAPSHOT_PREFIX = 'bandarmologi_snapshot_';

interface StoredSnapshot {
  value: number;
  timestamp: number;
}

export function readPrevSnapshot(key: string): StoredSnapshot | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SNAPSHOT_PREFIX + key);
  return raw ? (JSON.parse(raw) as StoredSnapshot) : null;
}

export function saveSnapshot(key: string, value: number): void {
  if (typeof window === 'undefined') return;
  const snapshot: StoredSnapshot = { value, timestamp: Date.now() };
  window.localStorage.setItem(SNAPSHOT_PREFIX + key, JSON.stringify(snapshot));
}
