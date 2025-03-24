const Task = require("../models/Task");

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Filter tasks by status or assignee
exports.filterTasks = async (req, res) => {
    const { status, assignee } = req.query;
    const query = {};

    if (status) {
        query.status = status;
    }

    if (assignee) {
        query.assignee = assignee;
    }

    try {
        const filteredTasks = await Task.find(query);
        res.status(200).json(filteredTasks);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Get task details by ID
exports.getTaskDetails = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Add a comment to a task
exports.addCommentToTask = async (req, res) => {
    const { author, message } = req.body;

    if (!author || !message) {
        return res.status(400).json({ message: "Author and message are required" });
    }

    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const newComment = {
            author,
            message,
            timestamp: new Date().toISOString(),
        };

        task.comments.push(newComment);
        await task.save();

        res.status(201).json({ message: "Comment added successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};