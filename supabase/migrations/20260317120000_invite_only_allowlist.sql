-- Invite-only sign-in: only allowlisted emails can create accounts

create table public.allowed_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

alter table public.allowed_emails enable row level security;
-- No policies: only service role / security definer functions can read it.

insert into public.allowed_emails (email)
values ('benpjohnson01@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_email_allowed(check_email text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.allowed_emails
    where lower(email) = lower(check_email)
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  display_name text;
  workspace_name text;
begin
  if new.email is null or not public.is_email_allowed(new.email) then
    raise exception 'Sign-in is invite-only. This email is not authorized.';
  end if;

  display_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    split_part(new.email, '@', 1),
    'User'
  );

  workspace_name := display_name || '''s Workspace';

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    display_name,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
    set
      email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      updated_at = now();

  -- Only create a default workspace if this user has none yet
  if not exists (
    select 1 from public.workspace_members where user_id = new.id
  ) then
    insert into public.workspaces (owner_id, name)
    values (new.id, workspace_name)
    returning id into new_workspace_id;

    insert into public.workspace_members (workspace_id, user_id, role)
    values (new_workspace_id, new.id, 'owner');
  end if;

  return new;
end;
$$;

grant execute on function public.is_email_allowed(text) to authenticated;
