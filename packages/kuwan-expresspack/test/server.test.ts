import { describe, it, expect } from 'vitest'
import { createTestApp } from './utils'

describe('Kuwan Express Server', () => {
  const { request } = createTestApp()

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
})