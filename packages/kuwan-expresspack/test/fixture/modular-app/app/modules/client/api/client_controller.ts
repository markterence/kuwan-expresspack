import { createRouter } from '@markterence/kuwan-expresspack';

// defineRoute('GET /client', (req, res) => {
//   res.json({ message: 'Client data' });
// });

// defineRoute('POST /client', (req, res) => {
//   const clientData = req.body;
//   res.json({ message: 'Client created', data: clientData });
// });

// This example keeps base route
const client = createRouter();

// const requireAuth = (req, res, next) => {
//       const auth = req.get('Authorization');
//       if (!auth || !auth.startsWith('Bearer ')) {
//           return res.status(401).json({ error: 'Unauthorized' });
//       }
//       const token = auth.split(' ')[1];
//       if (token !== 'valid-token') {
//           return res.status(403).json({ error: 'Forbidden' });
//       }
//       next();
//   };

// client.router.use('/client', requireAuth);

client.defineRoute('GET /client', (req, res) => {
  res.json({ message: 'Client data' });
});

client.defineRoute('GET /client/:id', (req, res) => {
  res.json({ message: 'Client data', id: req.params.id });
});

client.defineRoute('GET /client/:id/loans', (req, res) => {
  res.json({ 
    endpoint: `/client/${req.params.id}/loans`,
    message: 'Client data', 
    id: req.params.id 
  });
});

client.defineRoute('GET /client/:id/loans/:loanId', (req, res) => {
  res.json({
    endpoint: `/client/${req.params.id}/loans/${req.params.loanId}`,
    message: 'Client loan data',
    id: req.params.id,
    loanId: req.params.loanId
  });
});

client.defineRoute('POST /client', (req, res) => {
  const clientData = req.body;
  res.json({ message: 'Client created', data: clientData });
});

export default client.router;