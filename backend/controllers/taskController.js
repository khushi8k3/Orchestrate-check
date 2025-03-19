const Event = require("../models/Event");
const Employee = require("../models/Employee");

exports.getTasks = async (req, res) => {
  try {
    const userEmail = req.headers["user-email"];
    const employee = await Employee.findOne({ email: userEmail });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Sort tasks by deadline or creation time (ascending)
    const sortedTasks = employee.tasks.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline) : new Date(a._id.getTimestamp());
      const dateB = b.deadline ? new Date(b.deadline) : new Date(b._id.getTimestamp());
      return dateA - dateB;
    });

    res.json(sortedTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ message: "Error fetching tasks: " + error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { eventName, taskName, assignedToEmail, status } = req.body;

    // Update task status in the event document
    await Event.findOneAndUpdate(
      { eventName, "tasks.taskName": taskName },
      { $set: { "tasks.$.status": status } }
    );

    if (status === "Completed") {
      // Remove task from the employee's tasks array
      await Employee.findOneAndUpdate(
        { email: assignedToEmail },
        { $pull: { tasks: { taskName, eventName } } }
      );
    }

    res.status(200).json({ message: "Task status updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
