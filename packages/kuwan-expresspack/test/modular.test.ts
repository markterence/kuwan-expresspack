import { describe, it, expect } from 'vitest'
import { createModularApp } from './utils'

describe('Kuwan Express Server', async () => {
  const { request } = await createModularApp()

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
  describe('Root App', () => {
    it('should respond to the GET on users_controller', async () => {
      const response = await request
        .get('/user-controller')
        .expect(200)

      expect(response.body).toEqual({ message: 'User data' })
    })
  })

  describe('Client Module', () => {
    it('should handle GET request to /client', async () => {
      const response = await request
        .get('/client')
        .expect(200)

      expect(response.body).toEqual({ message: 'Client data' })
    })

    it('should handle POST request to /client', async () => {
      const clientData = { name: 'Test Client', id: 1 }

      const response = await request
        .post('/client')
        .send(clientData)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Client created',
        data: clientData
      })
    })

    it('should handle GET request to /client/:id', async () => {
      const response = await request
        .get('/client/1')
        .expect(200)

      expect(response.body).toEqual({ message: 'Client data', id: '1' })
    })

    it('should handle GET request to /client/:id/loans', async () => {
      const response = await request
        .get('/client/1/loans')
        .expect(200)

      expect(response.body).toEqual({
        endpoint: '/client/1/loans',
        message: 'Client data',
        id: '1'
      })
    })

    it('should handle GET request to /client/:id/loans/:loanId', async () => {
      const response = await request
        .get('/client/1/loans/123')
        .expect(200)

      expect(response.body).toEqual({
        endpoint: '/client/1/loans/123',
        message: 'Client loan data',
        id: '1',
        loanId: '123'
      })
    })

    it('should handle GET request to /book', async () => {
      const response = await request
        .get('/book')
        .expect(200)

      expect(response.body).toEqual({ message: 'Book data' })
    })

    it('should handle POST request to /book', async () => {
      const clientData = { name: 'Test Book', id: 1 }

      const response = await request
        .post('/book')
        .send(clientData)
        .expect(200)

      expect(response.body).toEqual({
        message: 'Book created',
        data: clientData
      })
    })
  })
 
})