import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required')
  process.exit(1)
}

async function migrate() {
  const sql = neon(connectionString)
  console.log('Connecting to Neon PostgreSQL...')

  const creates = [
    () => sql`CREATE TABLE IF NOT EXISTS countries (id SERIAL PRIMARY KEY, code VARCHAR(2) NOT NULL UNIQUE, name VARCHAR(100) NOT NULL)`,
    () => sql`CREATE TABLE IF NOT EXISTS regions (id SERIAL PRIMARY KEY, country_id INTEGER REFERENCES countries(id) ON DELETE CASCADE, name VARCHAR(100) NOT NULL, UNIQUE(country_id, name))`,
    () => sql`CREATE TABLE IF NOT EXISTS cities (id SERIAL PRIMARY KEY, region_id INTEGER REFERENCES regions(id) ON DELETE CASCADE, name VARCHAR(100) NOT NULL, UNIQUE(region_id, name))`,
    () => sql`CREATE TABLE IF NOT EXISTS devices (id SERIAL PRIMARY KEY, type VARCHAR(20) NOT NULL, screen_resolution VARCHAR(20), touch_capable BOOLEAN DEFAULT false, pixel_ratio DECIMAL(3,1) DEFAULT 1.0, UNIQUE(type, screen_resolution, touch_capable, pixel_ratio))`,
    () => sql`CREATE TABLE IF NOT EXISTS browsers (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, version VARCHAR(20), UNIQUE(name, version))`,
    () => sql`CREATE TABLE IF NOT EXISTS operating_systems (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, version VARCHAR(20), UNIQUE(name, version))`,
    () => sql`CREATE TABLE IF NOT EXISTS languages (id SERIAL PRIMARY KEY, code VARCHAR(10) NOT NULL UNIQUE, name VARCHAR(50))`,
    () => sql`CREATE TABLE IF NOT EXISTS traffic_sources (id SERIAL PRIMARY KEY, source VARCHAR(50) NOT NULL, medium VARCHAR(50), campaign VARCHAR(100), UNIQUE(source, medium, COALESCE(campaign, '')))`,
    () => sql`CREATE TABLE IF NOT EXISTS pages (id SERIAL PRIMARY KEY, path VARCHAR(500) NOT NULL UNIQUE, title VARCHAR(200), category VARCHAR(50))`,
    () => sql`CREATE TABLE IF NOT EXISTS visitors (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), anonymous_id VARCHAR(64) NOT NULL UNIQUE, first_visit_at TIMESTAMPTZ DEFAULT NOW(), last_visit_at TIMESTAMPTZ DEFAULT NOW(), visit_count INTEGER DEFAULT 1, country_id INTEGER REFERENCES countries(id), region_id INTEGER REFERENCES regions(id), city_id INTEGER REFERENCES cities(id), language_id INTEGER REFERENCES languages(id), timezone VARCHAR(50), device_id INTEGER REFERENCES devices(id), browser_id INTEGER REFERENCES browsers(id), os_id INTEGER REFERENCES operating_systems(id), color_scheme VARCHAR(10), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS sessions (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE, started_at TIMESTAMPTZ DEFAULT NOW(), ended_at TIMESTAMPTZ, duration_seconds INTEGER DEFAULT 0, landing_page_id INTEGER REFERENCES pages(id), exit_page_id INTEGER REFERENCES pages(id), traffic_source_id INTEGER REFERENCES traffic_sources(id), is_returning BOOLEAN DEFAULT false, page_views_count INTEGER DEFAULT 1, bounce BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS page_views (id BIGSERIAL PRIMARY KEY, visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE, session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE, page_id INTEGER NOT NULL REFERENCES pages(id), entered_at TIMESTAMPTZ DEFAULT NOW(), exited_at TIMESTAMPTZ, duration_seconds INTEGER DEFAULT 0, scroll_depth INTEGER DEFAULT 0, is_entrance BOOLEAN DEFAULT false, is_exit BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS events (id BIGSERIAL PRIMARY KEY, visitor_id UUID NOT NULL REFERENCES visitors(id) ON DELETE CASCADE, session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE, event_type VARCHAR(50) NOT NULL, event_category VARCHAR(50) NOT NULL, event_label VARCHAR(200), event_value INTEGER, page_id INTEGER REFERENCES pages(id), metadata JSONB, created_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS daily_statistics (id BIGSERIAL PRIMARY KEY, date DATE NOT NULL UNIQUE, visitors INTEGER DEFAULT 0, unique_visitors INTEGER DEFAULT 0, returning_visitors INTEGER DEFAULT 0, page_views INTEGER DEFAULT 0, sessions INTEGER DEFAULT 0, bounce_count INTEGER DEFAULT 0, total_duration_seconds BIGINT DEFAULT 0, downloads INTEGER DEFAULT 0, interactions INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS weekly_statistics (id BIGSERIAL PRIMARY KEY, week_start DATE NOT NULL UNIQUE, week_end DATE NOT NULL, visitors INTEGER DEFAULT 0, unique_visitors INTEGER DEFAULT 0, returning_visitors INTEGER DEFAULT 0, page_views INTEGER DEFAULT 0, sessions INTEGER DEFAULT 0, bounce_count INTEGER DEFAULT 0, total_duration_seconds BIGINT DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS monthly_statistics (id BIGSERIAL PRIMARY KEY, month DATE NOT NULL UNIQUE, visitors INTEGER DEFAULT 0, unique_visitors INTEGER DEFAULT 0, returning_visitors INTEGER DEFAULT 0, page_views INTEGER DEFAULT 0, sessions INTEGER DEFAULT 0, bounce_count INTEGER DEFAULT 0, total_duration_seconds BIGINT DEFAULT 0, downloads INTEGER DEFAULT 0, interactions INTEGER DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`,
    () => sql`CREATE TABLE IF NOT EXISTS milestones (id SERIAL PRIMARY KEY, type VARCHAR(50) NOT NULL, value BIGINT NOT NULL, label VARCHAR(200) NOT NULL, achieved_at TIMESTAMPTZ DEFAULT NOW(), UNIQUE(type, value))`,
  ]

  for (const fn of creates) {
    try {
      await fn()
      console.log(`✓ Table created`)
    } catch (err) {
      if (err.message?.includes('already exists')) {
        console.log(`→ already exists`)
      } else {
        console.error(`✗ ${err.message.substring(0, 120)}`)
      }
    }
  }

  console.log('\n✅ Migration complete! All tables created.')
}

migrate().catch(console.error)