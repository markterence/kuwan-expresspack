import { getTestValue } from './fixture/modular-app/app/services/test_config_service';

import { createApp } from '@markterence/kuwan-expresspack'
import { afterAll, beforeAll, expect, test } from 'vitest'

let app: Awaited<ReturnType<typeof createApp>>

beforeAll(async () => {
  // problematic, but it seems that config loading works.
  // process.chdir('./test/fixture/modular-app');
  app = await createApp()
})

// afterAll(async () => {
//   await (app as any)?.down();
// })

test('loads value from test config', () => {
  const value = getTestValue()
  expect(value).toBe('hello-world')
})
