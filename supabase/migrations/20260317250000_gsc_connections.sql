-- Google Search Console connections belong to a website/project

create table public.gsc_connections (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null unique references public.websites (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  connected_by uuid not null references auth.users (id) on delete cascade,
  property_uri text,
  access_token text not null,
  refresh_token text not null,
  token_expires_at timestamptz not null,
  status text not null default 'pending_property'
    check (status in ('pending_property', 'connected', 'error')),
  last_error text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gsc_connections_workspace_id_idx on public.gsc_connections (workspace_id);
create index gsc_connections_website_id_idx on public.gsc_connections (website_id);

create trigger gsc_connections_set_updated_at
  before update on public.gsc_connections
  for each row execute function public.set_updated_at();

alter table public.gsc_connections enable row level security;

create policy "gsc_connections_select_member"
  on public.gsc_connections for select
  using (public.is_workspace_member(workspace_id));

create policy "gsc_connections_insert_member"
  on public.gsc_connections for insert
  with check (public.is_workspace_member(workspace_id));

create policy "gsc_connections_update_member"
  on public.gsc_connections for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "gsc_connections_delete_member"
  on public.gsc_connections for delete
  using (public.is_workspace_member(workspace_id));

grant select, insert, update, delete on table public.gsc_connections to authenticated;
