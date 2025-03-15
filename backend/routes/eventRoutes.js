const express = require("express");
const { createEvent } = require("../controllers/eventController");

const router = express.Router();

// POST /api/events/
router.post("/", createEvent);

module.exports = router;
