const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["admin", "employee"], required: true },
    team: { type: String, required: true }
});

module.exports = mongoose.models.Employee || mongoose.model("Employee", EmployeeSchema);

