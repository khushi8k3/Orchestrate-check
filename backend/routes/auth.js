const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // ✅ Import User model

const router = express.Router();

// LOGIN API (Fetch User from MongoDB)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Received Login Request for Email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User Not Found:", email);
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Stored Hashed Password in DB:", user.password);
    console.log("Entered Password:", password);

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password Match:", isMatch);

    if (!isMatch) {
      console.log("Invalid Password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log("Login Successful for:", email);
    
    res.json({ token });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// GET ALL USERS (For Testing)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// SEED USERS IN DATABASE (Only Run Once)
router.get("/seed", async (req, res) => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.send("Users already exist. No seeding required.");
    }

    const plainPassword = "password123"; // ✅ Use the same password for all users
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.insertMany([
      { name: "Admin User", email: "admin@desis.com", password: hashedPassword, role: "admin" },
      { name: "Employee User", email: "employee@desis.com", password: hashedPassword, role: "employee" },
    ]);

    res.send("Users seeded in MongoDB!");
  } catch (error) {
    res.status(500).json({ message: "Error seeding users", error });
  }
});

module.exports = router;
