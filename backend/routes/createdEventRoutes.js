require("dotenv").config(); // Load environment variables
const express = require("express");
const {
    getTasks,
    filterTasks,
    getTaskDetails,
    addCommentToTask
} = require("../controllers/createdEventController");
const authenticateUser = require("../middleware/authenticateUser");
const router = express.Router();

// Route to get all tasks
router.get("/",getTasks);

// Route to filter tasks by status or assignee
router.get("/filter", filterTasks);

// Route to get task details by ID
router.get("/:id",getTaskDetails);

// Route to add a comment to a task
router.post("/:id/comments", addCommentToTask);

module.exports = router;