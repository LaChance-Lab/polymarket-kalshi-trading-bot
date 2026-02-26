# PolyMarket & Kalshi Trading Bot

Automated trading bots for prediction markets — **PolyMarket** (TypeScript) and **Kalshi** (Rust/TypeScript). Built for reliability, clear configuration, and production-style usage.

---

## Overview

This repository provides **systematic trading automation** for two major prediction-market platforms:

| Platform    | Stack        | Description |
| ----------- | ------------ | ----------- |
| **PolyMarket** | TypeScript/Node | Automated bot for Polymarket’s CLOB API: discovers active BTC 5‑minute “Up or Down” markets, places both-sided BUY orders when price conditions are met, tracks fills, and places corresponding SELLs with configurable delays and exit logic. |
| **Kalshi**     | Rust / TypeScript | Trading automation for Kalshi markets (structure may vary by subdirectory). |

All bots are designed to be **config-driven**, **auditable** (logging, clear state), and **safe** (order size limits, fill tracking, no double-sell).

---

## Repository structure

```
.
├── polymarket/
│   └── ts-version/          # Polymarket bot (TypeScript)
│       ├── src/
│       │   ├── index.ts     # Entry point
│       │   ├── bot.ts       # Core trading logic
│       │   └── types.ts     # Shared types
│       ├── config/          # Configuration loader
│       ├── env.template     # Environment template
│       ├── package.json
│       └── README.md        # Full setup & usage for Polymarket
├── LICENSE                  # MIT
└── README.md                # This file
```

---

## Quick start (PolyMarket bot)

1. **Prerequisites:** Node.js 18+, npm (or pnpm/yarn). A Polymarket account with USDC on Polygon and trading enabled.

2. **Install and configure:**
   ```bash
   cd polymarket/ts-version
   npm install
   cp env.template .env
   # Edit .env: PRIVATE_KEY, FUNDER_ADDRESS (Safe proxy), trading params
   ```

3. **Run:**
   ```bash
   npm run dev
   ```

See **[polymarket/ts-version/README.md](polymarket/ts-version/README.md)** for full documentation: environment variables, Gnosis Safe setup, order sizing, sell delay, troubleshooting, and references to the Polymarket CLOB API.

---

## Features (PolyMarket bot)

- **Wallet support:** EOA + optional Gnosis Safe proxy (`FUNDER_ADDRESS`) for full CLOB compatibility (e.g. `signatureType = 2`).
- **Market discovery:** Finds active BTC 5‑minute markets via Gamma API; enters each market at most once per run.
- **Both-sided entry:** Places BUY orders on both Up and Down at configurable limit prices when conditions are met.
- **Fill tracking:** Tracks BUY order IDs and sizes; places exactly one SELL per filled side after a configurable delay (`SELL_DELAY_MS`) to allow outcome-token settlement.
- **Configurable exits:** Optional aggressive exit (cancel resting SELL, place marketable SELL) when close to resolution; configurable via `EXIT_BEFORE_CLOSE_SECONDS` and `AGGRESSIVE_EXIT_PRICE`.
- **Modes:** `TRADING_MODE=continuous` (default) or `once` (single market duration then exit).

---

## Configuration

Configuration is via **environment variables**. Copy `env.template` to `.env` in the relevant bot directory and set:

- **Credentials:** `PRIVATE_KEY`, (optional) `FUNDER_ADDRESS`, and for Polymarket CLOB optionally `POLY_API_KEY`, `POLY_SECRET`, `POLY_PASSPHRASE`.
- **Endpoints:** `CLOB_HOST`, `GAMMA_HOST`, `CHAIN_ID` (e.g. 137 for Polygon).
- **Trading:** `TARGET_PRICE_UP`, `SELL_PRICE_UP`, `TARGET_PRICE_DOWN`, `SELL_PRICE_DOWN` (or legacy `TARGET_PRICE`/`SELL_PRICE`), `ORDER_AMOUNT_TOKEN`, `CHECK_INTERVAL`, `SELL_DELAY_MS`, `MIN_SECONDS_BEFORE_EXPIRY`, `EXIT_BEFORE_CLOSE_SECONDS`, `AGGRESSIVE_EXIT_PRICE`, `TRADING_MODE`.

See each bot’s README and `env.template` for the full list and defaults.

---

## Disclaimer

This software is for **educational and research purposes**. Prediction markets and automated trading involve financial risk. Use at your own risk; the authors are not responsible for any losses. Always comply with the terms of service of PolyMarket, Kalshi, and any connected services. Test with small sizes and on testnets or paper trading where available.

---

## License

MIT License. See [LICENSE](LICENSE).

Copyright (c) 2025 LaChance Lab.

---

## Contact

- **Telegram:** [https://t.me/lachancelab](https://t.me/lachancelab)
- **Support:** For questions, integration support, or custom automation, reach out via the link above.
