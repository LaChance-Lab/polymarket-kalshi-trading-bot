/// <reference types="node" />
import "dotenv/config";

export interface Config {
  PRIVATE_KEY: string | undefined;
  CLOB_HOST: string;
  CHAIN_ID: string;
  GAMMA_HOST: string;
  TARGET_PRICE_UP: string;
  SELL_PRICE_UP: string;
  TARGET_PRICE_DOWN: string;
  SELL_PRICE_DOWN: string;
  ORDER_AMOUNT_TOKEN: string;
  CHECK_INTERVAL: string;
  SELL_DELAY_MS: string;
  MIN_SECONDS_TO_ENTER: string | undefined;
  /** Skip markets that expire in less than this many seconds (default 180 = 3 min). */
  MIN_SECONDS_BEFORE_EXPIRY: string | undefined;
  EXIT_BEFORE_CLOSE_SECONDS: string | undefined;
  AGGRESSIVE_EXIT_PRICE: string | undefined;
  TRADING_MODE: string;
  LOG_FILE: string | undefined;
  FUNDER_ADDRESS: string | undefined;
  POLY_API_KEY: string | undefined;
  POLY_SECRET: string | undefined;
  POLY_PASSPHRASE: string | undefined;
}

/**
 * Central config: all .env variables. Load dotenv first so process.env is populated.
 * The bot can read from config.* instead of process.env for a single source of truth.
 */
export const config: Config = {
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  CLOB_HOST: process.env.CLOB_HOST ?? "https://clob.polymarket.com",
  CHAIN_ID: process.env.CHAIN_ID ?? "137",
  GAMMA_HOST: process.env.GAMMA_HOST ?? "https://gamma-api.polymarket.com",
  // Per-outcome prices: use TARGET_PRICE_UP etc. if set, else TARGET_PRICE/SELL_PRICE, else default
  TARGET_PRICE_UP: process.env.TARGET_PRICE_UP ?? process.env.TARGET_PRICE ?? "0.01",
  SELL_PRICE_UP: process.env.SELL_PRICE_UP ?? process.env.SELL_PRICE ?? "0.05",
  TARGET_PRICE_DOWN: process.env.TARGET_PRICE_DOWN ?? process.env.TARGET_PRICE ?? "0.01",
  SELL_PRICE_DOWN: process.env.SELL_PRICE_DOWN ?? process.env.SELL_PRICE ?? "0.05",
  /** Number of shares (tokens) to buy per side; USD per side = ORDER_AMOUNT_TOKEN × TARGET_PRICE_UP / TARGET_PRICE_DOWN */
  ORDER_AMOUNT_TOKEN: process.env.ORDER_AMOUNT_TOKEN ?? "5",
  CHECK_INTERVAL: process.env.CHECK_INTERVAL ?? "10000",
  SELL_DELAY_MS: process.env.SELL_DELAY_MS ?? "10000",
  MIN_SECONDS_TO_ENTER: process.env.MIN_SECONDS_TO_ENTER,
  MIN_SECONDS_BEFORE_EXPIRY: process.env.MIN_SECONDS_BEFORE_EXPIRY,
  EXIT_BEFORE_CLOSE_SECONDS: process.env.EXIT_BEFORE_CLOSE_SECONDS,
  AGGRESSIVE_EXIT_PRICE: process.env.AGGRESSIVE_EXIT_PRICE,
  TRADING_MODE: process.env.TRADING_MODE ?? "once",
  LOG_FILE: process.env.LOG_FILE,
  FUNDER_ADDRESS: process.env.FUNDER_ADDRESS,
  POLY_API_KEY: process.env.POLY_API_KEY,
  POLY_SECRET: process.env.POLY_SECRET,
  POLY_PASSPHRASE: process.env.POLY_PASSPHRASE,
} as const;
