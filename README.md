# Polymarket Trading Dashboard

Real-time dashboard for monitoring Polymarket trading performance.

## 🚀 Live Dashboard
https://polymarket-dashboard-wheat.vercel.app

## 📊 Features
- Real-time P&L tracking with live market prices
- Open positions monitoring (auto-refresh every 30s)
- Trade history with filtering
- P&L over time chart
- Win rate and performance stats

## 🔧 Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Redis (for real-time data)

**Option A: Upstash Redis (Recommended)**
1. Go to https://console.upstash.com
2. Create a new Redis database
3. Copy the "REDIS_URL" or "KV_URL"

**Option B: Vercel KV**
1. Go to Vercel dashboard → Storage → Create KV Database
2. Link to your project

### 3. Environment Variables

Create `.env.local`:
```bash
# Redis connection (required for real-time updates)
REDIS_URL=redis://default:password@host:port

# Or if using Vercel KV:
KV_URL=redis://default:password@host:port
KV_REST_API_URL=https://your-db.upstash.io
KV_REST_API_TOKEN=your-token
```

### 4. Run Locally
```bash
npm run dev
```

Open http://localhost:3000

## 🔄 Data Flow

```
Autonomous Trader (Running on your machine)
    ↓ writes every 3 min
Redis Database (Upstash/Vercel KV)
    ↓ reads via API
Vercel Dashboard (Live worldwide)
```

## 📁 Project Structure

```
app/
├── api/data/route.ts     # API endpoint that reads from Redis
├── page.tsx              # Dashboard main page
├── positions/            # Positions page
└── history/              # Trade history page

components/
├── sidebar.tsx           # Navigation
├── pnl-chart.tsx         # P&L chart
├── positions-table.tsx   # Positions table
└── ui/                   # UI components

lib/
├── redis.ts              # Redis client
├── data.ts               # Data fetching
└── types.ts              # TypeScript types
```

## 🛠️ Connecting Your Trader

The autonomous trader automatically syncs to Redis if `REDIS_URL` is set:

```bash
# In your trader directory
export REDIS_URL=redis://...
python3 autonomous_trader.py
```

## 📝 Notes

- Dashboard falls back to filesystem if Redis is not configured
- Data refreshes every 30 seconds automatically
- Dark theme by default

## 🐛 Troubleshooting

**"Redis not configured" warning:**
- Make sure `REDIS_URL` or `KV_URL` is set in environment variables
- For local dev, create `.env.local` file

**Data not updating:**
- Check that trader is running with Redis URL set
- Verify Redis connection in Vercel dashboard (for KV)
- Check browser console for API errors

## 📊 Current Status

The dashboard shows:
- **Realized P&L**: Profits from closed trades
- **Live P&L**: Current value of open positions
- **Win Rate**: Percentage of profitable trades
- **Active Positions**: Currently open trades

All data comes from your autonomous trader in real-time!
