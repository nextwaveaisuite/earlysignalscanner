import Binance from 'binance-api-node';

export function getBinanceClient() {
  const mode = process.env.BINANCE_MODE || 'testnet';
  const apiKey = process.env.BINANCE_API_KEY!;
  const apiSecret = process.env.BINANCE_API_SECRET!;
  const test = mode === 'testnet';
  return Binance({
    apiKey,
    apiSecret,
    httpBase: test ? 'https://testnet.binance.vision' : undefined,
    wsBase: test ? 'wss://testnet.binance.vision' : undefined
  });
}
