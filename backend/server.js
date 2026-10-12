const express = require('express');
const routes = require('./routes');
const { seedAdmin } = require('./utils/security');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

seedAdmin();

app.use('/api', routes);
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found.' }));

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request.' });
  }
  console.error(err);
  res.status(500).json({ message: 'Server error.' });
});

app.listen(PORT, () => {
  console.log(`Student Management System API running at http://localhost:${PORT}`);
});