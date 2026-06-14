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
  return 'text-slate-400';
}

export function ClssGauge({ clss, bias, sizing, confidence }: ClssGaugeProps) {
  // Map -100..100 ke 0..180 derajat (semicircle gauge)
  const clamped = Math.max(-100, Math.min(100, clss));
  const angle = ((clamped + 100) / 200) * 180;

  const confidenceColor =
    confidence === 'HIGH' ? 'bg-emerald-500/20 text-emerald-300' : confidence === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-500/20 text-slate-300';

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="relative h-32 w-64">
        <svg viewBox="0 0 200 110" className="h-full w-full">
          {/* Background arc */}
          <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
          {/* Color segments */}
          <path d="M 10 100 A 90 90 0 0 1 73 16" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
          <path d="M 73 16 A 90 90 0 0 1 127 16" fill="none" stroke="#64748b" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
          <path d="M 127 16 A 90 90 0 0 1 190 100" fill="none" stroke="#10b981" strokeWidth="14" strokeLinecap="round" opacity="0.5" />
          {/* Needle */}
          <g transform={`rotate(${angle - 90} 100 100)`}>
            <line x1="100" y1="100" x2="100" y2="22" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
          </g>
          <circle cx="100" cy="100" r="6" fill="#f8fafc" />
        </svg>
        <div className="absolute inset-x-0 bottom-0 text-center">
          <span className={`text-3xl font-bold ${biasColor(clss)}`}>{clss.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 text-center">
        <span className={`text-xl font-semibold ${biasColor(clss)}`}>{bias}</span>
        <span className="text-sm text-slate-400">Sizing rekomendasi: {sizing}</span>
        <span className={`mt-1 rounded-full px-3 py-1 text-xs font-medium ${confidenceColor}`}>
          Confidence: {confidence}
        </span>
      </div>
    </div>
  );
}
