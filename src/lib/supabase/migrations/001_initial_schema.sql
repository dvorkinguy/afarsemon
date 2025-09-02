-- Afarsemon AI Automation Platform - Initial Schema
-- Supporting Hebrew-first content for Israeli SMBs

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  company_size TEXT,
  industry TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'he' CHECK (preferred_language IN ('he', 'en')),
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user', 'viewer')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  name_he TEXT,
  slug TEXT NOT NULL UNIQUE,
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  logo_url TEXT,
  website TEXT,
  description TEXT,
  description_he TEXT,
  industry TEXT,
  size TEXT,
  settings JSONB,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'professional', 'enterprise')),
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trial')),
  trial_ends_at TIMESTAMPTZ
);

-- Create organization_members table
CREATE TABLE IF NOT EXISTS organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES profiles(id),
  joined_at TIMESTAMPTZ,
  UNIQUE(organization_id, user_id)
);

-- Create automation_demos table
CREATE TABLE IF NOT EXISTS automation_demos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  title TEXT NOT NULL,
  title_he TEXT NOT NULL,
  description TEXT NOT NULL,
  description_he TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sales', 'marketing', 'customer_service', 'operations', 'hr', 'finance', 'other')),
  demo_type TEXT NOT NULL CHECK (demo_type IN ('interactive', 'video', 'live_integration')),
  thumbnail_url TEXT,
  video_url TEXT,
  demo_config JSONB NOT NULL,
  tags TEXT[] DEFAULT '{}',
  wow_factor INTEGER DEFAULT 5 CHECK (wow_factor >= 1 AND wow_factor <= 10),
  complexity TEXT DEFAULT 'intermediate' CHECK (complexity IN ('simple', 'intermediate', 'advanced')),
  estimated_time_savings TEXT,
  roi_percentage INTEGER,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  interaction_count INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2),
  industry_specific TEXT[]
);

-- Create automation_templates table
CREATE TABLE IF NOT EXISTS automation_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  name_he TEXT NOT NULL,
  description TEXT NOT NULL,
  description_he TEXT NOT NULL,
  category TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('n8n', 'make', 'zapier', 'custom')),
  template_data JSONB NOT NULL,
  required_integrations TEXT[] DEFAULT '{}',
  estimated_setup_time INTEGER DEFAULT 30,
  difficulty_level TEXT DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'expert')),
  use_cases TEXT[] DEFAULT '{}',
  use_cases_he TEXT[] DEFAULT '{}',
  preview_image_url TEXT,
  documentation_url TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  author_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL
);

-- Create webhook_configs table
CREATE TABLE IF NOT EXISTS webhook_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  endpoint_url TEXT NOT NULL,
  secret_key TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('n8n', 'make', 'zapier', 'custom')),
  events TEXT[] DEFAULT '{}',
  headers JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  last_triggered_at TIMESTAMPTZ,
  trigger_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  metadata JSONB
);

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  webhook_config_id UUID NOT NULL REFERENCES webhook_configs(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body JSONB,
  error_message TEXT,
  execution_time_ms INTEGER,
  retry_count INTEGER DEFAULT 0
);

-- Create usage_analytics table
CREATE TABLE IF NOT EXISTS usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL,
  event_data JSONB,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT
);

-- Create demo_interactions table
CREATE TABLE IF NOT EXISTS demo_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  demo_id UUID NOT NULL REFERENCES automation_demos(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'play', 'complete', 'share', 'save')),
  interaction_data JSONB,
  session_id TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT
);

-- Create ai_chat_sessions table
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  session_title TEXT,
  context JSONB,
  model TEXT DEFAULT 'gemini-2.5-flash',
  total_tokens INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create ai_chat_messages table
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_owner ON organizations(owner_id);
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_demos_category ON automation_demos(category);
CREATE INDEX idx_demos_featured ON automation_demos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_templates_platform ON automation_templates(platform);
CREATE INDEX idx_templates_category ON automation_templates(category);
CREATE INDEX idx_webhooks_org ON webhook_configs(organization_id);
CREATE INDEX idx_webhook_logs_config ON webhook_logs(webhook_config_id);
CREATE INDEX idx_analytics_org ON usage_analytics(organization_id);
CREATE INDEX idx_analytics_user ON usage_analytics(user_id);
CREATE INDEX idx_interactions_demo ON demo_interactions(demo_id);
CREATE INDEX idx_chat_sessions_user ON ai_chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session ON ai_chat_messages(session_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_demos_updated_at BEFORE UPDATE ON automation_demos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_templates_updated_at BEFORE UPDATE ON automation_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webhook_configs_updated_at BEFORE UPDATE ON webhook_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_chat_sessions_updated_at BEFORE UPDATE ON ai_chat_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_demos ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Organizations policies
CREATE POLICY "Organization members can view" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update" ON organizations
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Anyone can create organization" ON organizations
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Demo policies (public read)
CREATE POLICY "Public can view active demos" ON automation_demos
  FOR SELECT USING (is_active = TRUE);

-- Templates policies (public read for public templates)
CREATE POLICY "Public can view public templates" ON automation_templates
  FOR SELECT USING (is_public = TRUE);

-- Insert sample data function (optional, for testing)
CREATE OR REPLACE FUNCTION insert_sample_demos()
RETURNS void AS $$
BEGIN
  INSERT INTO automation_demos (
    title, title_he, description, description_he,
    category, demo_type, demo_config, tags, wow_factor,
    complexity, estimated_time_savings, roi_percentage, is_featured
  ) VALUES
  (
    'Smart Lead Scoring with AI',
    'ניקוד לידים חכם עם AI',
    'Automatically score and prioritize leads based on behavior and engagement',
    'דירוג וסדר עדיפויות אוטומטי של לידים על בסיס התנהגות ומעורבות',
    'sales',
    'interactive',
    '{"demo_url": "/demos/lead-scoring", "features": ["ai_scoring", "crm_integration"]}',
    ARRAY['AI', 'Sales', 'CRM'],
    9,
    'intermediate',
    '5 hours per week',
    150,
    TRUE
  ),
  (
    'Customer Support Chatbot',
    'צ''אטבוט תמיכת לקוחות',
    'AI-powered chatbot that handles common customer inquiries 24/7',
    'צ''אטבוט מבוסס AI שמטפל בפניות לקוחות נפוצות 24/7',
    'customer_service',
    'live_integration',
    '{"demo_url": "/demos/chatbot", "features": ["nlp", "multi_language"]}',
    ARRAY['AI', 'Support', 'Chatbot'],
    8,
    'simple',
    '20 hours per week',
    200,
    TRUE
  );
END;
$$ LANGUAGE plpgsql;