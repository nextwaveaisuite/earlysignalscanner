# SignalRadar

Clean starter for SignalRadar (Microcap Crypto Signal + Auto-Trading).

## Quick Deploy (Vercel)

1. Create a new Vercel project and upload this zip folder.
2. Add Environment Variables (Project → Settings → Environment Variables):
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE        (NOTE: key name without `_KEY`)
   - BINANCE_MODE                 (testnet | live)
   - BINANCE_API_KEY
   - BINANCE_API_SECRET
   - X_BEARER_TOKEN               (optional)
   - TELEGRAM_RSS_URL             (optional)
   - TELEGRAM_BOT_TOKEN           (optional)
   - TELEGRAM_CHAT_ID             (optional)

3. In Supabase, run `supabase.sql` (SQL Editor) to create tables.
4. Visit `/` for the dashboard.
5. Cron routes will auto-run from `vercel.json`.

## Notes
- Default behavior is **paper trading** when `BINANCE_MODE=testnet`.
- Replace placeholder ingestion code with your real source fetchers as needed.


---

## Upload to GitHub (no Git commands)
1. Unzip this folder locally.
2. On GitHub, create a new repository (e.g., `SignalRadar`).
3. Click **Add file ▾ → Upload files**.
4. Drag **all unzipped files and folders** (not the ZIP) into the uploader.
5. Click **Commit changes**.
6. In Vercel: **New Project → Import from GitHub → select your repo → Deploy**.
   - Add env vars in Project → Settings → Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE`
     - `BINANCE_MODE` = `testnet`
     - `BINANCE_API_KEY`, `BINANCE_API_SECRET`
     - (optional) `X_BEARER_TOKEN`, `TELEGRAM_*`
