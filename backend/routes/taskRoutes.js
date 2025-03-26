require("dotenv").config();
const express = require("express");
const { updateTaskStatus, getTasksByAssignee, getTaskById, addCommentToTask_Assignee } = require("../controllers/taskController");
const authenticateUser = require("../middleware/authenticateUser");

const router = express.Router();

// Route to update task status (Use PATCH instead of PUT)
router.patch("/status", authenticateUser, updateTaskStatus);

// Get tasks assigned to the logged-in user
router.get("/assigned", authenticateUser, getTasksByAssignee);

// Get details of a specific assigned task by ID
router.get("/assigned/:id", authenticateUser,  getTaskById);

// Add a comment to an assigned task (Cleaner endpoint)
router.post("/assigned/:id/comments",authenticateUser, addCommentToTask_Assignee);

module.exports = router;
