// 📁 /backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const mockTasks = require('../data/mockTasks');

// ✅ Get all tasks
router.get('/', (req, res) => {
    res.status(200).json(mockTasks);
});

// ✅ Filter tasks by status or assignee
router.get('/filter', (req, res) => {
    const { status, assignee } = req.query;

    let filteredTasks = mockTasks;

    if (status) {
        filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    if (assignee) {
        filteredTasks = filteredTasks.filter(task => task.assignee.name === assignee);
    }

    res.status(200).json(filteredTasks);
});

// ✅ Get task details by ID
router.get('/:id', (req, res) => {
    const task = mockTasks.find(t => t._id === req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
});

// ✅ Add a comment to a task
router.post('/:id/comments', (req, res) => {
    const task = mockTasks.find(t => t._id === req.params.id);

    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }

    const { author, message } = req.body;

    if (!author || !message) {
        return res.status(400).json({ message: "Author and message are required" });
    }

    if (!task.comments) {
        task.comments = [];
    }

    const newComment = {
        author,
        message,
        timestamp: new Date().toISOString()
    };

    task.comments.push(newComment);
    res.status(201).json({ message: "Comment added successfully", task });
});

module.exports = router;
