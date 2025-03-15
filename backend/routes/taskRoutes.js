const express = require("express");
const { updateTaskStatus } = require("../controllers/taskController");

const router = express.Router();

// PUT /api/tasks/status
router.put("/status", updateTaskStatus);

module.exports = router;

