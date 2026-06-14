import { TradePlan } from '../lib/signals/tradePlan';

interface TradePlanCardProps {
  plan: TradePlan | null;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  consensusWarning: boolean;
}

function formatPrice(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export function TradePlanCard({ plan, confidence, consensusWarning }: TradePlanCardProps) {
  if (!plan) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="mb-2 border-b border-white/10 pb-2 text-sm font-medium uppercase tracking-wider text-neutral-300">
          Trade Plan
        </h3>
        <p className="py-4 text-center text-sm text-neutral-500">
          Bias saat ini NEUTRAL atau struktur harga belum tersedia — tidak ada rencana entry yang disarankan.
        </p>
      </div>
    );
  }

  const directionColor = plan.direction === 'LONG' ? 'text-emerald-400' : 'text-red-400';
  const rr1 = (plan.takeProfit1 - plan.entry) / (plan.entry - plan.stopLoss);
  const rr2 = (plan.takeProfit2 - plan.entry) / (plan.entry - plan.stopLoss);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-2 flex items-baseline justify-between border-b border-white/10 pb-2">
        <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-300">Trade Plan</h3>
        <span className={`text-sm font-medium uppercase tracking-wider ${directionColor}`}>{plan.direction}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Entry</p>
          <p className="tabular-nums font-serif text-xl">{formatPrice(plan.entry)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">Stop Loss</p>
          <p className="tabular-nums font-serif text-xl text-red-400">{formatPrice(plan.stopLoss)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">TP1 ({rr1.toFixed(1)}R)</p>
          <p className="tabular-nums font-serif text-xl text-emerald-400">{formatPrice(plan.takeProfit1)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-neutral-500">TP2 ({rr2.toFixed(1)}R)</p>
          <p className="tabular-nums font-serif text-xl text-emerald-400">{formatPrice(plan.takeProfit2)}</p>
        </div>
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        SL berbasis swing high/low 4H ± 1×ATR14. TP1/TP2 pada R:R 1.5x / 3x dari risiko per unit ({formatPrice(plan.riskPerUnit)}).
      </p>

      {(confidence === 'LOW' || consensusWarning) && (
        <p className="mt-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300">
          Confidence {confidence} / konsensus rendah — pertimbangkan untuk tidak entry atau gunakan ukuran posisi
          minimal sampai ada konfirmasi tambahan.
        </p>
      )}
    </div>
  );
}
