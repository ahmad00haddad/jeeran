
-- ENUMS
create type public.app_role as enum ('admin','user');
create type public.order_status as enum ('pending','confirmed','shipped','delivered','cancelled');

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  address text,
  city text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles self select" on public.profiles for select using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update using (auth.uid() = id);
create policy "profiles self insert" on public.profiles for insert with check (auth.uid() = id);

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null,
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.user_roles where user_id=_user_id and role=_role);
$$;

create policy "roles self read" on public.user_roles for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "roles admin manage" on public.user_roles for all using (public.has_role(auth.uid(),'admin'));

-- AUTO PROFILE
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''))
  on conflict (id) do nothing;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

-- CATEGORIES
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ar text not null,
  name_en text,
  image_url text,
  display_order int default 0,
  created_at timestamptz default now()
);
alter table public.categories enable row level security;
create policy "categories public read" on public.categories for select using (true);
create policy "categories admin write" on public.categories for all using (public.has_role(auth.uid(),'admin'));

-- PRODUCTS
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  description_ar text,
  category_id uuid references public.categories(id) on delete set null,
  price numeric(10,2) not null,
  sale_price numeric(10,2),
  image_url text not null,
  images jsonb default '[]'::jsonb,
  sizes jsonb default '["S","M","L","XL"]'::jsonb,
  colors jsonb default '[]'::jsonb,
  stock int not null default 50,
  badge text,
  rating numeric(2,1) default 4.8,
  reviews_count int default 0,
  gender text default 'women',
  active boolean default true,
  created_at timestamptz default now()
);
alter table public.products enable row level security;
create policy "products public read" on public.products for select using (active = true or public.has_role(auth.uid(),'admin'));
create policy "products admin write" on public.products for all using (public.has_role(auth.uid(),'admin'));
create index products_category_idx on public.products(category_id);

-- ORDERS
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default 'JR' || to_char(now(),'YYMMDD') || lpad((floor(random()*10000))::text,4,'0'),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  phone text not null,
  city text not null,
  address text not null,
  notes text,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_method text not null default 'COD',
  status order_status not null default 'pending',
  created_at timestamptz default now()
);
alter table public.orders enable row level security;
create policy "orders own select" on public.orders for select using (auth.uid() = user_id or public.has_role(auth.uid(),'admin'));
create policy "orders insert any" on public.orders for insert with check (auth.uid() = user_id or user_id is null);
create policy "orders admin update" on public.orders for update using (public.has_role(auth.uid(),'admin'));

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name_ar text not null,
  image_url text,
  size text,
  color text,
  quantity int not null,
  price numeric(10,2) not null
);
alter table public.order_items enable row level security;
create policy "order_items via order" on public.order_items for select using (
  exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);
create policy "order_items insert" on public.order_items for insert with check (
  exists(select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or o.user_id is null))
);

-- WISHLIST
create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);
alter table public.wishlists enable row level security;
create policy "wishlist owner" on public.wishlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- STORAGE
insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict do nothing;
create policy "product-images public read" on storage.objects for select using (bucket_id = 'product-images');
create policy "product-images admin write" on storage.objects for all using (bucket_id = 'product-images' and public.has_role(auth.uid(),'admin'));
