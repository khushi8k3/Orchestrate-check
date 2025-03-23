const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    description: { type: String, default: null },
    assignedToEmail: { type: String, required: true },
    deadline: { type: Date }, // Optional, validation done at the application level
    budget: { type: Number, default: null }, // Optional
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
});

module.exports = taskSchema;