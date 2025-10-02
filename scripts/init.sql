create extension if not exists pgcrypto;

create table if not exists tokens(
  id uuid primary key default gen_random_uuid(),
  symbol text,
  name text,
  chain text,
  address text,
  website text
);

create table if not exists features_daily(
  dt date not null,
  token_id uuid references tokens(id),
  narrative_momentum double precision,
  social_breadth double precision,
  burstiness double precision,
  liq_health double precision,
  dev_velocity double precision,
  tokenomics_quality double precision,
  risk_penalty double precision,
  primary key (dt, token_id)
);

create table if not exists scores_daily(
  dt date not null,
  token_id uuid references tokens(id),
  prob_up_4h double precision,
  composite_score double precision,
  risk_level text check (risk_level in ('RED','AMBER','GREEN')),
  confidence text check (confidence in ('LOW','MED','HIGH')),
  explain jsonb,
  primary key (dt, token_id)
);

create table if not exists alerts(
  id bigserial primary key,
  dt timestamptz not null default now(),
  token_id uuid references tokens(id),
  type text check (type in ('NARRATIVE_BREAKOUT','BREADTH_SURGE','DEV_WAKEUP','RISK_FLIP','FRESH_LAUNCH_SAFE')),
  severity text check (severity in ('info','warning','critical')),
  title text,
  details jsonb
);

-- Paper trading / risk tables
create table if not exists paper_orders(
  id bigserial primary key,
  ts timestamptz not null default now(),
  symbol text not null,
  side text check (side in ('BUY','SELL')) not null,
  entry numeric not null,
  qty numeric not null,
  sl numeric not null,
  tp numeric not null,
  status text default 'open'
);

create table if not exists risk_ledger(
  d date primary key,
  realized_pnl numeric default 0,
  loss_cap numeric default 0
);

insert into risk_ledger(d, realized_pnl, loss_cap)
values (current_date, 0, 200)
on conflict (d) do nothing;
