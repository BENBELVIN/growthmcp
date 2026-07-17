-- Project logos (auto-fetched favicons / apple-touch icons)

alter table public.websites
  add column if not exists logo_url text;

comment on column public.websites.logo_url is
  'Auto-resolved favicon or brand mark URL for the project.';
