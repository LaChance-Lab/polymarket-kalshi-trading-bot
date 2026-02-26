## Polymarket Bitcoin 5-Minute Bot

Automated TS/Node bot that trades Polymarket’s BTC 5‑minute “Up or Down” markets via the official CLOB API.

It:
- Connects with your Polymarket wallet (EOA + Gnosis Safe proxy)
- Finds currently active BTC 5‑minute markets
- Places a single **both‑sided BUY** (Up & Down) per market when price conditions are met
- Tracks fills and places a corresponding **SELL** once per filled side

### 1. Prerequisites

- **Node.js** 18+
- **npm** (or `pnpm`/`yarn`, but examples use npm)
- A Polymarket account funded with **USDC on Polygon** and already enabled for trading

### 2. Install dependencies

From the project root:

```bash
cd arcane-build/polymarket-bot
npm install
```

### 3. Configure environment

Create a `.env` file (or copy from the template):

```bash
cp env.template .env
```

Then edit `.env`:

```env
PRIVATE_KEY=0x...         # EOA private key that controls your Polymarket account
CLOB_HOST=https://clob.polymarket.com
CHAIN_ID=137               # Polygon
GAMMA_HOST=https://gamma-api.polymarket.com

# Trading parameters
TARGET_PRICE=0.45          # BUY limit price
SELL_PRICE=0.55            # SELL limit price after fill
ORDER_AMOUNT_USD=2.25      # USD per side (see note below)
CHECK_INTERVAL=10000       # ms between loops
SELL_DELAY_MS=10000        # ms to wait after a fill before placing SELL (settlement delay)
# MIN_SECONDS_TO_ENTER=20   # default 20s = enter/sell even 20s before close; set e.g. 240 for 4 min buffer
# EXIT_BEFORE_CLOSE_SECONDS=20  # when ≤ this many seconds left, cancel SELL and place aggressive exit (don't hold into resolution)
# AGGRESSIVE_EXIT_PRICE=0.4     # price for that emergency exit SELL (default 0.40)

# TRADING_MODE=continuous       # loop forever (default); TRADING_MODE=once = trade only one market duration, then exit
# LOG_FILE=logs/trading.log     # optional: append all trading activity to this file

# (Optional but strongly recommended for signatureType=2)
# Gnosis Safe proxy deployed by Polymarket for this wallet (funder/maker address)
FUNDER_ADDRESS=0xYourSafeProxyAddress
```

#### About `PRIVATE_KEY` and `FUNDER_ADDRESS`

- `PRIVATE_KEY` should be the **EOA** you use with Polymarket (e.g. MetaMask).  
- Polymarket often deploys a **Gnosis Safe proxy** for your account; that Safe holds your CLOB trading balance.
- For full compatibility with the CLOB client (`signatureType = 2` / Safe mode), set:
  - `FUNDER_ADDRESS` = your Safe proxy address

If you don’t know your Safe address, you can look it up using Gnosis Safe’s transaction service for Polygon, or via Polymarket tooling. The bot will fall back to using the EOA itself if `FUNDER_ADDRESS` is not set, but Safe mode is recommended.

#### About `ORDER_AMOUNT_USD` and minimum size

For BTC 5‑minute markets the CLOB currently enforces a **minimum of 5 shares per order**.

Given `TARGET_PRICE`, you should set:

\[ ORDER\_AMOUNT\_USD \ge 5 \times TARGET\_PRICE \]

Example:

- `TARGET_PRICE = 0.45`
- `ORDER_AMOUNT_USD >= 5 * 0.45 = 2.25`

If `ORDER_AMOUNT_USD` is too small for 5 shares, the bot will log a warning and **skip entering that market** instead of overspending.

### 4. Run the bot

Development / watch mode (same as start, but convenient while iterating):

```bash
npm run dev
```

The bot will:

1. Load configuration from `.env`
2. Connect to Polygon RPC (`https://polygon.drpc.org` by default)
3. Derive or use existing CLOB API credentials
4. Log your USDC balance/allowance
5. Repeatedly:
   - Cancel expired BUY orders
   - Check for filled BUYs and place corresponding SELLs
   - Discover active BTC 5‑minute markets and enter **each market at most once**

Stop with `Ctrl+C`:

```bash
Shutting down bot gracefully...
```

### 5. Behavior overview

- **One entry per market:** the bot records entered markets in an in‑memory map and will not re‑enter the same BTC 5‑minute market during the process lifetime.
- **Tracked BUYs:** every successful BUY (Up/Down) is tracked by `orderID`, market, outcome, and size.
- **Single SELL per fill:** once a BUY is detected as filled, the bot issues **one SELL** for exactly that size and removes it from its tracking map so it won’t sell twice.

### 6. Building & type‑checking

Optional, if you want compiled JS or to run TS checks explicitly:

```bash
# Type-check only
npm run typecheck

# Build to dist/
npm run build
```

### 7. Troubleshooting

**"not enough balance / allowance" when placing SELL**

After a BUY fills, the CLOB needs a short time to credit the **outcome tokens** to your maker (Safe). If the bot places a SELL too soon, the exchange may reject it with "not enough balance/allowance" because it still sees zero outcome-token balance.

- The bot now **waits `SELL_DELAY_MS`** (default **10000** ms) after detecting a fill before placing the SELL, and adds a 4s gap between processing multiple fills in the same cycle. Increase `SELL_DELAY_MS` (e.g. `SELL_DELAY_MS=5000`) if you still see the error.
- If the first SELL attempt fails with that message, the bot **keeps the order in tracking** and will **retry** on the next loop instead of dropping it.

### 8. Useful references

- Polymarket CLOB docs (orders, auth, and clients):  
  `https://docs.polymarket.com/developers/CLOB/`
- Official TypeScript CLOB client:  
  `https://github.com/Polymarket/clob-client`

