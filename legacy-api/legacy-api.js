const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[Legacy] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/api/orders', (req, res) => {
  console.log('[Legacy] Processing orders request');
  const orders = [
    { id: 1, status: "Delivered", total: 100 },
    { id: 2, status: "Pending", total: 50 },
    { id: 3, status: "Processing", total: 75 }
  ];
  console.log('[Legacy] Sending orders response');
  res.json(orders);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[Legacy] API running on port ${PORT}`);
});