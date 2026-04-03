import { defineConfig } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const DIRECT_URL = process.env.DIRECT_URL
if (!DIRECT_URL) throw new Error('DIRECT_URL is not set')

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: DIRECT_URL,
  },
  strict: true,
  verbose: true,
})