import { createApp } from '@markterence/kuwan-expresspack';

const app = await createApp();

app.get('/', (req, res) => {
  res.send('Hello, Kuwan Stacks!');
})

// Accept JSON
app.post('/test', (req, res) => {
  const jsonData = req.body;
  return res.json({ received: jsonData });
});

// accept URL-encoded data
app.post('/form', (req, res) => {
  const formData = req.body;
  res.json({ received: formData });
});

export default app;