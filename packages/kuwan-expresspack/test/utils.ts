import request from 'supertest'
import { join } from 'path'
// import { createApp } from '../src/index'
import app from './fixture/app';

export function createTestApp() {
  // Use the fixture directory as the app root
  const fixtureRoot = join(__dirname, 'fixture')
  
  // Create the app using your createApp function with the fixture
  // const app = createApp()
  
  return {
    app,
    fixtureRoot,
    request: request(app)
  }
}

export function getFixturePath(relativePath: string = '') {
  return join(__dirname, 'fixture', relativePath)
}