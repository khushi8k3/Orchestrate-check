const express = require("express");
const { getAllEmployees } = require("../controllers/employeeController");

const router = express.Router();

// GET /api/employees/
router.get("/", getAllEmployees);

module.exports = router;
