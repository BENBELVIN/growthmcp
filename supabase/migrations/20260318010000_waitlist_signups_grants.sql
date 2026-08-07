-- service_role needs explicit table grants (RLS has no policies on this table).

grant select, insert, update on table public.waitlist_signups to service_role;

grant usage, select on sequence public.waitlist_signups_position_seq to service_role;
