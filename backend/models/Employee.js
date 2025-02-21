const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: String,
    email: String,
    team: String,
    role: String,
    username: { type: String, unique: false }
});

module.exports = mongoose.model('Employee', employeeSchema);
