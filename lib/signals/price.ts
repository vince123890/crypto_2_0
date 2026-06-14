import { binanceFuturesUrl } from '../constants';

export async function getCurrentPrice(binanceSymbol: string): Promise<number> {
  const data = await fetch(binanceFuturesUrl('/fapi/v2/ticker/price', { symbol: binanceSymbol })).then((r) =>
    r.json()
  );
  return parseFloat(data?.price ?? 'NaN');
}
