import request from 'supertest'
import { join } from 'path'
// import { createApp } from '../src/index'
// import app from './fixture/app-1/app';

export async function createTestApp1() {
  // Use the fixture directory as the app root
  const fixtureRoot = join(__dirname, 'fixture')
  
  // Create the app using your createApp function with the fixture
  // const app = createApp()
  const app = (await import('./fixture/app-1/app')).default;
  return {
    app,
    fixtureRoot,
    request: request(app)
  }
}

export async function createModularApp() {
  // Use the fixture directory as the app root
  const fixtureRoot = join(__dirname, 'fixture')
  
  // Create the app using your createApp function with the fixture
  // const app = createApp()
  const app = (await import('./fixture/modular-app/app')).default;
  return {
    app,
    fixtureRoot,
    request: request(app)
  }
}

export function getFixturePath(relativePath: string = '') {
  return join(__dirname, 'fixture', relativePath)
}