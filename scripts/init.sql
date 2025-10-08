-- Tokens master (basic metadata)
create table if not exists tokens (
  token text primary key,
  symbol text,
  name text
);

-- Alerts stream (raw signals)
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  token text references tokens(token),
  symbol text,
  message text,
  score numeric,
  risk text check (risk in ('LOW','MEDIUM','HIGH')),
  confidence numeric,
  created_at timestamptz default now()
);

-- Scores (latest scoring snapshot per token)
create table if not exists scores (
  token text primary key references tokens(token),
  score numeric,
  risk text check (risk in ('LOW','MEDIUM','HIGH')),
  confidence numeric,
  sparkline numeric[] default '{}',
  updated_at timestamptz default now()
);

-- View joining scores + token metadata used by /api/score
create or replace view scores_with_tokens as
select
  s.token,
  t.symbol,
  t.name,
  s.score,
  s.risk,
  s.confidence,
  s.sparkline
from scores s
left join tokens t on t.token = s.token;

-- Daily P/L (paper/live aggregation written by your worker)
create table if not exists daily_pl (
  date date primary key,
  realized numeric default 0,
  unrealized numeric default 0
);

-- Helpful indexes
create index if not exists idx_alerts_created_at on alerts(created_at desc);
create index if not exists idx_scores_score on scores(score desc);
