const express = require("express");
const router = express.Router();
const Employee = require("../models/employee");

// ✅ Fetch all employees (for RSVP & Task Assignment)
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find({}, "name email");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Error fetching employees", error });
    }
});

// ✅ Correct Export (Make Sure This is at the End)
module.exports = router;
