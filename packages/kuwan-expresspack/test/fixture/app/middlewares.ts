import { defineMiddlewares } from '@markterence/kuwan-expresspack';
import {
  jsonBodyParser,
  urlencodedBodyParser,
} from '@markterence/kuwan-expresspack/core/body-parser'
 

export default defineMiddlewares(({ app, router }) => {
    // This is where server middlewares can be placed.
    // Just like how you would do in a base Express server.
    app.use(jsonBodyParser())
    app.use(urlencodedBodyParser())

    // routes can be also defined here, 
    // but this will be loaded last after all other middlewares and controller routes.
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
