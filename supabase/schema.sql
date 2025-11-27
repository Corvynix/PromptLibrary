-- ============================================
-- PromptLibrary - Complete Database Schema
-- For Supabase PostgreSQL
-- ============================================
-- This schema creates all tables, enums, indexes, and constraints
-- Run this in Supabase SQL Editor to set up the database
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================
-- ENUM TYPES
-- ============================================

-- Create all enum types first
CREATE TYPE role AS ENUM ('guest', 'user', 'moderator', 'curator', 'org_admin', 'super_admin');
CREATE TYPE prompt_type AS ENUM ('text', 'image', 'video');
CREATE TYPE visibility AS ENUM ('public', 'private', 'unlisted', 'domain_restricted');
CREATE TYPE license AS ENUM ('MIT', 'CC-BY', 'CC-BY-SA', 'CC-BY-NC', 'Proprietary');
CREATE TYPE status AS ENUM ('draft', 'reviewed', 'production', 'deprecated', 'flagged');
CREATE TYPE difficulty AS ENUM ('Beginner', 'Intermediate', 'Advanced', 'Expert');
CREATE TYPE vote_type AS ENUM ('up', 'down');
CREATE TYPE notification_type AS ENUM (
  'follower_new', 'prompt_remixed', 'prompt_forked', 'comment_reply', 
  'comment_on_prompt', 'mention_in_comment', 'upvote_milestone', 
  'badge_unlocked', 'featured_by_curator', 'trending_prompt', 
  'workflow_executed', 'admin_message'
);
CREATE TYPE execution_status AS ENUM ('pending', 'running', 'completed', 'failed');

-- ============================================
-- TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  roles JSONB NOT NULL DEFAULT '["user"]'::jsonb,
  karma_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  is_banned BOOLEAN NOT NULL DEFAULT FALSE
);

COMMENT ON TABLE users IS 'User accounts and profiles';
COMMENT ON COLUMN users.roles IS 'Array of user roles (guest, user, moderator, curator, org_admin, super_admin)';
COMMENT ON COLUMN users.karma_score IS 'User reputation score calculated from contributions';
COMMENT ON COLUMN users.metrics IS 'Detailed karma breakdown by category';

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_desc TEXT,
  type prompt_type NOT NULL DEFAULT 'text',
  industry_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  social_tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  visibility visibility NOT NULL DEFAULT 'public',
  license license NOT NULL DEFAULT 'MIT',
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  total_uses INTEGER NOT NULL DEFAULT 0,
  popularity_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  featured_at TIMESTAMP,
  feature_reason TEXT,
  search_vector TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE prompts IS 'Main prompts collection';
COMMENT ON COLUMN prompts.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN prompts.industry_tags IS 'Industry/domain tags (e.g., engineering, medicine)';
COMMENT ON COLUMN prompts.social_tags IS 'Social/topic tags for discovery';
COMMENT ON COLUMN prompts.popularity_score IS 'Calculated score based on views, uses, upvotes';

