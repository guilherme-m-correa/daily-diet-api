import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']).default('sqlite'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const parsedEnv = envSchema.safeParse(process.env)

if (parsedEnv.success === false) {
  throw new Error('Invalid environment variables.')
}

const env = parsedEnv.data

export { env }
