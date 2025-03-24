require("dotenv").config();
const express = require("express");
const { getTasks, updateTaskStatus } = require("../controllers/taskController");

const router = express.Router();

// Route to fetch tasks
router.get("/", getTasks);

// Route to update task status
router.put("/status", updateTaskStatus);

// Get tasks assigned to the logged-in user
router.get("/assigned", taskController.getTasksByAssignee);

// Get details of a specific assigned task by ID
router.get("/assigned/:id", taskController.getTaskById);

module.exports = router;
