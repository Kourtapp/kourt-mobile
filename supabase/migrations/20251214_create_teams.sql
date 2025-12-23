-- Create teams table
create table public.teams (
    id uuid not null default gen_random_uuid (),
    name text not null,
    sport text not null,
    description text null,
    avatar_url text null,
    cover_url text null,
    captain_id uuid not null,
    created_at timestamp with time zone not null default now(),
    stats jsonb null default '{"wins": 0, "losses": 0, "draws": 0, "matches": 0, "rating": 1000}'::jsonb,
    constraint teams_pkey primary key (id),
    constraint teams_captain_id_fkey foreign key (captain_id) references auth.users (id)
) tablespace pg_default;
-- Create team_members table
create table public.team_members (
    id uuid not null default gen_random_uuid (),
    team_id uuid not null,
    user_id uuid not null,
    role text not null default 'member'::text,
    joined_at timestamp with time zone not null default now(),
    constraint team_members_pkey primary key (id),
    constraint team_members_team_id_fkey foreign key (team_id) references public.teams (id) on delete cascade,
    constraint team_members_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;
-- Enable RLS
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
-- Policies for teams
create policy "Teams are viewable by everyone" on public.teams for
select using (true);
create policy "Authenticated users can create teams" on public.teams for
insert with check (auth.uid() = captain_id);
create policy "Captains can update their teams" on public.teams for
update using (auth.uid() = captain_id);
-- Policies for team_members
create policy "Team members are viewable by everyone" on public.team_members for
select using (true);
create policy "Users can join teams" on public.team_members for
insert with check (auth.uid() = user_id);