'use client';

interface ClssGaugeProps {
  clss: number;
  bias: string;
  sizing: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

function biasColor(clss: number): string {
  if (clss >= 10) return 'text-emerald-400';
  if (clss <= -10) return 'text-red-400';
  return 'text-neutral-400';
}

export function ClssGauge({ clss, bias, sizing, confidence }: ClssGaugeProps) {
  // Map -100..100 ke 0..180 derajat (semicircle gauge)
  const clamped = Math.max(-100, Math.min(100, clss));
  const angle = ((clamped + 100) / 200) * 180;

  const confidenceColor =
    confidence === 'HIGH'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      : confidence === 'MEDIUM'
      ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
      : 'border-white/10 bg-white/5 text-neutral-400';

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
      <div className="relative h-32 w-64">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          {/* Background arc */}
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#262626" strokeWidth="14" strokeLinecap="round" />
          {/* Color segments */}
          <path d="M 10 100 A 90 90 0 0 1 73 16" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity="0.45" />
          <path d="M 73 16 A 90 90 0 0 1 127 16" fill="none" stroke="#525252" strokeWidth="14" strokeLinecap="round" opacity="0.45" />
          <path d="M 127 16 A 90 90 0 0 1 190 100" fill="none" stroke="#34d399" strokeWidth="14" strokeLinecap="round" opacity="0.45" />
          {/* Needle */}
          <g transform={`rotate(${angle - 90} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="22" stroke="#fafafa" strokeWidth="3" strokeLinecap="round" />
          </g>
          <circle cx="100" cy="100" r="6" fill="#fafafa" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <span className={`tabular-nums font-serif text-5xl ${biasColor(clss)}`}>{clss.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">
        <span className={`text-lg font-medium uppercase tracking-wide ${biasColor(clss)}`}>{bias}</span>
        <span className="text-sm text-neutral-500">Sizing rekomendasi: {sizing}</span>
        <span className={`mt-1 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${confidenceColor}`}>
          Confidence: {confidence}
        </span>
      </div>
    </div>
  );
}
