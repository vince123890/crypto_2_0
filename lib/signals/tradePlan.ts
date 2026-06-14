import { PriceStructure } from './priceStructure';

export interface TradePlan {
  direction: 'LONG' | 'SHORT';
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  riskPerUnit: number;
}

// Susun rencana Long/Short berdasarkan ATR-based SL + R:R tiers (1.5x dan 3x).
// SL ditempatkan di swing low/high terdekat dikurangi/ditambah 1x ATR.
// Mengembalikan null jika bias NEUTRAL atau struktur harga tidak tersedia.
export function buildTradePlan(bias: string, price: number, structure: PriceStructure): TradePlan | null {
  if (bias === 'NEUTRAL') return null;
  const direction: 'LONG' | 'SHORT' = bias.includes('SHORT') ? 'SHORT' : 'LONG';

  const { atr, swingHigh, swingLow } = structure;

  if (direction === 'LONG') {
    const stopLoss = swingLow - atr;
    const riskPerUnit = price - stopLoss;
    if (riskPerUnit <= 0) return null;

    return {
      direction,
      entry: price,
      stopLoss,
      takeProfit1: price + riskPerUnit * 1.5,
      takeProfit2: price + riskPerUnit * 3,
      riskPerUnit,
    };
  }

  const stopLoss = swingHigh + atr;
  const riskPerUnit = stopLoss - price;
  if (riskPerUnit <= 0) return null;

  return {
    direction,
    entry: price,
    stopLoss,
    takeProfit1: price - riskPerUnit * 1.5,
    takeProfit2: price - riskPerUnit * 3,
    riskPerUnit,
  };
}
