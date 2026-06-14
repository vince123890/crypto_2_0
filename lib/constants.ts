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

export const BINANCE_FUTURES = 'https://fapi.binance.com';
export const BINANCE_SPOT = 'https://api.binance.com';
export const DEFILLAMA = 'https://api.llama.fi';
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
