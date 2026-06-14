export type SignalStatus = 'ok' | 'error';

export interface SignalResult {
  signal: string;
  label: string;
  rawValue: string;
  score: number; // contribution, within [-weight, +weight]
  weight: number; // max absolute contribution per scoring table
  status: SignalStatus;
  fetchedAt: number;
}

export function errorResult(signal: string, label: string, weight: number): SignalResult {
  return {
    signal,
    label,
    rawValue: 'N/A',
    score: 0,
    weight,
    status: 'error',
    fetchedAt: Date.now(),
  };
}
