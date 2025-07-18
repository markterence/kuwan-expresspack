

import { defineConfig } from '@markterence/kuwan-expresspack/core/body-parser'

export default defineConfig({
  json: {
    limit: '30mb',
  },
  urlencoded: {
    extended: true,
  },
})
