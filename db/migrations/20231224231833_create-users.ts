import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('email').unique().notNullable()
    table.string('session_id').notNullable()
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}
