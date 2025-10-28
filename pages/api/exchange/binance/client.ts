import Binance from "binance-api-node";

/**
 * Returns a configured Binance REST/WebSocket client.
 * Safe: if keys are missing, it returns an unauthenticated public client.
 * Testnet is used by default (BINANCE_MODE='testnet').
 */
export function getBinanceClient() {
  const mode = process.env.BINANCE_MODE || "testnet"; // 'testnet' | 'live'
  const apiKey = process.env.BINANCE_API_KEY || "";
  const apiSecret = process.env.BINANCE_API_SECRET || "";

  if (mode === "testnet") {
    // Spot Testnet endpoints
    return Binance({
      apiKey,
      apiSecret,
      httpBase: "https://testnet.binance.vision/api",
      wsBase: "wss://testnet.binance.vision/ws"
    });
  }

  // Live (production)
  return Binance({
    apiKey,
    apiSecret
  });
}
