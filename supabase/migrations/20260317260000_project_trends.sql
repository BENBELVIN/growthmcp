-- Google Trends cache + opportunities for GrowthMCP projects (websites).
-- GrowthMCP is source of truth; Trends is an enrichment provider.

create table public.project_trends (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  keyword text not null,
  interest_score numeric(6, 2) not null default 0,
  trend_direction text not null default 'unknown'
    check (trend_direction in ('rising', 'stable', 'falling', 'unknown')),
  related_queries jsonb not null default '[]'::jsonb,
  related_topics jsonb not null default '[]'::jsonb,
  interest_over_time jsonb not null default '[]'::jsonb,
  interest_by_region jsonb not null default '[]'::jsonb,
  region text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (website_id, keyword)
);

create index project_trends_website_id_idx on public.project_trends (website_id);
create index project_trends_workspace_id_idx on public.project_trends (workspace_id);
create index project_trends_interest_score_idx
  on public.project_trends (website_id, interest_score desc);

create trigger project_trends_set_updated_at
  before update on public.project_trends
  for each row execute function public.set_updated_at();

alter table public.project_trends enable row level security;

create policy "project_trends_select_member"
  on public.project_trends for select
  using (public.is_workspace_member(workspace_id));

create policy "project_trends_insert_member"
  on public.project_trends for insert
  with check (public.is_workspace_member(workspace_id));

create policy "project_trends_update_member"
  on public.project_trends for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "project_trends_delete_member"
  on public.project_trends for delete
  using (public.is_workspace_member(workspace_id));

grant select, insert, update, delete on table public.project_trends to authenticated;

-- Actionable opportunities derived from Trends (+ GSC context in app layer)

create table public.trend_opportunities (
  id uuid primary key default gen_random_uuid(),
  website_id uuid not null references public.websites (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  keyword text not null,
  reason text not null,
  trend_score numeric(6, 2) not null default 0,
  status text not null default 'open'
    check (status in ('open', 'done', 'dismissed')),
  created_at timestamptz not null default now()
);

create index trend_opportunities_website_id_idx
  on public.trend_opportunities (website_id);
create index trend_opportunities_workspace_id_idx
  on public.trend_opportunities (workspace_id);
create index trend_opportunities_open_score_idx
  on public.trend_opportunities (website_id, status, trend_score desc);

alter table public.trend_opportunities enable row level security;

create policy "trend_opportunities_select_member"
  on public.trend_opportunities for select
  using (public.is_workspace_member(workspace_id));

create policy "trend_opportunities_insert_member"
  on public.trend_opportunities for insert
  with check (public.is_workspace_member(workspace_id));

create policy "trend_opportunities_update_member"
  on public.trend_opportunities for update
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create policy "trend_opportunities_delete_member"
  on public.trend_opportunities for delete
  using (public.is_workspace_member(workspace_id));

grant select, insert, update, delete on table public.trend_opportunities to authenticated;
