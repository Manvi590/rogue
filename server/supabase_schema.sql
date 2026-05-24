-- 1. Users Table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  profile_image TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Records Table
CREATE TABLE records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  athlete_id TEXT,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  value TEXT NOT NULL,
  unit TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  evidence_url TEXT NOT NULL,
  thumbnail_url TEXT,
  venue_name TEXT,
  city TEXT,
  witnesses JSONB DEFAULT '[]',
  record_type TEXT DEFAULT 'standard',
  date_set TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Events Table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category TEXT,
  stock_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Contact Messages Table
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Videos Table
CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID REFERENCES records(id) ON DELETE CASCADE,
  attempt_id UUID,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_type TEXT NOT NULL CHECK (video_type IN ('record', 'attempt', 'featured', 'newest_record', 'attempt_history')),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  source TEXT NOT NULL CHECK (source IN ('uploaded', 'youtube', 'external_url')),
  youtube_video_id TEXT,
  duration INTEGER,
  is_published BOOLEAN DEFAULT TRUE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT check_video_reference CHECK (record_id IS NOT NULL OR attempt_id IS NOT NULL)
);

-- 7. Evidence Table
CREATE TABLE evidence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL CHECK (evidence_type IN ('photo', 'screenshot', 'document', 'certificate')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Indexes for Better Query Performance
CREATE INDEX idx_videos_record_id ON videos(record_id);
CREATE INDEX idx_videos_user_id ON videos(user_id);
CREATE INDEX idx_videos_video_type ON videos(video_type);
CREATE INDEX idx_videos_source ON videos(source);
CREATE INDEX idx_videos_is_published ON videos(is_published);
CREATE INDEX idx_videos_created_at ON videos(created_at);

CREATE INDEX idx_evidence_record_id ON evidence(record_id);
CREATE INDEX idx_evidence_user_id ON evidence(user_id);
CREATE INDEX idx_evidence_status ON evidence(status);
CREATE INDEX idx_evidence_evidence_type ON evidence(evidence_type);
CREATE INDEX idx_evidence_created_at ON evidence(created_at);

-- ========================================================
-- 9. ADD MISSING COLUMNS TO EXISTING EVENTS TABLE
-- ========================================================
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_live BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS stream_url TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS is_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS ticket_price DECIMAL(10, 2) DEFAULT 0.00;

-- ========================================================
-- 10. Categories Table
-- ========================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  parent UUID REFERENCES categories(id) ON DELETE SET NULL,
  order_num INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 11. Age Groups Table
-- ========================================================
CREATE TABLE IF NOT EXISTS age_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  min_age INTEGER NOT NULL,
  max_age INTEGER,
  description TEXT DEFAULT '',
  active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 12. Memberships Table
-- ========================================================
CREATE TABLE IF NOT EXISTS memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'bronze', 'silver', 'gold')),
  start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  auto_renew BOOLEAN DEFAULT FALSE,
  submission_limit INTEGER DEFAULT 3,
  submission_count INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]',
  price DECIMAL(10, 2) DEFAULT 0.00,
  renewal_price DECIMAL(10, 2) DEFAULT 0.00,
  payment_history JSONB DEFAULT '[]',
  cancellation_date TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 13. Tickets Table
-- ========================================================
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  access_code TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'used', 'revoked')),
  ticket_type TEXT DEFAULT 'spectator' CHECK (ticket_type IN ('spectator', 'vip', 'free')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 14. Record Meta Table
-- ========================================================
CREATE TABLE IF NOT EXISTS record_meta (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  record_id UUID NOT NULL REFERENCES records(id) ON DELETE CASCADE,
  tracking_number TEXT,
  submission_fee DECIMAL(10, 2) DEFAULT 0.00,
  admin_notes TEXT,
  history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- 15. Create New Indexes for Better Query Performance
-- ========================================================
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_event_id ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_record_meta_record_id ON record_meta(record_id);

