import { neon } from '@neondatabase/serverless'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required')
  process.exit(1)
}

async function migrateIndexes() {
  const db = neon(connectionString)
  
  const indexes = [
    'CREATE INDEX IF NOT EXISTS idx_visitors_anonymous_id ON visitors(anonymous_id)',
    'CREATE INDEX IF NOT EXISTS idx_visitors_last_visit ON visitors(last_visit_at)',
    'CREATE INDEX IF NOT EXISTS idx_sessions_visitor_id ON sessions(visitor_id)',
    'CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON sessions(started_at)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_visitor_id ON page_views(visitor_id)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_entered_at ON page_views(entered_at)',
    'CREATE INDEX IF NOT EXISTS idx_page_views_page_id ON page_views(page_id)',
    'CREATE INDEX IF NOT EXISTS idx_events_visitor_id ON events(visitor_id)',
    'CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id)',
    'CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at)',
    'CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type, event_category)',
    'CREATE INDEX IF NOT EXISTS idx_daily_statistics_date ON daily_statistics(date)',
    'CREATE INDEX IF NOT EXISTS idx_monthly_statistics_month ON monthly_statistics(month)',
  ]

  for (const sql of indexes) {
    try {
      await db.query(sql)
      console.log(`✓ ${sql}`)
    } catch (err) {
      console.error(`✗ ${err.message}`)
    }
  }

  console.log('\n✅ Index migration complete!')
}

migrateIndexes().catch(console.error)