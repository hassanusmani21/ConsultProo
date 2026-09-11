create extension if not exists pgcrypto;

create table if not exists public.products (
  id text primary key,
  name text not null check (char_length(trim(name)) between 1 and 200),
  price numeric(12, 2) not null check (price > 0),
  currency text not null check (currency = 'INR'),
  storage_path text,
  delivery_type text not null default 'pdf' check (delivery_type in ('pdf', 'video', 'course')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists storage_path text;
alter table public.products add column if not exists delivery_type text not null default 'pdf';
alter table public.products drop constraint if exists products_delivery_type_check;
alter table public.products add constraint products_delivery_type_check check (delivery_type in ('pdf', 'video', 'course'));

insert into public.products (id, name, price, currency, storage_path, delivery_type)
values
  ('midjourney-for-architects', 'Midjourney for Architects', 2499, 'INR', 'ebooks/midjourney-for-architects.pdf', 'pdf'),
  ('complete-architecture-ai-workflow', 'Complete Architecture AI Workflow', 3999, 'INR', 'ebooks/complete-architecture-ai-workflow.pdf', 'pdf'),
  ('chatgpt-for-architects', 'ChatGPT for Architects & Interior Designers', 1599, 'INR', 'ebooks/chatgpt-for-architects.pdf', 'pdf'),
  ('revit-bim-starter-guide', 'Revit / BIM Starter Guide', 2499, 'INR', 'ebooks/revit-bim-starter-guide.pdf', 'pdf'),
  ('modern-villa-v1', 'Modern Villa V1', 19999, 'INR', 'villa-plans/modern-villa-v1.pdf', 'pdf'),
  ('minimalist-courtyard-v2', 'Minimalist Courtyard Villa V2', 15999, 'INR', 'villa-plans/minimalist-courtyard-v2.pdf', 'pdf'),
  ('compact-luxury-v3', 'Compact Urban Villa V3', 11999, 'INR', 'villa-plans/compact-luxury-v3.pdf', 'pdf'),
  ('prompt-002-japandi-penthouse', 'Minimalist Japandi Living Atelier', 1999, 'INR', 'prompts/prompt-002-japandi-penthouse.pdf', 'pdf'),
  ('prompt-004-cantilever-exterior', 'Monolithic Travertine Cantilever Villa', 2999, 'INR', 'prompts/prompt-004-cantilever-exterior.pdf', 'pdf'),
  ('prompt-006-mood-lighting-sanctuary', 'Chiaroscuro Lightwell & Courtyard Staging', 1999, 'INR', 'prompts/prompt-006-mood-lighting-sanctuary.pdf', 'pdf')
on conflict (id) do update
set storage_path = coalesce(public.products.storage_path, excluded.storage_path),
    delivery_type = excluded.delivery_type;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(trim(full_name)) between 2 and 100),
  email text not null check (char_length(email) between 3 and 254),
  country_code text not null default 'IN' check (char_length(trim(country_code)) between 2 and 16),
  country text not null default 'India' check (char_length(trim(country)) between 2 and 100),
  phone text not null check (char_length(phone) between 8 and 20),
  created_at timestamptz not null default now()
);

alter table public.customers add column if not exists country_code text not null default 'IN';
alter table public.customers add column if not exists country text not null default 'India';
alter table public.customers drop constraint if exists customers_phone_check;
alter table public.customers add constraint customers_phone_check check (char_length(phone) between 8 and 20);
alter table public.customers drop constraint if exists customers_country_code_check;
alter table public.customers add constraint customers_country_code_check check (char_length(trim(country_code)) between 2 and 16);
alter table public.customers drop constraint if exists customers_country_check;
alter table public.customers add constraint customers_country_check check (char_length(trim(country)) between 2 and 100);

create table if not exists public.orders (
  id uuid primary key,
  product_id text not null,
  product_name text not null check (char_length(trim(product_name)) between 1 and 200),
  product_price numeric(12, 2) not null check (product_price > 0),
  product_currency text not null check (product_currency = 'INR'),
  customer_id uuid not null references public.customers(id),
  razorpay_order_id text unique,
  razorpay_payment_id text unique,
  status text not null default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT', 'PAID')),
  paid_at timestamptz,
  client_order_id text,
  created_at timestamptz not null default now()
);

