-- Websites belong to workspaces (not users directly)

create table public.websites (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index websites_workspace_id_idx on public.websites (workspace_id);
create index websites_workspace_id_created_at_idx on public.websites (workspace_id, created_at desc);

create trigger websites_set_updated_at
  before update on public.websites
  for each row execute function public.set_updated_at();

alter table public.websites enable row level security;

-- Members can read websites in their workspaces
create policy "websites_select_member"
  on public.websites for select
  using (public.is_workspace_member(workspace_id));

-- Members can create websites in their workspaces
create policy "websites_insert_member"
  on public.websites for insert
  with check (public.is_workspace_member(workspace_id));

-- Members can update websites in their workspaces
create policy "websites_update_member"
  on public.websites for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

-- Members can delete websites in their workspaces
create policy "websites_delete_member"
  on public.websites for delete
  using (public.is_workspace_member(workspace_id));

grant select, insert, update, delete on table public.websites to authenticated;

-- Allow owners to add themselves when creating a workspace from the app
create policy "workspace_members_insert_self_owner"
  on public.workspace_members for insert
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1
      from public.workspaces w
      where w.id = workspace_id
        and w.owner_id = auth.uid()
    )
  );

grant insert on table public.workspace_members to authenticated;
