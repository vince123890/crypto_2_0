import { COINGECKO, defillamaStablecoinsUrl } from '../constants';
import { errorResult, SignalResult } from './types';

// A. Stablecoin supply weekly change — max weight 25
export async function getStablecoinSignal(): Promise<SignalResult> {
  try {
    // id=1 -> USDT di DeFiLlama stablecoins API
    const series: { date: string; totalCirculating: { peggedUSD: number } }[] = await fetch(
      defillamaStablecoinsUrl('/stablecoincharts/all', { stablecoin: '1' })
    ).then((r) => r.json());

    if (!Array.isArray(series) || series.length < 8) {
      return errorResult('stablecoin_supply', 'Stablecoin Supply (7d)', 25);
    }

    const now = series[series.length - 1]?.totalCirculating?.peggedUSD;
    const weekAgo = series[series.length - 8]?.totalCirculating?.peggedUSD;

    if (!now || !weekAgo) {
      return errorResult('stablecoin_supply', 'Stablecoin Supply (7d)', 25);
    }

    const weeklyChange = ((now - weekAgo) / weekAgo) * 100;

    let score = 0;
    if (weeklyChange > 5) score = 25;
    else if (weeklyChange > 2) score = 12;
    else if (weeklyChange < -5) score = -25;
    else if (weeklyChange < -2) score = -12;

    return {
      signal: 'stablecoin_supply',
      label: 'Stablecoin Supply (7d)',
      rawValue: `${weeklyChange.toFixed(2)}%`,
      score,
      weight: 25,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('stablecoin_supply', 'Stablecoin Supply (7d)', 25);
  }
}

// B. BTC Dominance — max weight 30
export async function getBTCDominanceSignal(): Promise<SignalResult> {
  try {
    const global = await fetch(`${COINGECKO}/global`).then((r) => r.json());
    const btcDom = global?.data?.market_cap_percentage?.btc;

    if (!Number.isFinite(btcDom)) {
      return errorResult('btc_dominance', 'BTC Dominance', 30);
    }

    let score = 0;
    if (btcDom > 62) score = 20;
    else if (btcDom > 55) score = 10;
    else if (btcDom < 42) score = -20;
    else if (btcDom < 48) score = -10;

    return {
      signal: 'btc_dominance',
      label: 'BTC Dominance',
      rawValue: `${btcDom.toFixed(1)}%`,
      score,
      weight: 30,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('btc_dominance', 'BTC Dominance', 30);
  }
}

// C. Volume Anomaly (24h vs 7d avg) — max weight 20
export async function getVolumeAnomalySignal(coinId: string): Promise<SignalResult> {
  try {
    const data = await fetch(
      `${COINGECKO}/coins/${coinId}/market_chart?vs_currency=usd&days=8&interval=daily`
    ).then((r) => r.json());

    const volumes: number[] = (data?.total_volumes ?? []).map((v: [number, number]) => v[1]);
    if (volumes.length < 8) {
      return errorResult('volume_anomaly', 'Volume Anomaly', 20);
    }

    const today = volumes[volumes.length - 1];
    const avg7d = volumes.slice(-8, -1).reduce((a: number, b: number) => a + b, 0) / 7;
    if (avg7d === 0) {
      return errorResult('volume_anomaly', 'Volume Anomaly', 20);
    }
    const ratio = today / avg7d;

    let score = 0;
    if (ratio > 3) score = 20;
    else if (ratio > 2) score = 13;
    else if (ratio > 1.5) score = 7;
    else if (ratio < 1) score = -5;

    return {
      signal: 'volume_anomaly',
      label: 'Volume Anomaly (24h/7d avg)',
      rawValue: `${ratio.toFixed(2)}x`,
      score,
      weight: 20,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('volume_anomaly', 'Volume Anomaly', 20);
  }
}

export async function getLiquiditySignals(coinId: string): Promise<SignalResult[]> {
  return Promise.all([getStablecoinSignal(), getBTCDominanceSignal(), getVolumeAnomalySignal(coinId)]);
}
