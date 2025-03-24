const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Employee");

const router = express.Router();

// User Registration
router.post("/register", async (req, res) => {
  try {
      const { name, email, password, team = "General", role = "employee" } = req.body;

      // Check if user exists
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Save user
      user = new User({ name, email, password: hashedPassword, team, role });
      await user.save();

      res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
      const { email, password } = req.body;

      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });}

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role , team: user.team} });
  } catch (err) {
      res.status(500).json({ error: "Server error: " + err.message });
  }
});

module.exports = router;
