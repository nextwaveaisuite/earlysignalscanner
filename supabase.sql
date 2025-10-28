-- Minimal schema to run SignalRadar demo (extend as needed)

create table if not exists tokens (
  id bigserial primary key,
  symbol text unique not null,      -- e.g., PEPEUSDT
  name text,
  created_at timestamptz default now()
);

create table if not exists scores (
  id bigserial primary key,
  token_id bigint references tokens(id),
  score int,
  confidence int,
  risk_band text,                   -- LOW|MEDIUM|HIGH
  created_at timestamptz default now()
);

create table if not exists alerts (
  id bigserial primary key,
  token_symbol text not null,
  risk_band text not null,
  confidence int not null,
  score int not null,
  created_at timestamptz default now()
);

create table if not exists news_items (
  id bigserial primary key,
  token_symbol text not null,
  title text,
  url text,
  created_at timestamptz default now()
);

create table if not exists social_posts (
  id bigserial primary key,
  token_symbol text not null,
  source text,
  text text,
  created_at timestamptz default now()
);

create or replace view scores_with_tokens as
select
  s.id as score_id,
  t.symbol as token_symbol,
  s.confidence::int,
  s.risk_band,
  s.score::int,
  s.created_at
from scores s
join tokens t on t.id = s.token_id;

-- Strategy / trading
create table if not exists strategy_params (
  id bigserial primary key,
  name text not null default 'default',
  min_confidence int not null default 75,
  max_risk_band text not null default 'MEDIUM',
  risk_per_trade numeric not null default 0.01,
  take_profit_pct numeric not null default 0.06,
  stop_loss_pct numeric not null default 0.03,
  daily_loss_cap_pct numeric not null default 0.05,
  circuit_breaker boolean not null default true,
  enabled boolean not null default true,
  updated_at timestamptz default now()
);

create table if not exists equity_snapshots (
  id bigserial primary key,
  exchange text not null default 'binance',
  equity_usd numeric not null,
  captured_at timestamptz not null default now()
);

create table if not exists orders (
  id bigserial primary key,
  token_symbol text not null,
  side text not null,
  qty numeric not null,
  price numeric,
  sl numeric,
  tp numeric,
  status text not null default 'NEW',
  exchange_order_id text,
  mode text not null default 'paper',
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists positions (
  id bigserial primary key,
  token_symbol text not null,
  entry_price numeric not null,
  qty numeric not null,
  sl numeric,
  tp numeric,
  opened_at timestamptz default now(),
  closed_at timestamptz,
  pnl_usd numeric,
  mode text not null default 'paper'
);

create table if not exists execution_logs (
  id bigserial primary key,
  ref_type text not null,
  ref_id text,
  level text not null default 'INFO',
  message text not null,
  payload jsonb,
  created_at timestamptz default now()
);

create table if not exists trade_triggers (
  id bigserial primary key,
  token_symbol text not null,
  trigger_score numeric not null,
  confidence int not null,
  risk_band text not null,
  sentiment_delta numeric,
  volume_proxy_usd numeric,
  volatility_penalty numeric,
  computed_at timestamptz default now()
);

create or replace function get_top_trade_signals(max_rows int default 10)
returns table (
  token_symbol text,
  confidence int,
  risk_band text,
  score int,
  last_seen timestamptz
)
language plpgsql
as $$
declare
  min_conf int := 75;
  max_risk text := 'MEDIUM';
begin
  return query
  with ranked as (
    select
      swt.token_symbol,
      swt.confidence::int,
      swt.risk_band,
      swt.score::int,
      swt.created_at as last_seen,
      row_number() over (partition by swt.token_symbol order by swt.created_at desc) as rn
    from scores_with_tokens swt
    where swt.confidence >= min_conf
      and swt.risk_band in ('LOW','MEDIUM')
  )
  select r.token_symbol, r.confidence, r.risk_band, r.score, r.last_seen
  from ranked r
  where r.rn = 1
  order by r.score desc, r.confidence desc, r.last_seen desc
  limit max_rows;
end;
$$;

-- Seed minimal demo data (optional)
insert into tokens(symbol,name)
values ('PEPEUSDT','Pepe'), ('BONKUSDT','Bonk')
on conflict (symbol) do nothing;

insert into scores(token_id, score, confidence, risk_band)
select id, 72, 82, 'LOW' from tokens where symbol='PEPEUSDT'
on conflict do nothing;

insert into alerts(token_symbol, risk_band, confidence, score)
values ('PEPEUSDT','LOW',82,72)
on conflict do nothing;
