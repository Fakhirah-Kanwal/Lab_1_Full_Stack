// app.js
const express = require('express');
const path = require('path');
const connectDB = require('./db');               // <-- use your working DB connector
const recipesRouter = require('./routes/recipesRoutes'); // <-- mount the router

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve the static frontend
app.use(express.static(path.join(__dirname, 'public')));

// mount the API (all routes defined in the router are under /api/dishes)
app.use('/api/dishes', recipesRouter);

// health check (optional)
app.get('/health', (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();                           // <-- connect once on boot
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
