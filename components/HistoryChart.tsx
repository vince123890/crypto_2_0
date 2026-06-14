'use client';

import { useSyncExternalStore } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { downloadHistoryCSV, getHistory, HISTORY_UPDATED_EVENT } from '../lib/storage/history';

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(HISTORY_UPDATED_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(HISTORY_UPDATED_EVENT, callback);
  };
}

export function HistoryChart({ symbol }: { symbol: string }) {
  const history = useSyncExternalStore(
    subscribe,
    () => getHistory(symbol),
    () => []
  );

  const data = history.map((h) => ({
    time: new Date(h.timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }),
    CLSS: Number(h.CLSS.toFixed(1)),
    price: h.price,
  }));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-semibold text-slate-200">Histori CLSS vs Harga ({symbol})</h3>
        <button
          onClick={() => downloadHistoryCSV(symbol)}
          disabled={data.length === 0}
          className="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
        >
          Export CSV
        </button>
      </div>

      {data.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          Belum ada histori. Data akan terkumpul setiap kali dashboard ini dibuka (snapshot disimpan di
          localStorage browser ini).
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" stroke="#64748b" fontSize={11} />
            <YAxis yAxisId="left" domain={[-100, 100]} stroke="#64748b" fontSize={11} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={11} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', fontSize: 12 }} />
            <Line yAxisId="left" type="monotone" dataKey="CLSS" stroke="#34d399" strokeWidth={2} dot={false} name="CLSS" />
            <Line yAxisId="right" type="monotone" dataKey="price" stroke="#60a5fa" strokeWidth={2} dot={false} name="Price" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
