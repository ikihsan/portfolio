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
    // Drop single-column unique constraints that block composite ones
    `ALTER TABLE browsers DROP CONSTRAINT IF EXISTS browsers_name_key`,
    `ALTER TABLE browsers DROP CONSTRAINT IF EXISTS browsers_version_key`,
    `ALTER TABLE operating_systems DROP CONSTRAINT IF EXISTS operating_systems_name_key`,
    `ALTER TABLE operating_systems DROP CONSTRAINT IF EXISTS operating_systems_version_key`,
    `ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_type_key`,
    `ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_screen_resolution_key`,
    `ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_touch_capable_key`,
    `ALTER TABLE devices DROP CONSTRAINT IF EXISTS devices_pixel_ratio_key`,
    `ALTER TABLE traffic_sources DROP CONSTRAINT IF EXISTS traffic_sources_source_key`,
    `ALTER TABLE traffic_sources DROP CONSTRAINT IF EXISTS traffic_sources_medium_key`,
    `ALTER TABLE traffic_sources DROP CONSTRAINT IF EXISTS traffic_sources_campaign_key`,

    // Add composite unique constraints
    `ALTER TABLE browsers ADD CONSTRAINT browsers_name_version_key UNIQUE (name, version)`,
    `ALTER TABLE operating_systems ADD CONSTRAINT operating_systems_name_version_key UNIQUE (name, version)`,
    `ALTER TABLE devices ADD CONSTRAINT devices_type_res_touch_pixel_key UNIQUE (type, screen_resolution, touch_capable, pixel_ratio)`,
    `ALTER TABLE traffic_sources ADD CONSTRAINT traffic_sources_source_medium_campaign_key UNIQUE (source, medium, campaign)`,
  ]

  for (const step of steps) {
    try {
      await client.query(step)
      const label = step.replace('ALTER TABLE ', '').replace(' ADD CONSTRAINT ', '+').replace(' DROP CONSTRAINT IF EXISTS ', '-')
      console.log(`✓ ${label.substring(0, 80)}`)
    } catch (err) {
      console.error(`✗ ${err.message.substring(0, 120)}`)
    }
  }

  await client.end()
  console.log('\n✅ Composite constraints added!')
}

migrate().catch(console.error)