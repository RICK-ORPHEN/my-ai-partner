-- =========================================
-- AI School v3 — Full Schema (Idempotent)
-- =========================================
-- Tracks, Industries, Curriculum, Lessons, Submissions,
-- AI Scoring, Products (公開), Portfolio, Affiliates, Billing
-- All tables have RLS enabled with explicit policies.

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- ---------- ENUMS ----------
do $$ begin
  create type learner_track as enum ('track_a','track_b','track_hybrid','undecided');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lesson_kind as enum ('industry','cross_skill');
exception when duplicate_object then null; end $$;

do $$ begin
  create type submission_status as enum ('draft','submitted','scored','approved','revise');
exception when duplicate_object then null; end $$;

do $$ begin
  create type product_status as enum ('idea','wip','published','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type subscription_tier as enum ('free','monthly','yearly','team','enterprise');
exception when duplicate_object then null; end $$;

-- ---------- PROFILES ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  username text unique,
  avatar_url text,
  industry text, -- restaurant, retail, ...
  learner_track learner_track default 'undecided',
  coding_experience smallint default 0, -- 0:なし 1:少し 2:あり
  goal text,
  bio text,
  is_admin boolean default false,
  subscription_tier subscription_tier default 'free',
  stripe_customer_id text,
  current_period_end timestamptz,
  affiliate_vercel_signed_up boolean default false,
  affiliate_supabase_signed_up boolean default false,
  affiliate_squarespace_signed_up boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- COURSES ----------
create table if not exists courses (
  id text primary key, -- e.g. 'restaurant', 'lp_design'
  kind lesson_kind not null,
  title text not null,
  subtitle text,
  description text,
  cover_image text,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- ---------- LESSONS ----------
create table if not exists lessons (
  id text primary key, -- e.g. 'restaurant_01'
  course_id text not null references courses(id) on delete cascade,
  step int not null,
  title text not null,
  summary text,
  duration_min int default 20,
  body jsonb not null default '{}'::jsonb, -- chatbot script + checkpoints
  deliverable_spec jsonb default '{}'::jsonb,
  publishing_track text, -- 'track_a' | 'track_b' | null
  affiliate_link_target text, -- 'vercel' | 'supabase' | 'squarespace'
  created_at timestamptz default now(),
  unique (course_id, step)
);

-- ---------- ENROLLMENTS ----------
create table if not exists enrollments (
  user_id uuid references profiles(id) on delete cascade,
  course_id text references courses(id) on delete cascade,
  current_step int default 1,
  completed boolean default false,
  started_at timestamptz default now(),
  completed_at timestamptz,
  primary key (user_id, course_id)
);

-- ---------- LESSON PROGRESS ----------
create table if not exists lesson_progress (
  user_id uuid references profiles(id) on delete cascade,
  lesson_id text references lessons(id) on delete cascade,
  status text default 'not_started', -- not_started | in_progress | completed
  last_position jsonb default '{}'::jsonb,
  started_at timestamptz,
  completed_at timestamptz,
  primary key (user_id, lesson_id)
);

-- ---------- SUBMISSIONS (成果物提出) ----------
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id text not null references lessons(id) on delete cascade,
  status submission_status default 'draft',
  content_text text,
  content_url text,
  attachments jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  submitted_at timestamptz
);

-- ---------- AI SCORES ----------
create table if not exists ai_scores (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  score int not null check (score between 0 and 100),
  rubric jsonb default '{}'::jsonb,
  feedback_md text,
  improvements jsonb default '[]'::jsonb,
  scored_by text default 'ai', -- 'ai' | 'admin'
  scored_at timestamptz default now()
);

-- ---------- STUDENT PRODUCTS (公開URL) ----------
create table if not exists student_products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text references courses(id),
  title text not null,
  description text,
  cover_image text,
  status product_status default 'idea',
  publish_track text, -- 'vercel' | 'squarespace' | 'github' | 'other'
  public_url text,
  github_url text,
  tech_stack text[],
  ai_review_score int,
  ai_review_md text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  published_at timestamptz
);

-- ---------- PORTFOLIO PAGES ----------
create table if not exists portfolios (
  user_id uuid primary key references profiles(id) on delete cascade,
  slug text unique not null,
  headline text,
  intro_md text,
  is_public boolean default false,
  custom_domain text,
  theme jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- ---------- CERTIFICATES ----------
create table if not exists certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  course_id text not null references courses(id),
  certificate_no text unique not null,
  pdf_url text,
  issued_at timestamptz default now()
);

-- ---------- AFFILIATE EVENTS ----------
create table if not exists affiliate_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  service text not null check (service in ('vercel','supabase','squarespace','stripe','other')),
  event_type text not null check (event_type in ('click','signup','converted','churned')),
  amount_jpy numeric default 0,
  metadata jsonb default '{}'::jsonb,
  occurred_at timestamptz default now()
);

-- ---------- BILLING (Stripe webhook log) ----------
create table if not exists stripe_events (
  id text primary key, -- stripe event id
  type text not null,
  user_id uuid references profiles(id) on delete set null,
  data jsonb not null,
  processed boolean default false,
  created_at timestamptz default now()
);

