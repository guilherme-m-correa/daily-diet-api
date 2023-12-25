import knex, { Knex } from 'knex'
import { env } from './env'

export const dbConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: getConnectionConfig(),
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

function getConnectionConfig(): string | Knex.StaticConnectionConfig {
  if (env.DATABASE_CLIENT === 'sqlite') {
    return { filename: env.DATABASE_URL }
  } else {
    return env.DATABASE_URL
  }
}

export const setupKnex = knex(dbConfig)
