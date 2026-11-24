-- ShelfSpace database schema (run in the Supabase SQL Editor)

create table libraries (
  id text primary key,
  name text not null,
  address text,
  district text not null,
  locality text,
  state text not null,
  lat double precision not null,
  lng double precision not null,
  rating numeric(2,1),
  source text not null default 'openstreetmap',
  created_at timestamptz not null default now()
);

create table library_details (
  library_id text primary key references libraries(id) on delete cascade,
  pricing text,
  monthly_price integer,
  owner_name text,
  owner_contact text,
  amenities text[] not null default '{}',
  timings jsonb not null default '{}'::jsonb,
  last_verified date,
  verified_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table saved_libraries (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  library_id text not null references libraries(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, library_id)
);

alter table libraries enable row level security;
alter table library_details enable row level security;
alter table saved_libraries enable row level security;

create policy "Libraries are publicly readable" on libraries for select using (true);
create policy "Library details are publicly readable" on library_details for select using (true);

create policy "Users can view their own saved libraries"
  on saved_libraries for select using (auth.uid() = user_id);
create policy "Users can save libraries for themselves"
  on saved_libraries for insert with check (auth.uid() = user_id);
create policy "Users can remove their own saved libraries"
  on saved_libraries for delete using (auth.uid() = user_id);

create index libraries_district_idx on libraries (district);