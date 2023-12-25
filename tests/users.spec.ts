import { execSync } from 'child_process'
import request from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'

describe('Users routes', () => {
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

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const arrange = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      }

      const response = await request(app.server).post('/users').send(arrange)

      expect(response.status).toBe(201)
      expect(response.headers['set-cookie']).toBeDefined()
    })

    it('should not create a new user with an existing email', async () => {
      const arrange = {
        name: 'John Doe',
        email: 'john.doe@example.com',
      }

      await request(app.server).post('/users').send(arrange)

      const result = await request(app.server).post('/users').send(arrange)

      expect(result.status).toBe(400)
      expect(result.body).toMatchObject({
        message: 'Email already exists',
      })
    })

    it('should NOT create a new user without providing a name', async () => {
      const arrange = {
        name: undefined,
        email: 'john.doe@example.com',
      }

      const response = await request(app.server).post('/users').send(arrange)

      expect(response.status).toBe(400)

      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Required',
            path: 'name',
          },
        ],
      })
    })

    it('should NOT create a new user without providing an email', async () => {
      const arrange = {
        name: 'John Doe',
        email: undefined,
      }

      const response = await request(app.server).post('/users').send(arrange)

      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Required',
            path: 'email',
          },
        ],
      })
    })

    it('should NOT create a new user with an invalid email', async () => {
      const arrange = {
        name: 'John Doe',
        email: 'invalid-email',
      }

      const response = await request(app.server).post('/users').send(arrange)

      expect(response.status).toBe(400)
      expect(response.body).toMatchObject({
        errors: [
          {
            message: 'Invalid email',
            path: 'email',
          },
        ],
      })
    })
  })
})
