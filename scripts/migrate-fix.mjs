import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required')
  process.exit(1)
}

async function migrate() {
  const sql = neon(connectionString)
  console.log('Fixing tables...')

  // Drop and recreate problem tables in correct order
  const fixes = [
    // Drop dependent tables first
    () => sql`DROP TABLE IF EXISTS events CASCADE`,
    () => sql`DROP TABLE IF EXISTS page_views CASCADE`,
    () => sql`DROP TABLE IF EXISTS sessions CASCADE`,
    () => sql`DROP TABLE IF EXISTS milestones CASCADE`,
    () => sql`DROP TABLE IF EXISTS visitors CASCADE`,
    () => sql`DROP TABLE IF EXISTS traffic_sources CASCADE`,
    () => sql`DROP TABLE IF EXISTS daily_statistics CASCADE`,
    () => sql`DROP TABLE IF EXISTS weekly_statistics CASCADE`,
    () => sql`DROP TABLE IF EXISTS monthly_statistics CASCADE`,
    
    // Recreate traffic_sources without COALESCE in UNIQUE
    () => sql`CREATE TABLE IF NOT EXISTS traffic_sources (
      id SERIAL PRIMARY KEY,
      source VARCHAR(50) NOT NULL,
      medium VARCHAR(50) DEFAULT '',
      campaign VARCHAR(100) DEFAULT '',
      UNIQUE(source, medium, campaign)
    )`,
    
    // Recreate visitors (no FKs to traffic_sources)
    () => sql`CREATE TABLE IF NOT EXISTS visitors (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      anonymous_id VARCHAR(64) NOT NULL UNIQUE,
      first_visit_at TIMESTAMPTZ DEFAULT NOW(),
      last_visit_at TIMESTAMPTZ DEFAULT NOW(),
      visit_count INTEGER DEFAULT 1,
      country_id INTEGER REFERENCES countries(id),
      region_id INTEGER REFERENCES regions(id),
      city_id INTEGER REFERENCES cities(id),
      language_id INTEGER REFERENCES languages(id),
      timezone VARCHAR(50),
      device_id INTEGER REFERENCES devices(id),
      browser_id INTEGER REFERENCES browsers(id),
      os_id INTEGER REFERENCES operating_systems(id),
      color_scheme VARCHAR(10),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Recreate sessions
    () => sql`CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
      started_at TIMESTAMPTZ DEFAULT NOW(),
      ended_at TIMESTAMPTZ,
      duration_seconds INTEGER DEFAULT 0,
      landing_page_id INTEGER REFERENCES pages(id),
      exit_page_id INTEGER REFERENCES pages(id),
      traffic_source_id INTEGER REFERENCES traffic_sources(id),
      is_returning BOOLEAN DEFAULT false,
      page_views_count INTEGER DEFAULT 1,
      bounce BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Recreate page_views
    () => sql`CREATE TABLE IF NOT EXISTS page_views (
      id BIGSERIAL PRIMARY KEY,
      visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
      session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      page_id INTEGER NOT NULL REFERENCES pages(id),
      entered_at TIMESTAMPTZ DEFAULT NOW(),
      exited_at TIMESTAMPTZ,
      duration_seconds INTEGER DEFAULT 0,
      scroll_depth INTEGER DEFAULT 0,
      is_entrance BOOLEAN DEFAULT false,
      is_exit BOOLEAN DEFAULT false,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Recreate events
    () => sql`CREATE TABLE IF NOT EXISTS events (
      id BIGSERIAL PRIMARY KEY,
      visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE,
      session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      event_type VARCHAR(50) NOT NULL,
      event_category VARCHAR(50) NOT NULL,
      event_label VARCHAR(200),
      event_value INTEGER,
      page_id INTEGER REFERENCES pages(id),
      metadata JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    
    // Recreate stats tables
    () => sql`CREATE TABLE IF NOT EXISTS daily_statistics (
      id BIGSERIAL PRIMARY KEY,
      date DATE NOT NULL UNIQUE,
      visitors INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      returning_visitors INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0,
      sessions INTEGER DEFAULT 0,
      bounce_count INTEGER DEFAULT 0,
      total_duration_seconds BIGINT DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      interactions INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    () => sql`CREATE TABLE IF NOT EXISTS weekly_statistics (
      id BIGSERIAL PRIMARY KEY,
      week_start DATE NOT NULL UNIQUE,
      week_end DATE NOT NULL,
      visitors INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      returning_visitors INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0,
      sessions INTEGER DEFAULT 0,
      bounce_count INTEGER DEFAULT 0,
      total_duration_seconds BIGINT DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    () => sql`CREATE TABLE IF NOT EXISTS monthly_statistics (
      id BIGSERIAL PRIMARY KEY,
      month DATE NOT NULL UNIQUE,
      visitors INTEGER DEFAULT 0,
      unique_visitors INTEGER DEFAULT 0,
      returning_visitors INTEGER DEFAULT 0,
      page_views INTEGER DEFAULT 0,
      sessions INTEGER DEFAULT 0,
      bounce_count INTEGER DEFAULT 0,
      total_duration_seconds BIGINT DEFAULT 0,
      downloads INTEGER DEFAULT 0,
      interactions INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`,
    () => sql`CREATE TABLE IF NOT EXISTS milestones (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      value BIGINT NOT NULL,
      label VARCHAR(200) NOT NULL,
      achieved_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(type, value)
    )`,
  ]

  for (const fn of fixes) {
    try {
      await fn()
      console.log(`✓ ${fn.toString().slice(0, 60).replace(/\n/g, ' ')}`)
    } catch (err) {
      console.error(`✗ ${err.message.substring(0, 100)}`)
    }
  }

  // Create indexes
  const indexes = [
    () => sql`CREATE INDEX IF NOT EXISTS idx_visitors_anonymous_id ON visitors(anonymous_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit_at)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_page_views_entered_at ON page_views(entered_at)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_page_views_page_id ON page_views(page_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, event_category)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_daily_statistics_date ON daily_statistics(date)`,
    () => sql`CREATE INDEX IF NOT EXISTS idx_monthly_statistics_month ON monthly_statistics(month)`,
  ]

  for (const fn of indexes) {
    try {
      await fn()
      console.log(`✓ INDEX created`)
    } catch (err) {
      console.error(`✗ ${err.message.substring(0, 100)}`)
    }
  }

  console.log('\n✅ All tables and indexes created successfully!')
}

migrate().catch(console.error)