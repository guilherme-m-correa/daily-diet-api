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
})
