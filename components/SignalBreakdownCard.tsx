import { CategoryResult } from '../lib/signals/clss';
import { SignalRow } from './SignalRow';

interface SignalBreakdownCardProps {
  title: string;
  weight: string;
  category: CategoryResult;
}

export function SignalBreakdownCard({ title, weight, category }: SignalBreakdownCardProps) {
  const scoreColor = category.score > 0 ? 'text-emerald-400' : category.score < 0 ? 'text-red-400' : 'text-slate-400';

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="font-semibold text-slate-200">
          {title} <span className="text-xs text-slate-500">({weight})</span>
        </h3>
        <span className={`font-mono text-lg font-bold ${scoreColor}`}>{category.score.toFixed(1)}</span>
      </div>
      <div className="divide-y divide-slate-800/60">
        {category.signals.map((s) => (
          <SignalRow key={s.signal} signal={s} />
        ))}
      </div>
    </div>
  );
}
