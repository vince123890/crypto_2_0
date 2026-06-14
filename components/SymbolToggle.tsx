import { SymbolKey } from '../lib/constants';

interface SymbolToggleProps {
  value: SymbolKey;
  onChange: (symbol: SymbolKey) => void;
}

export function SymbolToggle({ value, onChange }: SymbolToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-slate-800 bg-slate-900/50 p-1">
      {(['BTC', 'ETH'] as SymbolKey[]).map((sym) => (
        <button
          key={sym}
          onClick={() => onChange(sym)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
            value === sym ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {sym}
        </button>
      ))}
    </div>
  );
}
