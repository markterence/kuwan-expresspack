import { defineMiddlewares } from '@markterence/kuwan-expresspack';
import {
  jsonBodyParser,
  urlencodedBodyParser,
} from '@markterence/kuwan-expresspack/core/body-parser'

import clientModuleMiddleware from './modules/client/middleware'
// import book from './modules/client/api/book_controller';
// import client from './modules/client/api/client_controller';
// This is the root middleware.
export default defineMiddlewares(({ app, router }) => {
    // This is where server middlewares can be placed.
    // Just like how you would do in a base Express server.
    app.use(jsonBodyParser())
    app.use(urlencodedBodyParser()) 

    // app.use('/', client);
    // app.use('/', book);
    clientModuleMiddleware({ app, router })

    app.use('/some-user', (req, res, next) => {
        const auth = req.get('Authorization');
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const token = auth.split(' ')[1];
        if (token !== 'valid-token') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        next();
    })
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
