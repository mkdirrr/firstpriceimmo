create table if not exists public.todos (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Expose to the data API
grant select on table public.todos to anon;
grant select on table public.todos to authenticated;

-- Enable RLS
alter table public.todos enable row level security;

-- Create policy for public read access (so the page.tsx can render them)
create policy "Allow public read access to todos" 
on public.todos
for select
using (true);
