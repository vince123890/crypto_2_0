import { ETH_EXCHANGE_WALLETS, ETHERSCAN, ETHERSCAN_API_KEY, MEMPOOL, SymbolKey } from '../constants';
import { readPrevSnapshot, saveSnapshot } from '../storage/snapshots';
import { errorResult, SignalResult } from './types';

// D. Bitcoin mempool congestion (activity intensity) — max weight 20, BTC only
export async function getMempoolSignal(): Promise<SignalResult> {
  try {
    const mempool = await fetch(`${MEMPOOL}/mempool`).then((r) => r.json());
    const vsize = mempool?.vsize;
    if (!Number.isFinite(vsize)) {
      return errorResult('mempool_activity', 'Mempool Activity', 20);
    }
    const sizeMB = vsize / 1_000_000;

    // Sinyal ini melaporkan intensitas aktivitas, bukan arah (lihat dokumen riset 4.1.D).
    // Score >= 0: makin besar mempool, makin tinggi kemungkinan whale movement besar terjadi.
    let score = 0;
    if (sizeMB > 300) score = 20;
    else if (sizeMB > 50) score = 10;

    return {
      signal: 'mempool_activity',
      label: 'Mempool Activity (BTC)',
      rawValue: `${sizeMB.toFixed(1)} MB`,
      score,
      weight: 20,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('mempool_activity', 'Mempool Activity (BTC)', 20);
  }
}

// A. Exchange flow proxy (ETH via Etherscan known hot wallets) — max weight 30
export async function getExchangeFlowSignalETH(): Promise<SignalResult> {
  if (!ETHERSCAN_API_KEY) {
    return errorResult('exchange_flow', 'Exchange Flow (ETH)', 30);
  }
  try {
    const addrs = ETH_EXCHANGE_WALLETS.join(',');
    const data = await fetch(
      `${ETHERSCAN}?module=account&action=balancemulti&address=${addrs}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
    ).then((r) => r.json());

    const result: { balance: string }[] = data?.result;
    if (!Array.isArray(result)) {
      return errorResult('exchange_flow', 'Exchange Flow (ETH)', 30);
    }

    const totalWei = result.reduce((sum, w) => sum + BigInt(w.balance ?? '0'), BigInt(0));
    const totalETH = Number(totalWei) / 1e18;

    const snapshotKey = 'eth_exchange_balance';
    const prev = readPrevSnapshot(snapshotKey);

    if (!prev) {
      saveSnapshot(snapshotKey, totalETH);
      return {
        signal: 'exchange_flow',
        label: 'Exchange Flow (ETH)',
        rawValue: 'baseline collected',
        score: 0,
        weight: 30,
        status: 'ok',
        fetchedAt: Date.now(),
      };
    }

    const change = ((totalETH - prev.value) / prev.value) * 100;

    let score = 0;
    if (change > 5) score = -30; // balance naik = distribusi = bearish
    else if (change > 2) score = -15;
    else if (change < -5) score = 30; // balance turun = akumulasi = bullish
    else if (change < -2) score = 15;

    saveSnapshot(snapshotKey, totalETH);

    return {
      signal: 'exchange_flow',
      label: 'Exchange Flow (ETH)',
      rawValue: `${change.toFixed(2)}% since last check`,
      score,
      weight: 30,
      status: 'ok',
      fetchedAt: Date.now(),
    };
  } catch {
    return errorResult('exchange_flow', 'Exchange Flow (ETH)', 30);
  }
}

export async function getOnchainSignals(symbol: SymbolKey): Promise<SignalResult[]> {
  if (symbol === 'BTC') {
    return Promise.all([getMempoolSignal()]);
  }
  return Promise.all([getExchangeFlowSignalETH()]);
}
