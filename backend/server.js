require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

//MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { dbName: "db2" }) 
    .then(() => console.log("MongoDB connected to db2"))
    .catch(err => console.log("MongoDB connection error:", err));


// User Schema
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

// Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    console.log("🔹 Received email:", email);
    console.log("🔹 Received password:", password);  // Log entered password

    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ User not found in db2");
        return res.status(400).json({ message: "User not found" });
    }

    console.log("✅ Stored hashed password:", user.password);

    // Make sure password is a string
    if (typeof password !== "string") {
        console.log("❌ Password is not a string!");
        return res.status(400).json({ message: "Invalid password format" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful" });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));