import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.dateTime('date').notNullable()
    table.boolean('is_on_diet').notNullable()
    table.uuid('user_id').notNullable().references('id').inTable('users')
    table.timestamp('created_at').notNullable()
    table.timestamp('updated_at').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('meals')
}
