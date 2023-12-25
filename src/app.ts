import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { z } from 'zod'
import { usersRoutes } from './routes/users.routes'
import { mealsRoutes } from './routes/meals.routes'

export const app = fastify({
  logger: true,
})

app.get('/', async (request, reply) => {
  return reply.send({ message: 'Meal Tracker API' })
})

app.register(cookie)

app.register(usersRoutes, { prefix: 'users' })
app.register(mealsRoutes, { prefix: 'meals' })

app.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    const formattedErrors = error.issues.map((issue) => {
      return {
        path: issue.path.join('.'),
        message: issue.message,
      }
    })

    return reply.status(400).send({ errors: formattedErrors })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal Server Error' })
})
