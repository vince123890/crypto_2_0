import { CategoryResult } from '../lib/signals/clss';
import { SignalRow } from './SignalRow';

interface SignalBreakdownCardProps {
  title: string;
  weight: string;
  category: CategoryResult;
}

export function SignalBreakdownCard({ title, weight, category }: SignalBreakdownCardProps) {
  const scoreColor = category.score > 0 ? 'text-emerald-400' : category.score < 0 ? 'text-red-400' : 'text-neutral-400';

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-baseline justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-300">
          {title} <span className="text-xs text-neutral-500">({weight})</span>
        </h3>
        <span className={`tabular-nums font-serif text-2xl ${scoreColor}`}>{category.score.toFixed(1)}</span>
      </div>
      <div className="divide-y divide-white/5">
        {category.signals.map((s) => (
          <SignalRow key={s.signal} signal={s} />
        ))}
      </div>
    </div>
  );
}
