'use client';

import { useState } from 'react';
import { ClssGauge } from '../components/ClssGauge';
import { ConsensusWarning } from '../components/ConsensusWarning';
import { Disclaimer } from '../components/Disclaimer';
import { HistoryChart } from '../components/HistoryChart';
import { SignalBreakdownCard } from '../components/SignalBreakdownCard';
import { SymbolToggle } from '../components/SymbolToggle';
import { useClss } from '../hooks/useClss';
import { SYMBOLS, SymbolKey } from '../lib/constants';

export default function Home() {
  const [symbol, setSymbol] = useState<SymbolKey>('BTC');
  const config = SYMBOLS[symbol];
  const { data, isLoading, isError, refresh, isFetching } = useClss(symbol, config);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">🐋 Bandarmologi L/S Dashboard</h1>
          <p className="text-sm text-slate-500">Composite Long/Short Score — stack API gratis</p>
        </div>
        <div className="flex items-center gap-3">
          <SymbolToggle value={symbol} onChange={setSymbol} />
          <button
            onClick={() => refresh()}
            disabled={isFetching}
            className="rounded-lg border border-slate-700 px-4 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
          >
            {isFetching ? 'Memuat...' : '🔄 Refresh'}
          </button>
        </div>
      </header>

      {isLoading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-400">
          Memuat sinyal {symbol}...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          Gagal memuat data. Periksa koneksi atau coba refresh manual.
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <ClssGauge
              clss={data.result.CLSS}
              bias={data.result.bias}
              sizing={data.result.sizing}
              confidence={data.result.confidence}
            />
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                <p className="text-sm text-slate-500">
                  {config.label} ({config.binanceSymbol})
                </p>
                <p className="text-2xl font-bold">
                  ${data.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Update terakhir: {new Date(data.result.timestamp).toLocaleTimeString('id-ID')}
                </p>
              </div>
              <ConsensusWarning
                consensusCount={data.result.consensusCount}
                consensusWarning={data.result.consensusWarning}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <SignalBreakdownCard title="On-Chain" weight="30%" category={data.result.categories.onchain} />
            <SignalBreakdownCard title="Derivatif" weight="35%" category={data.result.categories.derivatives} />
            <SignalBreakdownCard title="Likuiditas" weight="25%" category={data.result.categories.liquidity} />
          </div>

          <HistoryChart symbol={symbol} />
        </>
      )}

      <Disclaimer />
    </div>
  );
}