-- ---------- ADMIN AUDIT LOG ----------
create table if not exists admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references profiles(id),
  action text not null,
  target_table text,
  target_id text,
  diff jsonb,
  occurred_at timestamptz default now()
);

-- ---------- FEEDBACK (受講生からの声) ----------
create table if not exists user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_id text references lessons(id) on delete set null,
  rating int check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

-- ---------- INDEXES ----------
create index if not exists idx_lessons_course on lessons(course_id);
create index if not exists idx_progress_user on lesson_progress(user_id);
create index if not exists idx_submissions_user on submissions(user_id);
create index if not exists idx_products_user on student_products(user_id);
create index if not exists idx_affiliate_user on affiliate_events(user_id);

-- =========================================
-- RLS POLICIES
-- =========================================
alter table profiles enable row level security;
alter table courses enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table lesson_progress enable row level security;
alter table submissions enable row level security;
alter table ai_scores enable row level security;
alter table student_products enable row level security;
alter table portfolios enable row level security;
alter table certificates enable row level security;
alter table affiliate_events enable row level security;
alter table stripe_events enable row level security;
alter table admin_logs enable row level security;
alter table user_feedback enable row level security;

-- helper function: is_admin
create or replace function is_admin() returns boolean as $$
  select coalesce((select is_admin from profiles where id = auth.uid()), false)
$$ language sql stable security definer;

-- profiles: own row + admin
drop policy if exists profiles_self_read on profiles;
create policy profiles_self_read on profiles for select
  using (id = auth.uid() or is_admin());

drop policy if exists profiles_self_update on profiles;
create policy profiles_self_update on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists profiles_admin_all on profiles;
create policy profiles_admin_all on profiles for all
  using (is_admin()) with check (is_admin());

-- courses & lessons: read all, write admin
drop policy if exists courses_read on courses;
create policy courses_read on courses for select using (true);
drop policy if exists courses_admin_write on courses;
create policy courses_admin_write on courses for all
  using (is_admin()) with check (is_admin());

drop policy if exists lessons_read on lessons;
create policy lessons_read on lessons for select using (true);
drop policy if exists lessons_admin_write on lessons;
create policy lessons_admin_write on lessons for all
  using (is_admin()) with check (is_admin());

-- enrollments / progress: own only
drop policy if exists enrollments_self on enrollments;
create policy enrollments_self on enrollments for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

drop policy if exists progress_self on lesson_progress;
create policy progress_self on lesson_progress for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- submissions / ai_scores
drop policy if exists submissions_self on submissions;
create policy submissions_self on submissions for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

drop policy if exists ai_scores_self on ai_scores;
create policy ai_scores_self on ai_scores for select
  using (
    exists(select 1 from submissions s where s.id = ai_scores.submission_id and s.user_id = auth.uid())
    or is_admin()
  );
drop policy if exists ai_scores_admin_write on ai_scores;
create policy ai_scores_admin_write on ai_scores for insert
  with check (true); -- API書込は service_role でのみ実施

-- products
drop policy if exists products_self_rw on student_products;
create policy products_self_rw on student_products for all
  using (user_id = auth.uid() or is_admin() or status = 'published')
  with check (user_id = auth.uid() or is_admin());

-- portfolios: 読み取りはpublicなら誰でも、編集は本人
drop policy if exists portfolios_public_read on portfolios;
create policy portfolios_public_read on portfolios for select
  using (is_public = true or user_id = auth.uid() or is_admin());

drop policy if exists portfolios_self_write on portfolios;
create policy portfolios_self_write on portfolios for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- certificates: 本人＋admin
drop policy if exists certs_self on certificates;
create policy certs_self on certificates for select
  using (user_id = auth.uid() or is_admin());

-- affiliate_events: admin only read, service-role write
drop policy if exists aff_admin_read on affiliate_events;
create policy aff_admin_read on affiliate_events for select using (is_admin() or user_id = auth.uid());

-- stripe_events / admin_logs: admin only
drop policy if exists stripe_admin on stripe_events;
create policy stripe_admin on stripe_events for select using (is_admin());

drop policy if exists admin_logs_admin on admin_logs;
create policy admin_logs_admin on admin_logs for select using (is_admin());

-- user_feedback
drop policy if exists fb_self on user_feedback;
create policy fb_self on user_feedback for all
  using (user_id = auth.uid() or is_admin())
  with check (user_id = auth.uid() or is_admin());

-- =========================================
-- TRIGGERS
-- =========================================
create or replace function touch_updated_at() returns trigger as $$
begin new.updated_at := now(); return new; end $$ language plpgsql;

drop trigger if exists trg_profiles_updated on profiles;
create trigger trg_profiles_updated before update on profiles
  for each row execute function touch_updated_at();

drop trigger if exists trg_products_updated on student_products;
create trigger trg_products_updated before update on student_products
  for each row execute function touch_updated_at();

drop trigger if exists trg_portfolios_updated on portfolios;
create trigger trg_portfolios_updated before update on portfolios
  for each row execute function touch_updated_at();

-- on auth.users insert -> profiles
create or replace function handle_new_user() returns trigger as $$
begin
  insert into profiles (id, email) values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end $$ language plpgsql security definer;

drop trigger if exists trg_on_auth_user_created on auth.users;
create trigger trg_on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

