-- Early access waitlist (public signups via service role / server actions)

create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  position bigint generated always as identity,
  source text not null default 'hero',
  referral_code text not null default encode(gen_random_bytes(8), 'hex'),
  referred_by uuid references public.waitlist_signups (id) on delete set null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'pending'
    check (status in ('pending', 'invited', 'converted', 'unsubscribed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index waitlist_signups_email_lower_idx
  on public.waitlist_signups (lower(email));

create unique index waitlist_signups_referral_code_idx
  on public.waitlist_signups (referral_code);

create index waitlist_signups_status_idx on public.waitlist_signups (status);

alter table public.waitlist_signups enable row level security;
-- No policies: inserts/reads go through service role in server actions only.

create trigger waitlist_signups_set_updated_at
  before update on public.waitlist_signups
  for each row execute function public.set_updated_at();

-- Public signup count for social proof on the marketing site.
create or replace function public.waitlist_signup_count()
returns bigint
language sql
stable
security definer
set search_path = public
as $$
  select count(*)::bigint
  from public.waitlist_signups
  where status in ('pending', 'invited');
$$;

grant execute on function public.waitlist_signup_count() to anon, authenticated;
