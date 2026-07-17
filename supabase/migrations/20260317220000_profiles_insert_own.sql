-- Allow authenticated users to create their own profile row
-- (needed when the signup trigger did not run, e.g. users created before migrations)

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (id = auth.uid());

grant insert on table public.profiles to authenticated;
