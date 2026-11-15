-- Chez Sifa : schéma de la base (à exécuter une fois dans Supabase > SQL Editor),
-- puis exécuter supabase/seed.sql pour charger la carte et les prix.
-- Toutes les lectures et écritures passent par le serveur Next.js (clé service_role) :
-- RLS est activé sans aucune règle publique, donc la clé "anon" ne peut rien lire ni écrire.

create extension if not exists pgcrypto;

create table if not exists categories (
  id text primary key,
  fr text not null, en text not null,
  dfr text, den text,
  composable boolean not null default false,
  sort int not null default 0
);

create table if not exists products (
  id text primary key,
  cat text not null references categories(id),
  fr text not null, en text not null,
  dfr text, den text,
  sizes text not null check (sizes in ('rl','single','pack','ml')),
  r numeric(8,2) not null,
  l numeric(8,2),
  lfr text, len text,
  side boolean not null default false,
  opts jsonb,
  featured boolean not null default false,
  active boolean not null default true,
  photo text,
  sort int not null default 0
);

create table if not exists settings (
  id int primary key default 1 check (id = 1),
  min_hours int not null default 48,
  interac_email text not null default 'chezsifa@gmail.com',
  phone text not null default '778-723-7919',
  banner_fr text, banner_en text
);
insert into settings (id) values (1) on conflict (id) do nothing;

create table if not exists promos (
  code text primary key check (code = upper(code)),
  type text not null check (type in ('percent','fixed')),
  value numeric(8,2) not null check (value > 0),
  scope text not null check (scope in ('all','weekly','category','first')),
  category text references categories(id),
  min_total numeric(8,2),
  max_uses int,
  uses int not null default 0,
  starts_on date, ends_on date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create sequence if not exists order_number_seq start 1001;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  number int not null unique default nextval('order_number_seq'),
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'nouvelle' check (status in ('nouvelle','confirmee','payee','preparation','prete','recuperee','annulee')),
  source text not null default 'site' check (source in ('site','telephone')),
  customer_name text not null,
  phone text not null,
  phone_norm text,
  email text,
  notes text,
  kind text not null default 'single' check (kind in ('single','weekly')),
  pickup_date date not null,
  pickup_time text,
  weekly_mode text check (weekly_mode in ('once','daily')),
  repeat_weekly boolean not null default false,
  lines jsonb not null default '[]',
  subtotal numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  promo_code text,
  total numeric(10,2) not null default 0,
  lang text not null default 'fr'
);
create index if not exists orders_pickup_idx on orders (pickup_date);
create index if not exists orders_phone_idx on orders (phone_norm);

create table if not exists catering_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  guests int not null default 0,
  event_date date,
  name text not null,
  phone text not null,
  email text,
  details text,
  status text not null default 'nouvelle' check (status in ('nouvelle','contactee','devis_envoye','confirmee','refusee'))
);

create or replace function increment_promo(p_code text) returns void
language sql security definer set search_path = public as $$
  update promos set uses = uses + 1 where code = p_code;
$$;
revoke all on function increment_promo(text) from public, anon, authenticated;

alter table categories enable row level security;
alter table products enable row level security;
alter table settings enable row level security;
alter table promos enable row level security;
alter table orders enable row level security;
alter table catering_requests enable row level security;

-- Photos des plats : stockage public en lecture, envoi uniquement par le serveur.
insert into storage.buckets (id, name, public) values ('photos', 'photos', true)
on conflict (id) do nothing;
