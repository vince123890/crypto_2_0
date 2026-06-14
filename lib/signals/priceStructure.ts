import { binanceFuturesUrl } from '../constants';

export interface PriceStructure {
  atr: number;
  swingHigh: number;
  swingLow: number;
}

type Kline = [number, string, string, string, string, string, number, string, number, string, string, string];

// Hitung ATR (Average True Range) & swing high/low dari candle 4H terbaru.
// Dipakai sebagai dasar perhitungan SL/TP otomatis (lihat lib/signals/tradePlan.ts).
export async function getPriceStructure(binanceSymbol: string): Promise<PriceStructure | null> {
  try {
    const klines: Kline[] = await fetch(
      binanceFuturesUrl('/fapi/v1/klines', { symbol: binanceSymbol, interval: '4h', limit: '30' })
    ).then((r) => r.json());

    if (!Array.isArray(klines) || klines.length < 15) return null;

    const highs = klines.map((k) => parseFloat(k[2]));
    const lows = klines.map((k) => parseFloat(k[3]));
    const closes = klines.map((k) => parseFloat(k[4]));

    // ATR14 (Wilder simplified: rata-rata true range 14 candle terakhir)
    const period = 14;
    const recentCloses = closes.slice(-period - 1);
    const recentHighs = highs.slice(-period);
    const recentLows = lows.slice(-period);

    const trueRanges = recentHighs.map((high, i) => {
      const low = recentLows[i];
      const prevClose = recentCloses[i];
      return Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose));
    });
    const atr = trueRanges.reduce((a, b) => a + b, 0) / trueRanges.length;

    // Swing high/low dari 10 candle terakhir (~40 jam)
    const swingWindow = 10;
    const swingHigh = Math.max(...highs.slice(-swingWindow));
    const swingLow = Math.min(...lows.slice(-swingWindow));

    if (!Number.isFinite(atr) || !Number.isFinite(swingHigh) || !Number.isFinite(swingLow)) return null;

    return { atr, swingHigh, swingLow };
  } catch {
    return null;
  }
}
