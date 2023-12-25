import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Meal routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('POST /meals', () => {
    it('should create a new meal', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(201)
    })

    it('should NOT create a new meal if the sessionId cookie is not provided', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)

      expect(createMealResponse.status).toBe(401)
    })

    it('should NOT create a new meal if the sessionId cookie is invalid', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', 'sessionId=invalid-session-id')

      expect(createMealResponse.status).toBe(401)
    })

    it('should NOT create a new meal if the name is not provided', async () => {
      const arrange = {
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(400)
      expect(createMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'name',
            message: 'Required',
          },
        ],
      })
    })

    it('should NOT create a new meal if the description is not provided', async () => {
      const arrange = {
        name: 'Breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(400)
      expect(createMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'description',
            message: 'Required',
          },
        ],
      })
    })

    it('should NOT create a new meal if the date is not provided', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(400)
      expect(createMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'date',
            message: 'Required',
          },
        ],
      })
    })

    it('should NOT create a new meal if the date is invalid', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: 'invalid-date',
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(400)
      expect(createMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'date',
            message: 'Invalid date',
          },
        ],
      })
    })

    it('should NOT create a new meal if the isOnDiet is not provided', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(400)
      expect(createMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'isOnDiet',
            message: 'Required',
          },
        ],
      })
    })

    it('should NOT create a new meal if the isOnDiet is not a boolean', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: 'invalid-isOnDiet',
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const createMealResponse = await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      expect(createMealResponse.status).toBe(400)
      expect(createMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'isOnDiet',
            message: 'Expected boolean, received string',
          },
        ],
      })
    })
  })

  describe('GET /meals', () => {
    it('should list all meals from user', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      const getMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

      expect(getMealsResponse.status).toBe(200)
      expect(getMealsResponse.body).toMatchObject({
        meals: [
          {
            id: expect.any(String),
            name: arrange.name,
            description: arrange.description,
            date: arrange.date.toISOString(),
            isOnDiet: arrange.isOnDiet,
          },
        ],
      })
    })

    it('should NOT list all meals from user if the sessionId cookie is not provided', async () => {
      const getMealsResponse = await request(app.server).get('/meals')

      expect(getMealsResponse.status).toBe(401)
    })

    it('should NOT list all meals from user if the sessionId cookie is invalid', async () => {
      const getMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', 'sessionId=invalid-session-id')

      expect(getMealsResponse.status).toBe(401)
    })

    it('should NOT list meals from another user', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      const createAnotherUserResponse = await request(app.server)
        .post('/users')
        .send({
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        })

      const anotherCookie = createAnotherUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send({
          name: 'Dinner',
          description: 'A nice dinner',
          date: new Date(),
          isOnDiet: true,
        })
        .set('Cookie', anotherCookie)

      const getMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

      expect(getMealsResponse.status).toBe(200)
      expect(getMealsResponse.body).toMatchObject({
        meals: [
          {
            id: expect.any(String),
            name: arrange.name,
            description: arrange.description,
            date: arrange.date.toISOString(),
            isOnDiet: arrange.isOnDiet,
          },
        ],
      })
    })
  })

  describe('GET /meals/:mealId', () => {
    it('should get a meal by id', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      const listMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

      const mealId = listMealsResponse.body.meals[0].id

      const getMealResponse = await request(app.server)
        .get(`/meals/${mealId}`)
        .set('Cookie', cookie)

      expect(getMealResponse.status).toBe(200)
      expect(getMealResponse.body).toMatchObject({
        meal: {
          id: mealId,
          name: arrange.name,
          description: arrange.description,
          date: arrange.date.toISOString(),
          isOnDiet: arrange.isOnDiet,
        },
      })
    })

    it('should throw an error if the id is not a valid uuid', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const invalidMealId = 'invalid-meal-id'

      const getMealResponse = await request(app.server)
        .get(`/meals/${invalidMealId}`)
        .set('Cookie', cookie)

      expect(getMealResponse.status).toBe(400)
      expect(getMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'mealId',
            message: 'Invalid uuid',
          },
        ],
      })
    })

    it('should NOT get a meal by id if the meal does not exist', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const nonExistingMealId = '3c825cb2-6226-4400-bb59-b5847831d08c'

      const getMealResponse = await request(app.server)
        .get(`/meals/${nonExistingMealId}`)
        .set('Cookie', cookie)

      expect(getMealResponse.status).toBe(404)

      expect(getMealResponse.body).toMatchObject({
        message: 'Meal not found',
      })
    })

    it('should NOT get a meal by id if the sessionId cookie is not provided', async () => {
      const getMealResponse = await request(app.server).get('/meals/1')

      expect(getMealResponse.status).toBe(401)
    })

    it('should NOT get a meal by id if the sessionId cookie is invalid', async () => {
      const getMealResponse = await request(app.server)
        .get('/meals/1')
        .set('Cookie', 'sessionId=invalid-session-id')

      expect(getMealResponse.status).toBe(401)
    })
  })

  describe('PUT /meals/:mealId', () => {
    it('should update a meal by id', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
        updatedName: 'Lunch',
        updatedDescription: 'A nice lunch',
        updatedDate: new Date(),
        updatedIsOnDiet: false,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send({
          name: arrange.name,
          description: arrange.description,
          date: arrange.date,
          isOnDiet: arrange.isOnDiet,
        })
        .set('Cookie', cookie)

      const listMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

      const mealId = listMealsResponse.body.meals[0].id

      const updateMealResponse = await request(app.server)
        .put(`/meals/${mealId}`)
        .send({
          name: arrange.updatedName,
          description: arrange.updatedDescription,
          date: arrange.updatedDate,
          isOnDiet: arrange.updatedIsOnDiet,
        })
        .set('Cookie', cookie)

      expect(updateMealResponse.status).toBe(204)

      const getMealResponse = await request(app.server)
        .get(`/meals/${mealId}`)
        .set('Cookie', cookie)

      expect(getMealResponse.status).toBe(200)
      expect(getMealResponse.body).toMatchObject({
        meal: {
          id: mealId,
          name: arrange.updatedName,
          description: arrange.updatedDescription,
          date: arrange.updatedDate.toISOString(),
          isOnDiet: arrange.updatedIsOnDiet,
        },
      })
    })

    it('should throw an error if the id is not a valid uuid', async () => {
      const arrange = {
        updatedDescription: 'A nice lunch',
        updatedDate: new Date(),
        updatedIsOnDiet: false,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const invalidMealId = 'invalid-meal-id'

      const updateMealResponse = await request(app.server)
        .put(`/meals/${invalidMealId}`)
        .send({
          description: arrange.updatedDescription,
          date: arrange.updatedDate,
          isOnDiet: arrange.updatedIsOnDiet,
        })
        .set('Cookie', cookie)

      expect(updateMealResponse.status).toBe(400)
      expect(updateMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'mealId',
            message: 'Invalid uuid',
          },
        ],
      })
    })

    it('should NOT update a meal by id if the meal does not exist', async () => {
      const arrange = {
        updatedName: 'Lunch',
        updatedDescription: 'A nice lunch',
        updatedDate: new Date(),
        updatedIsOnDiet: false,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const nonExistingMealId = '3c825cb2-6226-4400-bb59-b5847831d08c'

      const updateMealResponse = await request(app.server)
        .put(`/meals/${nonExistingMealId}`)
        .send({
          name: arrange.updatedName,
          description: arrange.updatedDescription,
          date: arrange.updatedDate,
          isOnDiet: arrange.updatedIsOnDiet,
        })
        .set('Cookie', cookie)

      expect(updateMealResponse.status).toBe(404)
      expect(updateMealResponse.body).toMatchObject({
        message: 'Meal not found',
      })
    })

    it('should NOT update a meal by id if the sessionId cookie is not provided', async () => {
      const updateMealResponse = await request(app.server).put('/meals/1')

      expect(updateMealResponse.status).toBe(401)
    })

    it('should NOT update a meal by id if the sessionId cookie is invalid', async () => {
      const updateMealResponse = await request(app.server)
        .put('/meals/1')
        .set('Cookie', 'sessionId=invalid-session-id')

      expect(updateMealResponse.status).toBe(401)
    })
  })

  describe('DELETE /meals/:mealId', () => {
    it('should delete a meal by id', async () => {
      const arrange = {
        name: 'Breakfast',
        description: 'A nice breakfast',
        date: new Date(),
        isOnDiet: true,
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send(arrange)
        .set('Cookie', cookie)

      const listMealsResponse = await request(app.server)
        .get('/meals')
        .set('Cookie', cookie)

      const mealId = listMealsResponse.body.meals[0].id

      const deleteMealResponse = await request(app.server)
        .delete(`/meals/${mealId}`)
        .set('Cookie', cookie)

      expect(deleteMealResponse.status).toBe(204)
    })

    it('should throw an error if the id is not a valid uuid', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const invalidMealId = 'invalid-meal-id'

      const deleteMealResponse = await request(app.server)
        .delete(`/meals/${invalidMealId}`)
        .set('Cookie', cookie)

      expect(deleteMealResponse.status).toBe(400)
      expect(deleteMealResponse.body).toMatchObject({
        errors: [
          {
            path: 'mealId',
            message: 'Invalid uuid',
          },
        ],
      })
    })

    it('should NOT delete a meal by id if the meal does not exist', async () => {
      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      const nonExistingMealId = '3c825cb2-6226-4400-bb59-b5847831d08c'

      const deleteMealResponse = await request(app.server)
        .delete(`/meals/${nonExistingMealId}`)
        .set('Cookie', cookie)

      expect(deleteMealResponse.status).toBe(404)
      expect(deleteMealResponse.body).toMatchObject({
        message: 'Meal not found',
      })
    })

    it('should NOT delete a meal by id if the sessionId cookie is not provided', async () => {
      const deleteMealResponse = await request(app.server).delete('/meals/1')

      expect(deleteMealResponse.status).toBe(401)
    })

    it('should NOT delete a meal by id if the sessionId cookie is invalid', async () => {
      const deleteMealResponse = await request(app.server)
        .delete('/meals/1')
        .set('Cookie', 'sessionId=invalid-session-id')

      expect(deleteMealResponse.status).toBe(401)
    })
  })

  describe('GET /meals/metrics', () => {
    it('should get the metrics from the meals', async () => {
      const arrange = {
        breakfast: {
          name: 'Breakfast',
          description: 'A nice breakfast',
          date: new Date(),
          isOnDiet: true,
        },
        lunch: {
          name: 'Lunch',
          description: 'A nice lunch',
          date: new Date(),
          isOnDiet: true,
        },
        dinner: {
          name: 'Dinner',
          description: 'A nice dinner',
          date: new Date(),
          isOnDiet: true,
        },
      }

      const createUserResponse = await request(app.server).post('/users').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
      })

      const cookie = createUserResponse.headers['set-cookie'][0]

      await request(app.server)
        .post('/meals')
        .send(arrange.breakfast)
        .set('Cookie', cookie)

      await request(app.server)
        .post('/meals')
        .send(arrange.lunch)
        .set('Cookie', cookie)

      await request(app.server)
        .post('/meals')
        .send(arrange.dinner)
        .set('Cookie', cookie)

      const getMealsMetricsResponse = await request(app.server)
        .get('/meals/metrics')
        .set('Cookie', cookie)

      expect(getMealsMetricsResponse.status).toBe(200)
      expect(getMealsMetricsResponse.body).toMatchObject({
        metrics: {
          totalMeals: 3,
          totalMealsWithinDiet: 3,
          totalMealsOutsideDiet: 0,
          bestDietSequence: 3,
        },
      })
    })

    it('should NOT get the metrics from the meals if the sessionId cookie is not provided', async () => {
      const getMealsMetricsResponse = await request(app.server).get(
        '/meals/metrics',
      )

      expect(getMealsMetricsResponse.status).toBe(401)
    })

    it('should NOT get the metrics from the meals if the sessionId cookie is invalid', async () => {
      const getMealsMetricsResponse = await request(app.server)
        .get('/meals/metrics')
        .set('Cookie', 'sessionId=invalid-session-id')

      expect(getMealsMetricsResponse.status).toBe(401)
    })
  })
})
