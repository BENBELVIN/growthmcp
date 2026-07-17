-- Fix chicken-and-egg RLS: owners must be able to SELECT their workspace
-- before workspace_members exists (needed for membership insert checks).

create policy "workspaces_select_owner"
  on public.workspaces for select
  using (owner_id = auth.uid());
