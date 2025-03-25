require("dotenv").config();
const express = require("express");
const { updateTaskStatus, getTasksByAssignee, getTaskById, addCommentToTask_Assignee } = require("../controllers/taskController");

const router = express.Router();

// Route to update task status (Use PATCH instead of PUT)
router.patch("/status", updateTaskStatus);

// Get tasks assigned to the logged-in user
router.get("/assigned", getTasksByAssignee);

// Get details of a specific assigned task by ID
router.get("/assigned/:id", getTaskById);

// Add a comment to an assigned task (Cleaner endpoint)
router.post("/assigned/:id/comments", addCommentToTask_Assignee);

module.exports = router;
