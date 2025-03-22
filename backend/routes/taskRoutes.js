const express = require('express');
const router = express.Router();

// ✅ Correct import path
const mockTasks = require('../data/mockTasks');

// ✅ Route to get all tasks or filter by email
// Example: 
// - GET /api/tasks → Returns all tasks
// - GET /api/tasks?email=anushka.sarkar@desisascendeducare.in → Filters by email
router.get('/', (req, res) => {
    try {
        const { email } = req.query;

        // If no email query param, return all tasks
        if (!email) {
            return res.status(200).json(mockTasks);
        }

        // Filter by email
        const userTasks = mockTasks.filter(task => task.assignee.email === email);

        if (userTasks.length === 0) {
            return res.status(404).json({ message: 'No tasks found for this employee' });
        }

        res.status(200).json(userTasks);

    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// ✅ Route to get task details by ID
// Example: GET /api/tasks/67d5c09b851a00caa04d7943
router.get('/:id', (req, res) => {
    try {
        const { id } = req.params;

        const task = mockTasks.find(task => task._id === id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.status(200).json(task);

    } catch (error) {
        console.error('Error fetching task details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

