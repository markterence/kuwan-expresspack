

import { defineConfig } from '@markterence/kuwan-expresspack/middlewares/body-parser'

export default defineConfig({
  json: {
    limit: '30mb',
  },
  urlencoded: {
    extended: true,
  },
})
