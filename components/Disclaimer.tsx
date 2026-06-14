export function Disclaimer() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 text-xs leading-relaxed text-slate-500">
      <p className="mb-1 font-semibold text-slate-400">⚠ Disclaimer</p>
      <p>
        Dashboard ini adalah alat bantu riset berbasis API gratis (Binance Public, DeFiLlama, CoinGecko,
        Mempool.space, Etherscan) dan{' '}
        <strong className="text-slate-400">bukan saran keuangan</strong>. Skor CLSS adalah lapisan konfirmasi,
        bukan oracle prediksi instan — sinyal on-chain dan derivatif bersifat lagging-to-coincident. Selalu
        kombinasikan dengan analisis teknikal mandiri, gunakan stop loss, dan batasi ukuran posisi (2–5% dari
        portfolio per trade). Histori CLSS disimpan secara lokal di browser Anda (localStorage) dan tidak
        dikirim ke server manapun.
      </p>
    </div>
  );
}
