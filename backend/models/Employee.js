const mongoose = require("mongoose");

const employeeTaskSchema = new mongoose.Schema({
    taskName: { type: String, required: true },
    description: { type: String, default: null },
    deadline: { type: Date }, // Optional deadline
    budget: { type: Number, default: null }, // Optional task budget
    eventName: { type: String, required: true }, // Store event name for context
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" }
});

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    team: { type: String, default: "General" },
    role: { type: String, default: "employee" },
    username: { type: String, unique: true, sparse: true },
    tasks: [employeeTaskSchema] // Embedded tasks for the employee
});

module.exports = mongoose.model("Employee", employeeSchema);