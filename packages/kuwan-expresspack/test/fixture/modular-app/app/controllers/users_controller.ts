import { defineRoute } from "@markterence/kuwan-expresspack";
 
defineRoute('GET /some-user', (req, res) => {
  res.json({ message: 'User data' });
});

defineRoute('GET /some-user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ 
    message: 'User found', 
    user: { 
      id: userId, 
      name: `User ${userId}`,
      email: `user${userId}@example.com`
    }
  });
});

defineRoute('POST /some-user', (req, res) => {
  const userData = req.body;
  res.json({ message: 'User created', data: userData });
});

defineRoute('PUT /some-user/:id', (req, res) => {
  const userId = req.params.id;
  const userData = req.body;
  res.json({ 
    message: 'User updated', 
    id: userId,
    data: userData 
  });
});

defineRoute('PATCH /some-user/:id', (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  res.json({ 
    message: 'User partially updated', 
    id: userId,
    updates: updateData 
  });
});

defineRoute('DELETE /some-user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({ 
    message: 'User deleted', 
    id: userId 
  });
});
