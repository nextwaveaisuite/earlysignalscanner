# SignalRadar (Minimal Build)

Autonomous Microcap Crypto Signal & Paper Trading (Binance testnet by default)

## Deploy via GitHub + Vercel

1. Unzip and upload this folder to a new **GitHub repo**.
2. In **Vercel**, click **New Project → Import from GitHub** → select your repo.
3. Add Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE`
4. In Supabase SQL Editor → run `supabase.sql`.
5. Visit `/` — you’ll see seeded alerts.
6. Cron `/api/ingest/mock` inserts new alerts every 3 minutes.
