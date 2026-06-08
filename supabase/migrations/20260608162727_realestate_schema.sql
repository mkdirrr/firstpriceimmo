-- properties table
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  category text not null,
  transaction_type text not null,
  price numeric not null,
  image_urls text[] default '{}',
  status text default 'ACTIVE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- contacts (leads) table
create table public.contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  property_id uuid references public.properties(id) on delete cascade,
  status text default 'NEW',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- transactions table
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  amount numeric not null,
  status text not null,
  date timestamp with time zone not null
);

-- Expose to the data API
grant select, insert, update, delete on table public.properties to anon, authenticated;
grant select, insert, update, delete on table public.contacts to anon, authenticated;
grant select, insert, update, delete on table public.transactions to anon, authenticated;

-- Enable RLS
alter table public.properties enable row level security;
alter table public.contacts enable row level security;
alter table public.transactions enable row level security;

-- Policies for public
create policy "Allow public read access to active properties" 
on public.properties
for select
using (status = 'ACTIVE');

create policy "Allow public to insert contacts" 
on public.contacts
for insert
with check (true);

-- Policies for authenticated admins
create policy "Allow admins full access to properties" 
on public.properties
for all
to authenticated
using (true)
with check (true);

create policy "Allow admins full access to contacts" 
on public.contacts
for all
to authenticated
using (true)
with check (true);

create policy "Allow admins full access to transactions" 
on public.transactions
for all
to authenticated
using (true)
with check (true);

-- Storage configuration
insert into storage.buckets (id, name, public) values ('property-images', 'property-images', true)
on conflict do nothing;

create policy "Allow public read access to property images" 
on storage.objects for select 
using (bucket_id = 'property-images');

create policy "Allow admins to upload property images" 
on storage.objects for insert 
to authenticated 
with check (bucket_id = 'property-images');

create policy "Allow admins to delete property images" 
on storage.objects for delete 
to authenticated 
using (bucket_id = 'property-images');
