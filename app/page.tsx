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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 p-4 sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-500">
            <span className={`h-2 w-2 rounded-full bg-emerald-400 ${isFetching ? 'pulse-dot' : ''}`} />
            {isFetching ? 'Syncing' : 'Live'}
          </div>
          <h1 className="font-serif text-3xl italic tracking-tight sm:text-4xl">Bandarmologi Intelligence</h1>
          <p className="mt-1 text-sm text-neutral-500">Composite Long/Short Score — stack API gratis</p>
        </div>
        <div className="flex items-center gap-3">
          <SymbolToggle value={symbol} onChange={setSymbol} />
          <button
            onClick={() => refresh()}
            disabled={isFetching}
            className="rounded-md border border-white/15 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-neutral-300 transition hover:border-white/30 hover:bg-white/5 disabled:opacity-50"
          >
            {isFetching ? (
              <span className="spin inline-block">↻</span>
            ) : (
              '↻ Refresh'
            )}
          </button>
        </div>
      </header>

      {isLoading && (
        <div className="shimmer rounded-xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-400">
          Memuat sinyal {symbol}...
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-900/60 bg-red-950/30 p-4 text-sm text-red-300">
          Gagal memuat data. Periksa koneksi atau coba refresh manual.
        </div>
      )}

      {data && (
        <div className="slide-down flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
            <ClssGauge
              clss={data.result.CLSS}
              bias={data.result.bias}
              sizing={data.result.sizing}
              confidence={data.result.confidence}
            />
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">
                  {config.label} · {config.binanceSymbol}
                </p>
                <p className="tabular-nums mt-1 font-serif text-4xl">
                  ${data.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </p>
                <p className="mt-2 text-xs text-neutral-500">
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
        </div>
      )}

      <Disclaimer />
    </div>
  );
}
