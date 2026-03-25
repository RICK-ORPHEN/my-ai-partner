-- AI School Platform - Initial Schema
-- This migration creates all necessary tables for the AI School Platform
-- Includes users, courses, skills, projects, companies, opportunities, and industry-specific functionality

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- CORE USERS & PROFILES
-- ============================================================================

-- Users table (uses Supabase Auth, but we store additional fields)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin', 'company')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- User profiles for extended information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  portfolio_url TEXT,
  visibility BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

-- ============================================================================
-- INDUSTRIES & GOALS
-- ============================================================================

-- Industries table - stores 8 industry types
CREATE TABLE IF NOT EXISTS industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  emoji TEXT,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_industries_slug ON industries(slug);

-- Industry goals - 5 goals per industry
CREATE TABLE IF NOT EXISTS industry_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_industry_goals_industry_id ON industry_goals(industry_id);
CREATE INDEX idx_industry_goals_sort ON industry_goals(industry_id, sort_order);

-- User-industry mapping
CREATE TABLE IF NOT EXISTS user_industries (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  PRIMARY KEY (user_id, industry_id)
);

CREATE INDEX idx_user_industries_user_id ON user_industries(user_id);
CREATE INDEX idx_user_industries_industry_id ON user_industries(industry_id);

-- User goals
CREATE TABLE IF NOT EXISTS user_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id UUID NOT NULL REFERENCES industry_goals(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, goal_id)
);

CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);

-- ============================================================================
-- COURSES & LESSONS
-- ============================================================================

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  level INTEGER DEFAULT 1,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_published ON courses(published);

-- Lessons within courses
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content TEXT,
  order_index INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_order ON lessons(course_id, order_index);

-- Enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- Learning paths for users
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry_id UUID NOT NULL REFERENCES industries(id) ON DELETE CASCADE,
  lessons JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_learning_paths_industry_id ON learning_paths(industry_id);

-- Lesson progress tracking
CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress(user_id, status);

-- ============================================================================
-- ASSIGNMENTS & SUBMISSIONS
-- ============================================================================

-- Assignments
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  max_score INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_assignments_course_id ON assignments(course_id);

-- Assignment submissions
CREATE TABLE IF NOT EXISTS assignment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submission_url TEXT,
  submission_content TEXT,
  score INTEGER CHECK (score >= 0),
  feedback TEXT,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_assignment_submissions_assignment_id ON assignment_submissions(assignment_id);
CREATE INDEX idx_assignment_submissions_user_id ON assignment_submissions(user_id);
CREATE INDEX idx_assignment_submissions_unique ON assignment_submissions(assignment_id, user_id);

-- ============================================================================
-- SKILLS & SKILL SCORES
-- ============================================================================

-- Skills master table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_skills_category ON skills(category);

-- User skills mapping
CREATE TABLE IF NOT EXISTS user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_level INTEGER DEFAULT 1 CHECK (skill_level >= 1 AND skill_level <= 5),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, skill_id)
);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills(skill_id);

-- Skill scores - aggregated scores per user
CREATE TABLE IF NOT EXISTS skill_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 1000),
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  last_updated TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_skill_scores_user_id ON skill_scores(user_id);
CREATE INDEX idx_skill_scores_score ON skill_scores(score DESC);

-- ============================================================================
-- PROJECTS
-- ============================================================================

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'active', 'completed', 'archived')),
  industry_id UUID REFERENCES industries(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_industry_id ON projects(industry_id);

-- Project members
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT now(),
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_project_members_project_id ON project_members(project_id);
CREATE INDEX idx_project_members_user_id ON project_members(user_id);

-- ============================================================================
-- PORTFOLIOS
-- ============================================================================

-- User portfolios
CREATE TABLE IF NOT EXISTS portfolios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  project_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);

-- ============================================================================
-- COMPANIES & OPPORTUNITIES
-- ============================================================================

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_industry ON companies(industry);

-- Opportunities from companies
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  required_skills TEXT,
  required_industries TEXT,
  match_score_template JSONB,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'filled')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX idx_opportunities_status ON opportunities(status);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES opportunities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  match_score INTEGER,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  applied_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(opportunity_id, user_id)
);

CREATE INDEX idx_applications_opportunity_id ON applications(opportunity_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(user_id, status);

-- ============================================================================
-- CHAT & COMMUNICATION
-- ============================================================================

-- Chat sessions for lessons
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  messages JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_lesson_id ON chat_sessions(lesson_id);

-- Direct messages (optional, for future use)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(recipient_id, read);

-- ============================================================================
-- BADGES & ACHIEVEMENTS
-- ============================================================================

-- Badge definitions
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  criteria JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- User badges - earned badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id ON user_badges(badge_id);

-- ============================================================================
-- COMMUNITY
-- ============================================================================

-- Community posts
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_category ON community_posts(category);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);

-- Community post replies
CREATE TABLE IF NOT EXISTS community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_community_replies_post_id ON community_replies(post_id);
CREATE INDEX idx_community_replies_user_id ON community_replies(user_id);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(user_id, created_at DESC);

-- ============================================================================
-- SUBSCRIPTIONS & PAYMENTS
-- ============================================================================

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'JPY',
  payment_provider TEXT,
  payment_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS policies - users can only see their own data
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR role = 'admin');

CREATE POLICY "Users can read own profile data" ON user_profiles
  FOR SELECT USING (auth.uid()::text = user_id::text OR visibility = true);

CREATE POLICY "Users can read own progress" ON lesson_progress
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own chat" ON chat_sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own skill scores" ON skill_scores
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own skills" ON user_skills
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own badges" ON user_badges
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own applications" ON applications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can read own messages" ON messages
  FOR SELECT USING (auth.uid()::text = sender_id::text OR auth.uid()::text = recipient_id::text);

CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Public read access for lessons, courses, industries
CREATE POLICY "Lessons are readable by all" ON lessons
  FOR SELECT USING (true);

CREATE POLICY "Courses are readable by all" ON courses
  FOR SELECT USING (published = true);

CREATE POLICY "Industries are readable by all" ON industries
  FOR SELECT USING (true);

CREATE POLICY "Community posts are readable by all" ON community_posts
  FOR SELECT USING (true);

CREATE POLICY "Community replies are readable by all" ON community_replies
  FOR SELECT USING (true);

CREATE POLICY "Opportunities are readable by all" ON opportunities
  FOR SELECT USING (status = 'open');
