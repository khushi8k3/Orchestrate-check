const express = require("express");
const connectDB = require("./config/db"); 
const eventRoutes = require("./routes/eventRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", eventRoutes);

connectDB();  // Connect to MongoDB

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
