import { defineMiddlewares } from '@markterence/kuwan-expresspack';
import {
  jsonBodyParser,
  urlencodedBodyParser,
} from '@markterence/kuwan-expresspack/core/body-parser'
 

export default defineMiddlewares(({ app, router }) => {
    app.use(jsonBodyParser())
    app.use(urlencodedBodyParser())

    router.get('/middlewares', (req, res) => {
        res.json({
            message: 'Middlewares are defined and working!',
        });
    });

    router.post('/middlewares', (req, res) => {
        const data = req.body;
        res.json({
            message: 'Data received via middlewares',
            data,
        });
    })
})
