# SignalRadar (minimal)

- Next.js 14 + TypeScript
- Supabase server-side client for /api/alerts
- Healthcheck at /api/health

## Env (Vercel → Project → Settings → Environment Variables)
Accepts either naming pair:
- `NEXT_PUBLIC_SUPABASE_URL` **or** `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` **or** `SUPABASE_SERVICE_KEY`
- (Optional) `NEXT_PUBLIC_SITE_URL`

## Deploy
Push to `main` → Vercel auto-builds.
Open `/api/health` and `/api/alerts`.