alter table public.orders add column if not exists razorpay_order_id text;
alter table public.orders add column if not exists razorpay_payment_id text;
alter table public.orders add column if not exists paid_at timestamptz;
alter table public.orders add column if not exists client_order_id text;
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check check (status in ('PENDING_PAYMENT', 'PAID'));
create unique index if not exists orders_razorpay_order_id_idx on public.orders (razorpay_order_id) where razorpay_order_id is not null;
create unique index if not exists orders_razorpay_payment_id_idx on public.orders (razorpay_payment_id) where razorpay_payment_id is not null;
create unique index if not exists orders_client_order_id_idx on public.orders (client_order_id) where client_order_id is not null;
create index if not exists customers_email_idx on public.customers (lower(email));
create index if not exists orders_customer_id_idx on public.orders (customer_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

create table if not exists public.product_access (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  product_id text not null,
  token_hash text not null unique,
  created_at timestamptz not null default now(),
  last_accessed_at timestamptz,
  revoked boolean not null default false
);

create index if not exists product_access_customer_id_idx on public.product_access (customer_id);
create index if not exists product_access_product_id_idx on public.product_access (product_id);

alter table public.products enable row level security;
alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.product_access enable row level security;

insert into storage.buckets (id, name, public)
values ('product-files', 'product-files', false)
on conflict (id) do update set public = false;

drop function if exists public.create_pending_order(uuid, text, text, text, text, text, numeric, text);
drop function if exists public.create_pending_order(uuid, text, text, text, text, text);
drop function if exists public.create_pending_order(uuid, text, text, text, text, text, text);
drop function if exists public.create_pending_order(uuid, text, text, text, text, text, text, text, text);

create or replace function public.create_pending_order(
  p_order_id uuid,
  p_customer_full_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_country_code text,
  p_customer_country text,
  p_product_id text,
  p_razorpay_order_id text,
  p_client_order_id text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  customer_ref uuid;
  product_ref public.products%rowtype;
  existing_order public.orders%rowtype;
begin
  select * into existing_order
  from public.orders
  where client_order_id = nullif(trim(p_client_order_id), '');

  if found then
    return json_build_object(
      'order_id', existing_order.id,
      'razorpay_order_id', existing_order.razorpay_order_id,
      'status', existing_order.status
    );
  end if;

  select * into product_ref
  from public.products
  where id = trim(p_product_id) and active = true;

  if not found then
    raise exception 'PRODUCT_NOT_AVAILABLE';
  end if;

  insert into public.customers (full_name, email, phone, country_code, country)
  values (
    trim(p_customer_full_name),
    lower(trim(p_customer_email)),
    trim(p_customer_phone),
    upper(trim(p_customer_country_code)),
    trim(p_customer_country)
  )
  returning id into customer_ref;

  insert into public.orders (
    id, product_id, product_name, product_price, product_currency, customer_id, razorpay_order_id, status, client_order_id
  ) values (
    p_order_id, product_ref.id, product_ref.name, product_ref.price, product_ref.currency,
    customer_ref, p_razorpay_order_id, 'PENDING_PAYMENT', nullif(trim(p_client_order_id), '')
  )
  on conflict do nothing;

  if not found then
    select * into existing_order
    from public.orders
    where client_order_id = nullif(trim(p_client_order_id), '');

    return json_build_object(
      'order_id', existing_order.id,
      'razorpay_order_id', existing_order.razorpay_order_id,
      'status', existing_order.status
    );
  end if;

  return json_build_object(
    'order_id', p_order_id,
    'customer_id', customer_ref,
    'razorpay_order_id', p_razorpay_order_id,
    'status', 'PENDING_PAYMENT'
  );
end;
$$;

revoke all on function public.create_pending_order(uuid, text, text, text, text, text, text, text, text) from public;
grant execute on function public.create_pending_order(uuid, text, text, text, text, text, text, text, text) to service_role;

drop function if exists public.mark_order_paid(uuid, text, text, bigint, text);

create or replace function public.mark_order_paid(
  p_order_id uuid,
  p_razorpay_order_id text,
  p_razorpay_payment_id text,
  p_amount bigint,
  p_currency text,
  p_access_token_hash text
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  order_ref public.orders%rowtype;
  expected_amount bigint;
  access_ref public.product_access%rowtype;
begin
  select * into order_ref
  from public.orders
  where id = p_order_id
  for update;

  if not found then
    raise exception 'ORDER_NOT_FOUND';
  end if;

  if order_ref.status = 'PAID' then
    if order_ref.razorpay_order_id = p_razorpay_order_id
      and order_ref.razorpay_payment_id = p_razorpay_payment_id then
      insert into public.product_access (order_id, customer_id, product_id, token_hash)
      values (order_ref.id, order_ref.customer_id, order_ref.product_id, p_access_token_hash)
      on conflict (order_id) do update set token_hash = excluded.token_hash, revoked = false
      returning * into access_ref;

      return json_build_object(
        'order_id', order_ref.id,
        'status', 'PAID',
        'already_processed', true,
        'access_id', access_ref.id,
        'product_id', access_ref.product_id
      );
    end if;
    raise exception 'ORDER_ALREADY_PROCESSED';
  end if;

  if order_ref.status <> 'PENDING_PAYMENT' then
    raise exception 'ORDER_NOT_PAYABLE';
  end if;
  if order_ref.razorpay_order_id <> p_razorpay_order_id then
    raise exception 'RAZORPAY_ORDER_MISMATCH';
  end if;

  expected_amount := round(order_ref.product_price * 100);
  if expected_amount <> p_amount or order_ref.product_currency <> upper(trim(p_currency)) then
    raise exception 'PAYMENT_AMOUNT_MISMATCH';
  end if;

  update public.orders
  set status = 'PAID', razorpay_payment_id = p_razorpay_payment_id, paid_at = now()
  where id = p_order_id;

  insert into public.product_access (order_id, customer_id, product_id, token_hash)
  values (order_ref.id, order_ref.customer_id, order_ref.product_id, p_access_token_hash)
  on conflict (order_id) do update set token_hash = excluded.token_hash, revoked = false
  returning * into access_ref;

  return json_build_object(
    'order_id', p_order_id,
    'status', 'PAID',
    'already_processed', false,
    'access_id', access_ref.id,
    'product_id', access_ref.product_id
  );
exception
  when unique_violation then
    raise exception 'PAYMENT_ALREADY_USED';
end;
$$;

revoke all on function public.mark_order_paid(uuid, text, text, bigint, text, text) from public;
grant execute on function public.mark_order_paid(uuid, text, text, bigint, text, text) to service_role;

-- CMS content is stored as flexible JSON so the existing dashboard collections can
-- share one secure data layer without a new table for every content type.
create table if not exists public.cms_content (
  collection text not null check (char_length(trim(collection)) between 1 and 80),
  item_id text not null check (char_length(trim(item_id)) between 1 and 200),
  data jsonb not null default '{}'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (collection, item_id)
);

create index if not exists cms_content_collection_idx on public.cms_content (collection);
create index if not exists cms_content_published_idx on public.cms_content (published) where published = true;

create or replace function public.set_cms_content_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cms_content_updated_at on public.cms_content;
create trigger cms_content_updated_at
before update on public.cms_content
for each row execute function public.set_cms_content_updated_at();

-- Admin access is an explicit allow-list. Create the auth user in Supabase
-- Authentication first, then insert its UUID into this table once.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.cms_content enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read published CMS content" on public.cms_content;
create policy "Public can read published CMS content"
on public.cms_content for select
to anon, authenticated
using (published = true or public.is_admin());

drop policy if exists "Admins can manage CMS content" on public.cms_content;
create policy "Admins can manage CMS content"
on public.cms_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read their own admin membership" on public.admin_users;
create policy "Users can read their own admin membership"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- The browser can display active catalog prices and admins can maintain them.
drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products"
on public.products for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read customers" on public.customers;
create policy "Admins can read customers"
on public.customers for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read orders" on public.orders;
create policy "Admins can read orders"
on public.orders for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can read product access" on public.product_access;
create policy "Admins can read product access"
on public.product_access for select
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('cms-assets', 'cms-assets', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read CMS assets" on storage.objects;
create policy "Public can read CMS assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'cms-assets');

drop policy if exists "Admins can manage CMS assets" on storage.objects;
create policy "Admins can manage CMS assets"
on storage.objects for all
to authenticated
using (bucket_id in ('cms-assets', 'product-files') and public.is_admin())
with check (bucket_id in ('cms-assets', 'product-files') and public.is_admin());