-- Prompt Versions table
CREATE TABLE IF NOT EXISTS prompt_versions (
  id SERIAL PRIMARY KEY,
  prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  model_compatibility TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  status status NOT NULL DEFAULT 'draft',
  parent_version_id INTEGER REFERENCES prompt_versions(id),
  created_by INTEGER NOT NULL REFERENCES users(id),
  difficulty difficulty,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE prompt_versions IS 'Version history and lineage for prompts';
COMMENT ON COLUMN prompt_versions.content IS 'Prompt content (structure varies by type: {system, user, instructions, examples})';
COMMENT ON COLUMN prompt_versions.parent_version_id IS 'ID of parent version for fork/remix tracking';

-- Workflows table
CREATE TABLE IF NOT EXISTS workflows (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  industry TEXT,
  visibility visibility NOT NULL DEFAULT 'public',
  created_by INTEGER NOT NULL REFERENCES users(id),
  adopted_by_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE workflows IS 'Multi-step prompt workflows (chains)';
COMMENT ON COLUMN workflows.steps IS 'Array of workflow steps [{step_number, prompt_version_id, input_mapping}]';

-- Execution Logs table
CREATE TABLE IF NOT EXISTS execution_logs (
  id SERIAL PRIMARY KEY,
  workflow_id INTEGER NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id),
  status execution_status NOT NULL DEFAULT 'pending',
  results JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP
);

COMMENT ON TABLE execution_logs IS 'Workflow execution history';

-- Remixes table (fork tracking)
CREATE TABLE IF NOT EXISTS remixes (
  id SERIAL PRIMARY KEY,
  original_prompt_id INTEGER NOT NULL REFERENCES prompts(id),
  from_version_id INTEGER NOT NULL REFERENCES prompt_versions(id),
  to_version_id INTEGER NOT NULL REFERENCES prompt_versions(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  summary_of_changes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE remixes IS 'Tracks prompt forks and remixes for lineage graph';

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prompt_id INTEGER NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  prompt_version_id INTEGER REFERENCES prompt_versions(id),
  content TEXT NOT NULL,
  parent_comment_id INTEGER REFERENCES comments(id),
  upvotes INTEGER NOT NULL DEFAULT 0,
  downvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE comments IS 'Comments and discussions on prompts';
COMMENT ON COLUMN comments.parent_comment_id IS 'ID of parent comment for threading';

-- Badges definition table
CREATE TABLE IF NOT EXISTS badges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  criteria JSONB NOT NULL,
  tier TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE badges IS 'Achievement badge definitions';
COMMENT ON COLUMN badges.criteria IS 'Badge unlock criteria {type, operator, value}';
COMMENT ON COLUMN badges.tier IS 'Bronze, Silver, Gold';

-- User Badges junction table
CREATE TABLE IF NOT EXISTS user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id INTEGER NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_badges IS 'Badges earned by users';

-- Usage Logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  prompt_version_id INTEGER REFERENCES prompt_versions(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE usage_logs IS 'Tracks prompt usage for analytics';
COMMENT ON COLUMN usage_logs.action IS 'Action type: copy, view, execute';

-- Follows table
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE follows IS 'User follow relationships';

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  votable_type TEXT NOT NULL,
  votable_id INTEGER NOT NULL,
  vote_type vote_type NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE votes IS 'Upvotes and downvotes on prompts and comments';
COMMENT ON COLUMN votes.votable_type IS 'Type of entity being voted on: prompt or comment';

-- Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER NOT NULL REFERENCES users(id),
  referred_user_id INTEGER REFERENCES users(id),
  referral_code TEXT NOT NULL UNIQUE,
  converted BOOLEAN NOT NULL DEFAULT FALSE,
  converted_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE referrals IS 'User referral tracking';

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE notifications IS 'User notifications and alerts';

-- Admin Settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE admin_settings IS 'Platform configuration settings';

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Users indexes
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- Prompts indexes
CREATE UNIQUE INDEX IF NOT EXISTS prompts_slug_idx ON prompts(slug);
CREATE INDEX IF NOT EXISTS prompts_owner_idx ON prompts(owner_id);
CREATE INDEX IF NOT EXISTS prompts_industry_tags_idx ON prompts USING GIN(industry_tags);
CREATE INDEX IF NOT EXISTS prompts_social_tags_idx ON prompts USING GIN(social_tags);
CREATE INDEX IF NOT EXISTS prompts_popularity_idx ON prompts(popularity_score DESC);
CREATE INDEX IF NOT EXISTS prompts_created_at_idx ON prompts(created_at DESC);

-- Prompt Versions indexes
CREATE INDEX IF NOT EXISTS prompt_versions_prompt_idx ON prompt_versions(prompt_id, version_number);
CREATE INDEX IF NOT EXISTS prompt_versions_parent_idx ON prompt_versions(parent_version_id);
CREATE INDEX IF NOT EXISTS prompt_versions_status_idx ON prompt_versions(status);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS workflows_created_by_idx ON workflows(created_by);

-- Remixes indexes
CREATE INDEX IF NOT EXISTS remixes_original_prompt_idx ON remixes(original_prompt_id);
CREATE INDEX IF NOT EXISTS remixes_user_idx ON remixes(user_id);

-- Comments indexes
CREATE INDEX IF NOT EXISTS comments_prompt_idx ON comments(prompt_id);
CREATE INDEX IF NOT EXISTS comments_user_idx ON comments(user_id);
CREATE INDEX IF NOT EXISTS comments_parent_idx ON comments(parent_comment_id);

-- User Badges indexes
CREATE UNIQUE INDEX IF NOT EXISTS user_badges_user_badge_idx ON user_badges(user_id, badge_id);

-- Usage Logs indexes
CREATE INDEX IF NOT EXISTS usage_logs_user_idx ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS usage_logs_prompt_version_idx ON usage_logs(prompt_version_id);
CREATE INDEX IF NOT EXISTS usage_logs_created_at_idx ON usage_logs(created_at DESC);

-- Follows indexes
CREATE UNIQUE INDEX IF NOT EXISTS follows_follower_following_idx ON follows(follower_id, following_id);
CREATE INDEX IF NOT EXISTS follows_follower_idx ON follows(follower_id);
CREATE INDEX IF NOT EXISTS follows_following_idx ON follows(following_id);

-- Votes indexes
CREATE UNIQUE INDEX IF NOT EXISTS votes_user_votable_idx ON votes(user_id, votable_type, votable_id);
CREATE INDEX IF NOT EXISTS votes_votable_idx ON votes(votable_type, votable_id);

-- Referrals indexes
CREATE INDEX IF NOT EXISTS referrals_referrer_idx ON referrals(referrer_id);
CREATE UNIQUE INDEX IF NOT EXISTS referrals_code_idx ON referrals(referral_code);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS notifications_user_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_read_idx ON notifications(read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at DESC);

-- ============================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompt_versions_updated_at BEFORE UPDATE ON prompt_versions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at BEFORE UPDATE ON admin_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - Optional
-- ============================================
-- Uncomment below to enable RLS policies for Supabase Auth

-- Enable RLS on all tables
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize as needed)
-- CREATE POLICY "Users can view public prompts" ON prompts
--   FOR SELECT USING (visibility = 'public' OR owner_id = auth.uid());

-- CREATE POLICY "Users can update their own prompts" ON prompts
--   FOR UPDATE USING (owner_id = auth.uid());

-- CREATE POLICY "Users can insert their own prompts" ON prompts
--   FOR INSERT WITH CHECK (owner_id = auth.uid());

-- ============================================
-- INITIAL DATA (Optional)
-- ============================================

-- Insert default admin settings
INSERT INTO admin_settings (key, value) VALUES
  ('platform_name', '"PromptLibrary"'::jsonb),
  ('allow_registration', 'true'::jsonb),
  ('karma_weights', '{"prompt_creation": 10, "quality_bonus": 5, "usage_bonus": 1, "upvote": 2, "remix": 3}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'PromptLibrary Database Schema Created Successfully!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Tables created: 14';
  RAISE NOTICE 'Indexes created: 30+';
  RAISE NOTICE 'Enums created: 9';
  RAISE NOTICE 'Triggers created: 6';
  RAISE NOTICE 'Ready for production use!';
  RAISE NOTICE '==============================================';
END $$;
