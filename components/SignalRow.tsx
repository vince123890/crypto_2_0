import { SignalResult } from '../lib/signals/types';

export function SignalRow({ signal }: { signal: SignalResult }) {
  const dot = signal.status === 'error' ? '⚪' : signal.score > 0 ? '🟢' : signal.score < 0 ? '🔴' : '⚪';

  return (
    <div className="flex items-center justify-between gap-2 py-1.5 text-sm">
      <span className="flex items-center gap-2 text-slate-300">
        <span>{dot}</span>
        <span>{signal.label}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="text-slate-500">{signal.status === 'error' ? 'N/A' : signal.rawValue}</span>
        <span
          className={`w-12 text-right font-mono ${
            signal.score > 0 ? 'text-emerald-400' : signal.score < 0 ? 'text-red-400' : 'text-slate-500'
          }`}
        >
          {signal.status === 'error' ? '—' : signal.score > 0 ? `+${signal.score}` : signal.score}
        </span>
      </span>
    </div>
  );
}
