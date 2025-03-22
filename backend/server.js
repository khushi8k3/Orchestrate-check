const express = require('express');  
const dotenv = require('dotenv');  
const cors = require('cors');  
const connectDB = require('./utils/db');  // MongoDB connection setup  
const taskRoutes = require('./routes/taskRoutes');  

// Load environment variables  
dotenv.config();  

const app = express();  
const PORT = process.env.PORT || 5000;  

// Middleware  
app.use(express.json());  
app.use(cors());  

// Connect to MongoDB (only if USE_MONGO is true)  
if (process.env.USE_MONGO === 'true') {  
    connectDB();  
}  

// ✅ Updated Route with '/api/tasks' to match the frontend
app.use('/api/tasks', taskRoutes);  

// Start Server  
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));

