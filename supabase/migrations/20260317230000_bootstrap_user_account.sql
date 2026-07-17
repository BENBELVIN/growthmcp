-- Reliable account bootstrap: profile + default workspace + owner membership.
-- Runs as SECURITY DEFINER so it works even when client INSERT grants are missing.

create or replace function public.bootstrap_user_account()
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
  meta jsonb;
  display_name text;
  workspace_name text;
  existing_workspace public.workspaces;
  new_workspace public.workspaces;
  new_workspace_id uuid;
begin
  if uid is null then
    raise exception 'Not authenticated';
  end if;

  select raw_user_meta_data into meta
  from auth.users
  where id = uid;

  display_name := coalesce(
    meta ->> 'full_name',
    meta ->> 'name',
    split_part((select email from auth.users where id = uid), '@', 1),
    'User'
  );

  workspace_name := display_name || '''s Workspace';

  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    uid,
    (select email from auth.users where id = uid),
    display_name,
    meta ->> 'avatar_url'
  )
  on conflict (id) do update
    set
      email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
      updated_at = now();

  select w.*
  into existing_workspace
  from public.workspaces w
  join public.workspace_members m on m.workspace_id = w.id
  where m.user_id = uid
  order by m.created_at asc
  limit 1;

  if found then
    return existing_workspace;
  end if;

  insert into public.workspaces (owner_id, name)
  values (uid, workspace_name)
  returning * into new_workspace;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace.id, uid, 'owner');

  return new_workspace;
end;
$$;

grant execute on function public.bootstrap_user_account() to authenticated;

-- Also ensure direct grants exist for future client writes
grant select, insert, update on table public.profiles to authenticated;
