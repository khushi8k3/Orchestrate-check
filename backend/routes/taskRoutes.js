const express = require("express");
const { getTasks, updateTaskStatus } = require("../controllers/taskController");

const router = express.Router();

//Route to fetch tasks
router.get("/", getTasks);

// PUT /api/tasks/status (Update Task Status)
router.put("/status", updateTaskStatus);

module.exports = router;