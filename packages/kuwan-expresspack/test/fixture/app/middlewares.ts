import { defineMiddlewares } from '@markterence/kuwan-expresspack';
import {
  jsonBodyParser,
  urlencodedBodyParser,
} from '@markterence/kuwan-expresspack/core/body-parser'
 

export default defineMiddlewares(({ app, router }) => {
    app.use(jsonBodyParser())
    app.use(urlencodedBodyParser())
})
