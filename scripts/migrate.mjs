import { neon } from '@neondatabase/serverless'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const sql = readFileSync(resolve(__dirname, '..', 'lib', 'schema.sql'), 'utf-8')

async function migrate() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is required')
    process.exit(1)
  }

  console.log('Connecting to Neon PostgreSQL...')
  const db = neon(connectionString)

  console.log('Running schema migration...')
  
  // Split by statements (semicolons followed by newlines)
  const statements = sql
    .split(';\n')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const stmt of statements) {
    try {
      await db(stmt)
      console.log(`✓ ${stmt.slice(0, 60)}...`)
    } catch (err) {
      // Ignore "already exists" errors
      if (!err.message?.includes('already exists')) {
        console.error(`✗ Error: ${err.message}`)
        console.error(`  Statement: ${stmt.slice(0, 100)}`)
      }
    }
  }

  console.log('\n✅ Migration complete!')
}

migrate().catch(console.error)