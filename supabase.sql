-- Minimal schema that supports SignalRadar Mock Build
create table if not exists alerts (
  id bigserial primary key,
  token_symbol text not null,
  risk_band text not null,
  confidence int not null,
  score int not null,
  created_at timestamptz default now()
);

insert into alerts(token_symbol, risk_band, confidence, score)
values ('PEPEUSDT','LOW',82,73)
on conflict do nothing;
