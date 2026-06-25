import { neon } from '@neondatabase/serverless'

let dbClient = null

export function getDB() {
  if (!dbClient) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    dbClient = neon(connectionString)
  }
  return dbClient
}

export async function query(sql, params = []) {
  const client = getDB()
  try {
    if (params.length > 0) {
      return await client.query(sql, params)
    }
    return await client(sql)
  } catch (error) {
    // Attempt to recover connection errors
    if (error.message?.includes('connection')) {
      dbClient = null
      const client = getDB()
      if (params.length > 0) {
        return await client.query(sql, params)
      }
      return await client(sql)
    }
    throw error
  }
}

// Query helper for tagged template literals
export async function sql(strings, ...values) {
  const client = getDB()
  const text = strings.reduce(
    (acc, str, i) => acc + (i > 0 ? `$${i}` : '') + str,
    ''
  )
  return await client.query(text, values)
}