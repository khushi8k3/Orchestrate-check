require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/auth");

const app = express();

// ✅ CORS Configuration (Add Here)
const corsOptions = {
    origin: ["http://localhost:3000"], // Allow only frontend
    credentials: true
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(`✅ Connected to MongoDB: ${process.env.DB_NAME}`))
.catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
});

// ✅ Define Routes After Middleware
app.use("/api/auth", authRoutes);
app.use("/api", eventRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

