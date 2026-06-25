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

  // Split by semicolons and filter out empty/comment lines
  const statements = sql
    .split('\n')
    .filter(line => line.trim().length > 0 && !line.trim().startsWith('--'))
    .join('\n')
    .split(';\n')
    .map(s => s.trim() + ';')
    .filter(s => s.length > 2 && s !== ';')

  for (const stmt of statements) {
    try {
      // Use tagged template syntax for Neon
      await db(stmt)
      console.log(`✓ ${stmt.slice(0, 80).replace(/\n/g, ' ')}`)
    } catch (err) {
      if (err.message?.includes('already exists')) {
        console.log(`→ Already exists: ${stmt.slice(0, 60)}...`)
      } else {
        console.error(`✗ ${err.message}`)
      }
    }
  }

  console.log('\n✅ Migration complete!')
}

migrate().catch(console.error)