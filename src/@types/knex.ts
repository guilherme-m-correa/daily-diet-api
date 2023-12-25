import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      session_id: string
      created_at: string
      updated_at: string
    }

    meals: {
      id: string
      name: string
      description: string
      date: string
      is_on_diet: boolean
      user_id: string
      created_at: string
      updated_at: string
    }
  }
}
