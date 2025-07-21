import { createApp } from '@markterence/kuwan-expresspack';

// Ensure we are in the correct directory
process.chdir(__dirname);

const app = await createApp();

app.get('/basic', (req, res) => {
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