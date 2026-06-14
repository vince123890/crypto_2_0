import { SymbolKey } from '../lib/constants';

interface SymbolToggleProps {
  value: SymbolKey;
  onChange: (symbol: SymbolKey) => void;
}

export function SymbolToggle({ value, onChange }: SymbolToggleProps) {
  return (
    <div className="flex gap-1 rounded-md border border-white/10 bg-white/[0.02] p-1">
      {(['BTC', 'ETH'] as SymbolKey[]).map((sym) => (
        <button
          key={sym}
          onClick={() => onChange(sym)}
          className={`rounded-sm px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition ${
            value === sym ? 'bg-white text-black' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          {sym}
        </button>
      ))}
    </div>
  );
}
