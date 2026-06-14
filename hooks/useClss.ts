'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { REFRESH_INTERVALS, SymbolConfig } from '../lib/constants';
import { calculateCLSS, CLSSResult } from '../lib/signals/clss';
import { getDerivativeSignals } from '../lib/signals/derivatives';
import { getLiquiditySignals } from '../lib/signals/liquidity';
import { getOnchainSignals } from '../lib/signals/onchain';
import { getCurrentPrice } from '../lib/signals/price';
import { getPriceStructure } from '../lib/signals/priceStructure';
import { buildTradePlan, TradePlan } from '../lib/signals/tradePlan';
import { appendSnapshot } from '../lib/storage/history';

export interface ClssData {
  result: CLSSResult;
  price: number;
  tradePlan: TradePlan | null;
}

export function useClss(symbolKey: 'BTC' | 'ETH', config: SymbolConfig) {
  const queryClient = useQueryClient();

  const query = useQuery<ClssData>({
    queryKey: ['clss', symbolKey],
    queryFn: async () => {
      const [onchain, derivatives, liquidity, price, structure] = await Promise.all([
        getOnchainSignals(symbolKey),
        getDerivativeSignals(config.binanceSymbol),
        getLiquiditySignals(config.coingeckoId),
        getCurrentPrice(config.binanceSymbol),
        getPriceStructure(config.binanceSymbol),
      ]);

      const result = calculateCLSS(symbolKey, onchain, derivatives, liquidity);
      const tradePlan = structure ? buildTradePlan(result.bias, price, structure) : null;
      return { result, price, tradePlan };
    },
    refetchInterval: REFRESH_INTERVALS.microstructure,
    staleTime: REFRESH_INTERVALS.microstructure,
  });

  // Simpan snapshot ke localStorage setiap kali data baru berhasil di-fetch
  useEffect(() => {
    if (query.data && Number.isFinite(query.data.price)) {
      appendSnapshot({
        timestamp: query.data.result.timestamp,
        symbol: symbolKey,
        CLSS: query.data.result.CLSS,
        price: query.data.price,
        bias: query.data.result.bias,
      });
    }
  }, [query.data, symbolKey]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['clss', symbolKey] });

  return { ...query, refresh };
}
