require("dotenv").config();
const express = require("express");
const { getTasks, updateTaskStatus } = require("../controllers/taskController");

const router = express.Router();

// Route to fetch tasks
router.get("/", getTasks);

// Route to update task status
router.put("/status", updateTaskStatus);

module.exports = router;