const Task = require("../models/Task");
const Employee = require("../models/Employee");

exports.getTasks = async (req, res) => {
  try {
    const userEmail = req.headers["user-email"];
    const employee = await Employee.findOne({ email: userEmail });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch tasks where the creator is the current user
    const tasks = await Task.find({ creator: userEmail }).sort({
      deadline: 1,
      createdAt: 1,
    });

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Error fetching tasks: " + error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskName, status } = req.body;

    // Update the task status directly in the Task collection
    const updatedTask = await Task.findOneAndUpdate(
      { taskName },
      { $set: { status } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task status updated", task: updatedTask });
  } catch (error) {
    console.error("Error updating task status:", error.message);
    res.status(500).json({ message: "Error updating task status: " + error.message });
  }
};

exports.getTasksByAssignee = async (req, res) => {
  try {
    const userEmail = req.headers["user-email"];

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required in headers" });
    }

    // Fetch tasks where the assignee matches the logged-in user
    const tasks = await Task.find({ assignee: userEmail }).sort({
      deadline: 1,
      createdAt: 1,
    });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this employee" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Error fetching tasks: " + error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task details:", error.message);
    res.status(500).json({ message: "Error fetching task details: " + error.message });
  }
};