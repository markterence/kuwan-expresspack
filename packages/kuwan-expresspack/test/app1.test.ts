import { describe, it, expect } from 'vitest'
import { createTestApp1 } from './utils'

describe('Kuwan Express Server', async () => {
  const { request } = await createTestApp1()

  it('should load and use body-parser config from fixture', async () => {
    const testData = { message: 'Hello World', number: 42 }

    const response = await request
      .post('/test')
      .send(testData)
      .expect(200)

    expect(response.body).toEqual({ received: testData })
  })

  it('should handle URL-encoded form data', async () => {
    const response = await request
      .post('/test')
      .send('name=John&age=30')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .expect(200)

    expect(response.status).toBe(200)
    expect(response.body).toBeDefined()
    expect(response.body).toHaveProperty('received')
    expect(response.body.received.name).toBe('John')
    expect(response.body.received.age).toBe('30')
  })

  it('should apply middlewares from fixture', async () => { 
    const response = await request
      .get('/')
      .expect(200)
 
    expect(response.status).toBe(200)
    expect(response.text).toBe('Hello, Kuwan Stacks!')
  })

  it('should handle 404 for non-existent routes', async () => {
    await request
      .get('/non-existent-route')
      .expect(404)
  })

  it('should load route from middlewares', async () => {
    const response = await request
      .get('/middlewares')
      .expect(200)

    expect(response.body).toEqual({
      message: 'Middlewares are defined and working!'
    })
  })

  it('should handle POST requests from middleware', async () => {
    const postData = { key: 'value' }

    const response = await request
      .post('/middlewares')
      .send(postData)
      .expect(200)

    expect(response.body).toEqual({
      message: 'Data received via middlewares',
      data: postData
    })
  })

  // ===================
  // User Controller Tests
  // =====================
  describe('Users Controller', () => {
    it('should not PROPFIND because no route defined', async () => {
      await request
        .propfind('/some-user')
        .expect(404)
    })
    
    it('should get user data from GET /some-user', async () => {
      const response = await request
        .get('/some-user')
        .expect(200)

      expect(response.body).toEqual({ message: 'User data' })
    })

    it('should get specific user by ID from GET /some-user/:id', async () => {
      const userId = '123'
      const response = await request
        .get(`/some-user/${userId}`)
        .expect(200)

      expect(response.body).toEqual({
        message: 'User found',
        user: {
          id: userId,
          name: `User ${userId}`,
          email: `user${userId}@example.com`
        }
      })
    })

    it('should create user with POST /some-user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        age: 30
      }

      const response = await request
        .post('/some-user')
        .send(userData)
        .expect(200)

      expect(response.body).toEqual({
        message: 'User created',
        data: userData
      })
    })

    it('should update user with PUT /some-user/:id', async () => {
      const userId = '456'
      const userData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 28
      }

      const response = await request
        .put(`/some-user/${userId}`)
        .send(userData)
        .expect(200)

      expect(response.body).toEqual({
        message: 'User updated',
        id: userId,
        data: userData
      })
    })

    it('should partially update user with PATCH /some-user/:id', async () => {
      const userId = '789'
      const updateData = {
        email: 'newemail@example.com'
      }

      const response = await request
        .patch(`/some-user/${userId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({
        message: 'User partially updated',
        id: userId,
        updates: updateData
      })
    })

    it('should delete user with DELETE /some-user/:id', async () => {
      const userId = '999'

      const response = await request
        .delete(`/some-user/${userId}`)
        .expect(200)

      expect(response.body).toEqual({
        message: 'User deleted',
        id: userId
      })
    })

    it('should handle empty POST data to /some-user', async () => {
      const response = await request
        .post('/some-user')
        .send({})
        .expect(200)

      expect(response.body).toEqual({
        message: 'User created',
        data: {}
      })
    })

    it('should handle POST /some-user with JSON content type', async () => {
      const userData = { username: 'testuser', role: 'admin' }

      const response = await request
        .post('/some-user')
        .set('Content-Type', 'application/json')
        .send(userData)
        .expect(200)

      expect(response.body.message).toBe('User created')
      expect(response.body.data).toEqual(userData)
    })

    it('should handle PUT with empty body', async () => {
      const userId = '111'

      const response = await request
        .put(`/some-user/${userId}`)
        .send({})
        .expect(200)

      expect(response.body).toEqual({
        message: 'User updated',
        id: userId,
        data: {}
      })
    })

    it('should handle PATCH with multiple fields', async () => {
      const userId = '222'
      const updateData = {
        name: 'Updated Name',
        age: 35,
        status: 'active'
      }

      const response = await request
        .patch(`/some-user/${userId}`)
        .send(updateData)
        .expect(200)

      expect(response.body).toEqual({
        message: 'User partially updated',
        id: userId,
        updates: updateData
      })
    })
  })
})