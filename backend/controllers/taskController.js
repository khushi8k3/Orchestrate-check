const Event = require("../models/Event");
const Employee = require("../models/Employee");

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
