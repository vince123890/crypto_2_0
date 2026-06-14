import { BINANCE_FUTURES } from '../constants';

export async function getCurrentPrice(binanceSymbol: string): Promise<number> {
  const data = await fetch(`${BINANCE_FUTURES}/fapi/v2/ticker/price?symbol=${binanceSymbol}`).then((r) => r.json());
  return parseFloat(data?.price ?? 'NaN');
}
