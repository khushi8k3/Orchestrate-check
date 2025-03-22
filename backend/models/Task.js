// 📁 /backend/models/Task.js

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    eventName: String,
    title: String,
    description: String,
    assignee: {
        name: String,
        email: String,
        team: String
    },
    assigner: {
        name: String,
        email: String,
        team: String
    },
    status: String,
    progress: String
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
