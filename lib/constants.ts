export type SymbolKey = 'BTC' | 'ETH';

export interface SymbolConfig {
  label: string;
  binanceSymbol: string; // e.g. BTCUSDT
  coingeckoId: string; // e.g. bitcoin
}

export const SYMBOLS: Record<SymbolKey, SymbolConfig> = {
  BTC: { label: 'Bitcoin', binanceSymbol: 'BTCUSDT', coingeckoId: 'bitcoin' },
  ETH: { label: 'Ethereum', binanceSymbol: 'ETHUSDT', coingeckoId: 'ethereum' },
};

// Beberapa ISP (mis. Telkomsel) melakukan DNS hijack/cert mismatch ke domain
// binance.com sehingga fetch langsung dari browser gagal. Gunakan proxy
// edge function Vercel sebagai default agar tetap berfungsi di jaringan tersebut.
export function binanceFuturesUrl(path: string, params: Record<string, string> = {}): string {
  const qs = new URLSearchParams({ host: 'futures', path, ...params });
  return `/api/proxy/binance?${qs.toString()}`;
}

export function binanceSpotUrl(path: string, params: Record<string, string> = {}): string {
  const qs = new URLSearchParams({ host: 'spot', path, ...params });
  return `/api/proxy/binance?${qs.toString()}`;
}

// stablecoins.llama.fi mengirim header CORS ganda (Access-Control-Allow-Origin: *, *)
// yang ditolak browser. Proxy via Vercel edge function untuk menghindari masalah ini.
export function defillamaStablecoinsUrl(path: string, params: Record<string, string> = {}): string {
  const qs = new URLSearchParams({ host: 'defillama-stablecoins', path, ...params });
  return `/api/proxy/binance?${qs.toString()}`;
}

export const COINGECKO = 'https://api.coingecko.com/api/v3';
export const MEMPOOL = 'https://mempool.space/api';
export const ETHERSCAN = 'https://api.etherscan.io/api';

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

// Known exchange hot wallets (ETH) — sumber publik (Etherscan labels)
export const ETH_EXCHANGE_WALLETS = [
  '0x28C6c06298d514Db089934071355E5743bf21d60', // Binance
  '0xa9D1e08C7793af67e9d92fe308d5697FB81d3E43', // Coinbase
  '0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2', // Kraken
];

// Refetch intervals (ms) sesuai rekomendasi polling frequency dokumen riset
export const REFRESH_INTERVALS = {
  microstructure: 60_000, // order book, OI, price — < 1 menit
  derivatives: 5 * 60_000, // funding rate, top trader ratio — 5 menit
  onchain: 30 * 60_000, // mempool, exchange flow — 30 menit
  liquidity: 4 * 60 * 60_000, // TVL, stablecoin, BTC dominance — 4 jam
};
