import { createRouter } from '@markterence/kuwan-expresspack';

// defineRoute('GET /client', (req, res) => {
//   res.json({ message: 'Client data' });
// });

// defineRoute('POST /client', (req, res) => {
//   const clientData = req.body;
//   res.json({ message: 'Client created', data: clientData });
// });

// This example keeps base route
const { router, defineRoute } = createRouter();

defineRoute('GET /book', (req, res) => {
  res.json({ message: 'Book data' });
});

defineRoute('POST /book', (req, res) => {
  const clientData = req.body;
  res.json({ message: 'Book created', data: clientData });
});

export default router;