const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    team: { type: String, required: true, default: "General" },
    role: { type: String, required: true, default: "employee" },
    username: { type: String, unique: true, sparse: true } 
});
module.exports = mongoose.model("Employee", employeeSchema);

