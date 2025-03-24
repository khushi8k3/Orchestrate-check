require("dotenv").config(); // Load environment variables
const express = require("express");
const {
    getAllTasks,
    filterTasks,
    getTaskDetails,
    addCommentToTask
} = require("../controllers/createdEventController");
const router = express.Router();

// Route to get all tasks
router.get("/", getAllTasks);

// Route to filter tasks by status or assignee
router.get("/filter", filterTasks);

// Route to get task details by ID
router.get("/:id", getTaskDetails);

// Route to add a comment to a task
router.post("/:id/comments", addCommentToTask);

module.exports = router;