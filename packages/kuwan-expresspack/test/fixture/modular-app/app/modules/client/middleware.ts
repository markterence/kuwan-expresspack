import book from './api/book_controller';
import client from './api/client_controller';
import type { Express, Router } from 'express';

export default function ({ app, router }: { app: Express, router: Router }) {
    // app.use('/client', (req, res, next) => {
    //     const auth = req.get('Authorization');
    //     if (!auth || !auth.startsWith('Bearer ')) {
    //         return res.status(401).json({ error: 'Unauthorized' });
    //     }
    //     const token = auth.split(' ')[1];
    //     if (token !== 'valid-token') {
    //         return res.status(403).json({ error: 'Forbidden' });
    //     }
    //     next();
    // })  
    
    // Group but keep base route
    app.use('/', client);
    app.use('/', book);
}
