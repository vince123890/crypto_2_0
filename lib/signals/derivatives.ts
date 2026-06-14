import { BINANCE_FUTURES, BINANCE_SPOT } from '../constants';
import { errorResult, SignalResult } from './types';

// A. Open Interest (OI) — max weight 30
export async function getOpenInterestSignal(symbol: string): Promise<SignalResult> {
  try {
    const [oiNow, oiHistory] = await Promise.all([
      fetch(`${BINANCE_FUTURES}/fapi/v1/openInterest?symbol=${symbol}`).then((r) => r.json()),
      fetch(`${BINANCE_FUTURES}/futures/data/openInterestHist?symbol=${symbol}&period=1h&limit=25`).then((r) =>
        r.json()
      ),
    ]);

    const currentOI = parseFloat(oiNow.openInterest);
    const prevOI = parseFloat(oiHistory?.[0]?.sumOpenInterest ?? currentOI);
    if (!Number.isFinite(currentOI) || !Number.isFinite(prevOI) || prevOI === 0) {
      return errorResult('open_interest', 'Open Interest (24h)', 30);
    }
    const oiChange = ((currentOI - prevOI) / prevOI) * 100;

    let score = 0;
    if (oiChange > 20) score = 30;
    else if (oiChange > 10) score = 18;
    else if (oiChange > 5) score = 9;
    else if (oiChange < -10) score = -24;
    else if (oiChange < -5) score = -12;

    return {
      signal: 'open_interest',
      label: 'Open Interest (24h)',
      rawValue: `${oiChange.toFixed(2)}%`,
      score,
      weight: 30,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('open_interest', 'Open Interest (24h)', 30);
  }
}

// B. Funding Rate (contrarian) — max weight 30
export async function getFundingRateSignal(symbol: string): Promise<SignalResult> {
  try {
    const data = await fetch(`${BINANCE_FUTURES}/fapi/v1/fundingRate?symbol=${symbol}&limit=3`).then((r) =>
      r.json()
    );

    const latestRate = parseFloat(data?.[0]?.fundingRate) * 100;
    if (!Number.isFinite(latestRate)) {
      return errorResult('funding_rate', 'Funding Rate', 30);
    }

    let score = 0;
    if (latestRate > 0.3) score = -30;
    else if (latestRate > 0.1) score = -15;
    else if (latestRate > 0.01) score = -5;
    else if (latestRate < -0.1) score = 30;
    else if (latestRate < -0.05) score = 15;

    return {
      signal: 'funding_rate',
      label: 'Funding Rate (contrarian)',
      rawValue: `${latestRate.toFixed(4)}%`,
      score,
      weight: 30,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('funding_rate', 'Funding Rate', 30);
  }
}

// C. Top Trader Long/Short Ratio — max weight 25
export async function getTopTraderRatioSignal(symbol: string): Promise<SignalResult> {
  try {
    const data = await fetch(
      `${BINANCE_FUTURES}/futures/data/topLongShortPositionRatio?symbol=${symbol}&period=1h&limit=1`
    ).then((r) => r.json());

    const ratio = parseFloat(data?.[0]?.longShortRatio);
    if (!Number.isFinite(ratio)) {
      return errorResult('top_trader_ratio', 'Top Trader L/S Ratio', 25);
    }

    let score = 0;
    if (ratio > 1.5) score = 25;
    else if (ratio > 1.2) score = 12;
    else if (ratio < 0.7) score = -25;
    else if (ratio < 0.85) score = -12;

    return {
      signal: 'top_trader_ratio',
      label: 'Top Trader L/S Ratio',
      rawValue: ratio.toFixed(2),
      score,
      weight: 25,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('top_trader_ratio', 'Top Trader L/S Ratio', 25);
  }
}

// D. Order Book Imbalance (2% range) — max weight 15
export async function getOrderBookImbalance(symbol: string): Promise<SignalResult> {
  try {
    const book = await fetch(`${BINANCE_SPOT}/api/v3/depth?symbol=${symbol}&limit=500`).then((r) => r.json());

    const bids: [string, string][] = book.bids ?? [];
    const asks: [string, string][] = book.asks ?? [];
    if (bids.length === 0 || asks.length === 0) {
      return errorResult('orderbook_imbalance', 'Order Book Imbalance', 15);
    }

    const midPrice = (parseFloat(bids[0][0]) + parseFloat(asks[0][0])) / 2;
    const rangePct = 0.02;

    const bidVolume = bids
      .filter(([p]) => parseFloat(p) >= midPrice * (1 - rangePct))
      .reduce((acc, [, v]) => acc + parseFloat(v), 0);

    const askVolume = asks
      .filter(([p]) => parseFloat(p) <= midPrice * (1 + rangePct))
      .reduce((acc, [, v]) => acc + parseFloat(v), 0);

    if (askVolume === 0) {
      return errorResult('orderbook_imbalance', 'Order Book Imbalance', 15);
    }

    const imbalance = bidVolume / askVolume;

    let score = 0;
    if (imbalance > 1.8) score = 15;
    else if (imbalance > 1.4) score = 8;
    else if (imbalance < 0.6) score = -15;
    else if (imbalance < 0.75) score = -8;

    return {
      signal: 'orderbook_imbalance',
      label: 'Order Book Imbalance (2%)',
      rawValue: imbalance.toFixed(2),
      score,
      weight: 15,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('orderbook_imbalance', 'Order Book Imbalance', 15);
  }
}

export async function getDerivativeSignals(symbol: string): Promise<SignalResult[]> {
  return Promise.all([
    getOpenInterestSignal(symbol),
    getFundingRateSignal(symbol),
    getTopTraderRatioSignal(symbol),
    getOrderBookImbalance(symbol),
  ]);
}
