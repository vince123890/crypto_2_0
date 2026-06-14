import { SignalResult } from '../lib/signals/types';

export function SignalRow({ signal }: { signal: SignalResult }) {
  const dotColor =
    signal.status === 'error'
      ? 'bg-neutral-600'
      : signal.score > 0
      ? 'bg-emerald-400'
      : signal.score < 0
      ? 'bg-red-400'
      : 'bg-neutral-600';

  return (
    <div className="flex items-center justify-between gap-2 py-2 text-sm">
      <span className="flex items-center gap-2 text-neutral-300">
        <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
        <span>{signal.label}</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="tabular-nums text-neutral-500">{signal.status === 'error' ? 'N/A' : signal.rawValue}</span>
        <span
          className={`tabular-nums w-12 text-right ${
            signal.score > 0 ? 'text-emerald-400' : signal.score < 0 ? 'text-red-400' : 'text-neutral-500'
          }`}
        >
          {signal.status === 'error' ? '—' : signal.score > 0 ? `+${signal.score}` : signal.score}
        </span>
      </span>
    </div>
  );
}
