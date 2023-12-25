import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { setupKnex as knex } from '../config/database'
import { checkIfSessionIdExists } from '../middlewares/check-if-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const { user } = request

      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().refine((value) => {
          const date = new Date(value)
          return !isNaN(date.getTime())
        }, 'Invalid date'),
        isOnDiet: z.boolean(),
      })

      const { name, description, date, isOnDiet } = createMealsBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date,
        is_on_diet: isOnDiet,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      return reply.status(201).send()
    },
  )

  app.get(
    '/',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const { user } = request

      const meals = await knex('meals')
        .where({ user_id: user.id })
        .orderBy('date', 'desc')

      const mappedMeals = meals.map((meal) => ({
        id: meal.id,
        name: meal.name,
        description: meal.description,
        date: meal.date,
        isOnDiet: Boolean(meal.is_on_diet),
      }))

      return reply.status(200).send({ meals: mappedMeals })
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const { user } = request

      const meal = await knex('meals')
        .where({ id: mealId, user_id: user.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' })
      }

      return reply.status(200).send({
        meal: {
          id: meal.id,
          name: meal.name,
          description: meal.description,
          date: meal.date,
          isOnDiet: Boolean(meal.is_on_diet),
        },
      })
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [checkIfSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const { user } = request

      const updateMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.string().refine((value) => {
          const date = new Date(value)
          return !isNaN(date.getTime())
        }, 'Invalid date'),
        isOnDiet: z.boolean(),
      })

      const { name, description, date, isOnDiet } = updateMealsBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals')
        .where({ id: mealId, user_id: user.id })
        .first()

      if (!meal) {
        return reply.status(404).send({ message: 'Meal not found' })
      }

      await knex('meals').where({ id: mealId }).update({
        name,
        description,
        date,
        is_on_diet: isOnDiet,
        updated_at: new Date().toISOString(),
      })

      return reply.status(204).send()
    },
  )
}
