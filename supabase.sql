-- Sostituisci TUA_EMAIL con l'email con cui accedi all'area riservata (2 volte per tabella)
create table slots(id text primary key, date date not null, half text not null check (half in ('am','pm')));
create table requests(id uuid primary key default gen_random_uuid(), date date not null,
  fascia text not null check (fascia in ('full','am','pm')), name text not null, phone text, email text, notes text,
  status text not null default 'pending', created_at timestamptz default now());
alter table slots enable row level security;
alter table requests enable row level security;
create policy "slots lettura" on slots for select using (true);
create policy "slots admin" on slots for all using (auth.jwt()->>'email'='TUA_EMAIL') with check (auth.jwt()->>'email'='TUA_EMAIL');
create policy "richieste invio" on requests for insert with check (status='pending');
create policy "richieste admin" on requests for all using (auth.jwt()->>'email'='TUA_EMAIL') with check (auth.jwt()->>'email'='TUA_EMAIL');
