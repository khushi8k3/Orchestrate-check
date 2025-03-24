require("dotenv").config();
const express = require("express");
const { getTasks, updateTaskStatus , getTasksByAssignee, getTaskById } = require("../controllers/taskController");

const router = express.Router();

// Route to fetch tasks
router.get("/", getTasks);

// Route to update task status
router.put("/status", updateTaskStatus);

// Get tasks assigned to the logged-in user
router.get("/assigned", getTasksByAssignee);

// Get details of a specific assigned task by ID
router.get("/assigned/:id", getTaskById);

module.exports = router;
