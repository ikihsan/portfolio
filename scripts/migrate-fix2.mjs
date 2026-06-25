import pg from 'pg'
const { Client } = pg

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL required')
  process.exit(1)
}

async function migrate() {
  const client = new Client({ connectionString })
  await client.connect()
  console.log('Connected\n')

  const steps = [
    // Drop broken tables
    `DROP TABLE IF EXISTS events CASCADE`,
    `DROP TABLE IF EXISTS page_views CASCADE`,
    `DROP TABLE IF EXISTS sessions CASCADE`,
    
    // Recreate traffic_sources with simple UNIQUE
    `CREATE TABLE IF NOT EXISTS traffic_sources (
      id SERIAL PRIMARY KEY,
      source VARCHAR(50) NOT NULL,
      medium VARCHAR(50) DEFAULT '',
      campaign VARCHAR(100) DEFAULT '',
      UNIQUE(source, medium, campaign)
    )`,
    
    // Recreate sessions
    `CREATE TABLE IF NOT EXISTS sessions (
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
    `CREATE TABLE IF NOT EXISTS page_views (
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
    `CREATE TABLE IF NOT EXISTS events (
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

    // Recreate indexes
    `CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id)`,
    `CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at)`,
    `CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id)`,
    `CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_page_views_entered_at ON page_views(entered_at)`,
    `CREATE INDEX IF NOT EXISTS idx_page_views_page_id ON page_views(page_id)`,
    `CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id)`,
    `CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id)`,
    `CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at)`,
    `CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, event_category)`,
  ]

  for (const step of steps) {
    try {
      await client.query(step)
      const label = step.replace('CREATE TABLE IF NOT EXISTS ', '')
                           .replace('CREATE INDEX IF NOT EXISTS ', '')
                           .replace('DROP TABLE IF EXISTS ', '')
      console.log(`✓ ${label.substring(0, 70)}`)
    } catch (err) {
      console.error(`✗ ${err.message.substring(0, 120)}`)
    }
  }

  await client.end()
  console.log('\n✅ All fixed!')
}

migrate().catch(console.error)