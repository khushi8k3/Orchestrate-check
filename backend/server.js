// 📁 /backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./utils/db');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect MongoDB only if USE_MONGO is true
if (process.env.USE_MONGO === 'true') {
    connectDB();
}

// Routes
app.use('/api/tasks', adminRoutes);

app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

