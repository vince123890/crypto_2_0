export interface CLSSSnapshot {
  timestamp: number;
  symbol: string;
  CLSS: number;
  price: number;
  bias: string;
}

const HISTORY_KEY = 'bandarmologi_clss_history';
const MAX_ENTRIES = 500; // ~84 hari @ 6x/hari

export function getHistory(symbol: string): CLSSSnapshot[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(`${HISTORY_KEY}_${symbol}`);
  return raw ? (JSON.parse(raw) as CLSSSnapshot[]) : [];
}

export function appendSnapshot(snapshot: CLSSSnapshot): void {
  if (typeof window === 'undefined') return;
  const history = getHistory(snapshot.symbol);

  // Hindari duplikat jika dipanggil ulang dalam interval pendek (< 4 jam)
  const last = history[history.length - 1];
  if (last && snapshot.timestamp - last.timestamp < 4 * 60 * 60_000) {
    return;
  }

  history.push(snapshot);
  if (history.length > MAX_ENTRIES) history.shift();
  window.localStorage.setItem(`${HISTORY_KEY}_${snapshot.symbol}`, JSON.stringify(history));
}

export function exportHistoryAsCSV(symbol: string): string {
  const history = getHistory(symbol);
  const header = 'timestamp,symbol,CLSS,price,bias\n';
  const rows = history
    .map((h) => `${new Date(h.timestamp).toISOString()},${h.symbol},${h.CLSS},${h.price},${h.bias}`)
    .join('\n');
  return header + rows;
}

export function downloadHistoryCSV(symbol: string): void {
  const csv = exportHistoryAsCSV(symbol);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `clss_history_${symbol}_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
