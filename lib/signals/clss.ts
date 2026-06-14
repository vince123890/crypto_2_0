import { SignalResult } from './types';

export interface CategoryResult {
  score: number;
  signals: SignalResult[];
}

export interface CLSSResult {
  symbol: string;
  timestamp: number;
  categories: {
    onchain: CategoryResult;
    derivatives: CategoryResult;
    liquidity: CategoryResult;
  };
  CLSS: number;
  bias: string;
  sizing: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  consensusCount: number;
  consensusWarning: boolean;
}

const WEIGHTS = { onchain: 0.3, derivatives: 0.35, liquidity: 0.25 };

function categoryScore(signals: SignalResult[]): number {
  const valid = signals.filter((s) => s.status === 'ok');
  if (valid.length === 0) return 0;
  const totalWeight = valid.reduce((a, s) => a + s.weight, 0);
  const weightedSum = valid.reduce((a, s) => a + s.score, 0);
  return totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
}

export function calculateCLSS(
  symbol: string,
  onchainSignals: SignalResult[],
  derivSignals: SignalResult[],
  liquiditySignals: SignalResult[]
): CLSSResult {
  const onchainScore = categoryScore(onchainSignals);
  const derivScore = categoryScore(derivSignals);
  const liquidityScore = categoryScore(liquiditySignals);

  const CLSS = onchainScore * WEIGHTS.onchain + derivScore * WEIGHTS.derivatives + liquidityScore * WEIGHTS.liquidity;

  const allSignals = [...onchainSignals, ...derivSignals, ...liquiditySignals].filter((s) => s.status === 'ok');

  const direction = Math.sign(CLSS);
  const consensusCount = allSignals.filter((s) => s.score !== 0 && Math.sign(s.score) === direction).length;

  let bias: string;
  let sizing: string;
  if (CLSS >= 60) {
    bias = 'STRONG LONG';
    sizing = '1.0x';
  } else if (CLSS >= 30) {
    bias = 'LONG';
    sizing = '0.5x';
  } else if (CLSS >= 10) {
    bias = 'MILD LONG';
    sizing = '0.25x';
  } else if (CLSS <= -60) {
    bias = 'STRONG SHORT';
    sizing = '1.0x';
  } else if (CLSS <= -30) {
    bias = 'SHORT';
    sizing = '0.5x';
  } else if (CLSS <= -10) {
    bias = 'MILD SHORT';
    sizing = '0.25x';
  } else {
    bias = 'NEUTRAL';
    sizing = '0x';
  }

  return {
    symbol,
    timestamp: Date.now(),
    categories: {
      onchain: { score: onchainScore, signals: onchainSignals },
      derivatives: { score: derivScore, signals: derivSignals },
      liquidity: { score: liquidityScore, signals: liquiditySignals },
    },
    CLSS,
    bias,
    sizing,
    confidence: Math.abs(CLSS) > 50 ? 'HIGH' : Math.abs(CLSS) > 25 ? 'MEDIUM' : 'LOW',
    consensusCount,
    consensusWarning: consensusCount < 3,
  };
}
