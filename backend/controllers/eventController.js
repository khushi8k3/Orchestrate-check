const Event = require("../models/Event");
const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");

exports.createEvent = async (req, res) => {
  try {
    const { eventName, eventType, date, venue, description, availableSlots, ticketPrice, team, tasks } = req.body;

    // For team-specific events, ensure a team is provided
    if (eventType.toLowerCase() === "team-specific" && !team) {
      return res.status(400).json({ error: "Team is required for team-specific events." });
    }

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "At least one task must be assigned to create an event." });
    }

    // Create the event with embedded tasks
    const event = new Event({
      eventName,
      eventType,
      date,
      venue,
      description,
      availableSlots,
      ticketPrice,
      team: eventType.toLowerCase() === "team-specific" ? team : "",
      isPaid: eventType.toLowerCase() === "limited",
      tasks
    });
    await event.save();

    // Process each task: update employee's tasks and send email notifications
    const emailPromises = tasks.map(async (task) => {
      const { assignedToEmail, taskName, description, deadline, budget } = task;
      const employee = await Employee.findOneAndUpdate(
        { email: assignedToEmail },
        {
          $push: {
            tasks: {
              taskName,
              description,
              deadline,
              budget,
              eventName,
              status: "Pending"
            }
          }
        },
        { new: true }
      );
      if (employee) {
        // Construct a formal email format
        const emailText = `Dear Team Member,

You have been assigned a new task as part of the event "${eventName}". Please review the task details below:

Task Name: ${taskName}
Description: ${description}
Deadline: ${deadline ? deadline : "Not specified"}
Budget: ${budget ? budget : "Not applicable"}

We kindly request that you review the task details and take the necessary actions to complete it by the stated deadline. Should you require further clarification, please do not hesitate to reach out to your supervisor.

Thank you for your prompt attention.

Best regards,
Orchestrate`;

        return sendEmail(assignedToEmail, `New Task Assigned for Event: ${eventName}`, emailText);
      }
    });

    await Promise.all(emailPromises);

    res.status(201).json({ message: "Event created and tasks assigned successfully", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
