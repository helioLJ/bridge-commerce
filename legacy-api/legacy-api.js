const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/orders', (req, res) => {
  res.json([
    { id: 1, status: "Delivered", total: 100 },
    { id: 2, status: "Pending", total: 50 },
    { id: 3, status: "Processing", total: 75 }
  ]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Legacy API running on port ${PORT}`);
});