import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { setupKnex as knex } from '../config/database'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
    })

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      })
    }

    const { name, email } = createUserBodySchema.parse(request.body)

    const emailAlreadyExists = await knex('users').where({ email }).first()

    if (emailAlreadyExists) {
      return reply.status(400).send({ message: 'Email already exists' })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    return reply.status(201).send()
  })
}
