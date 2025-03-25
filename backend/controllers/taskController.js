const Task = require("../models/Task");
const Employee = require("../models/Employee");
const mongoose = require("mongoose");

// Get tasks assigned to the logged-in user
exports.getTasksByAssignee = async (req, res) => {
  try {
    const userEmail = req.headers["user-email"];

    if (!userEmail) {
      console.error("Missing user-email in headers.");
      return res.status(400).json({ message: "User email is required in headers" });
    }

    console.log("User Email Received:", userEmail);

    // Fetch tasks where the assignee matches the logged-in user
    const tasks = await Task.find({ assignee: userEmail }).sort({
      deadline: 1,
      createdAt: 1,
    });

    if (tasks.length === 0) {
      console.warn("No tasks found for:", userEmail);
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    console.log(`Successfully fetched ${tasks.length} tasks for: ${userEmail}`);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.stack);
    res.status(500).json({ message: "Error fetching tasks: " + error.message });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
      console.warn("Task ID or status missing in request body");
      return res.status(400).json({ message: "Task ID and status are required" });
    }

    // Validate status values
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      console.warn("Invalid status value received:", status);
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Update the task status by ID
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: { status } },
      { new: true }
    );

    if (!updatedTask) {
      console.warn("Task not found for ID:", taskId);
      return res.status(404).json({ message: "Task not found" });
    }

    console.log(`Task status updated to '${status}' for Task ID: ${taskId}`);
    res.status(200).json({ message: "Task status updated", task: updatedTask });
  } catch (error) {
    console.error("Error updating task status:", error.message);
    res.status(500).json({ message: "Error updating task status: " + error.message });
  }
};

// Get task details by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn("Invalid Task ID:", id);
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    const task = await Task.findById(id);

    if (!task) {
      console.warn("Task not found for ID:", id);
      return res.status(404).json({ message: "Task not found" });
    }

    console.log(`Task details fetched for Task ID: ${id}`);
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task details:", error.message);
    res.status(500).json({ message: "Error fetching task details: " + error.message });
  }
};

// Add a comment to a task
exports.addCommentToTask_Assignee = async (req, res) => {
  try {
    const userEmail = req.headers["user-email"]; // Logged-in user
    const { message } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.warn("Invalid Task ID:", id);
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    if (!userEmail || !message) {
      console.warn("Missing user-email or message");
      return res.status(400).json({ message: "User email and message are required" });
    }

    const task = await Task.findById(id);

    if (!task) {
      console.warn("Task not found for ID:", id);
      return res.status(404).json({ message: "Task not found" });
    }

    // Append comment
    const newComment = {
      author: userEmail,
      message,
      timestamp: new Date().toISOString(),
    };

    task.comments.push(newComment);
    await task.save();

    console.log(`Comment added by ${userEmail} on Task ID: ${id}`);
    res.status(201).json({ message: "Comment added successfully", task });
  } catch (error) {
    console.error("Error adding comment:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
