-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  industry_id VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Industries Table
CREATE TABLE industries (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  emoji VARCHAR(10),
  icon VARCHAR(50),
  color VARCHAR(7),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals Table
CREATE TABLE goals (
  id VARCHAR(100) PRIMARY KEY,
  industry_id VARCHAR(50) NOT NULL REFERENCES industries(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lessons Table
CREATE TABLE lessons (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  industry_id VARCHAR(50) NOT NULL REFERENCES industries(id),
  goal_id VARCHAR(100) NOT NULL REFERENCES goals(id),
  "order" INTEGER,
  duration INTEGER,
  difficulty VARCHAR(20),
  ai_tool VARCHAR(50),
  content JSONB,
  outcomes TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Industries Table (many-to-many)
CREATE TABLE user_industries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry_id VARCHAR(50) NOT NULL REFERENCES industries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, industry_id)
);

-- User Goals Table (many-to-many)
CREATE TABLE user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  goal_id VARCHAR(100) NOT NULL REFERENCES goals(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, goal_id)
);

-- Learning Paths Table
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry_id VARCHAR(50) NOT NULL REFERENCES industries(id),
  goal_ids TEXT[],
  lessons JSONB,
  current_lesson_index INTEGER DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'not_started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lesson Progress Table
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(100) NOT NULL REFERENCES lessons(id),
  status VARCHAR(50) DEFAULT 'not_started',
  progress INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);

-- User Progress Table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  total_lessons_completed INTEGER DEFAULT 0,
  total_lessons_in_progress INTEGER DEFAULT 0,
  skill_scores JSONB DEFAULT '{}'::jsonb,
  average_skill_score NUMERIC(5,2) DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  total_minutes_learned INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat Sessions Table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id VARCHAR(100) NOT NULL REFERENCES lessons(id),
  messages JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skill Assessments Table
CREATE TABLE skill_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry VARCHAR(100),
  ai_tool VARCHAR(50),
  score INTEGER,
  max_score INTEGER,
  percentage NUMERIC(5,2),
  competency_level VARCHAR(50),
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_industry_id ON users(industry_id);
CREATE INDEX idx_user_industries_user_id ON user_industries(user_id);
CREATE INDEX idx_user_goals_user_id ON user_goals(user_id);
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress(lesson_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_lesson_id ON chat_sessions(lesson_id);
CREATE INDEX idx_skill_assessments_user_id ON skill_assessments(user_id);
CREATE INDEX idx_lessons_industry_id ON lessons(industry_id);
CREATE INDEX idx_lessons_goal_id ON lessons(goal_id);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_assessments ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own data
CREATE POLICY "Users can read their own data" ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Learning paths - users can only access their own
CREATE POLICY "Users can read their own learning paths" ON learning_paths
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning paths" ON learning_paths
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Lesson progress - users can only access their own
CREATE POLICY "Users can read their own lesson progress" ON lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own lesson progress" ON lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Chat sessions - users can only access their own
CREATE POLICY "Users can read their own chat sessions" ON chat_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Assessments - users can only access their own
CREATE POLICY "Users can read their own assessments" ON skill_assessments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can read public lesson and goal data
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read lessons" ON lessons
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read goals" ON goals
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can read industries" ON industries
  FOR SELECT
  USING (true);
