const Event = require("../models/Event");
const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");

// Create an event
exports.createEvent = async (req, res) => {
  try {
    const { eventName, eventType, date, venue, description, availableSlots, ticketPrice, team, tasks } = req.body;

    // Validate team-specific events
    if (eventType.toLowerCase() === "team-specific" && !team) {
      return res.status(400).json({ error: "Team is required for team-specific events." });
    }

    // Validate task list
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "At least one task must be assigned to create an event." });
    }

    // Create the event
    const event = new Event({
      eventName,
      eventType,
      date,
      venue,
      description,
      availableSlots,
      ticketPrice,
      team: eventType.toLowerCase() === "team-specific" ? team : "",
      isPaid: eventType.toLowerCase() === "limited-entry",
      tasks
    });
    await event.save();

    // Notify employees and assign tasks
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
        const emailText = `Dear ${employee.name},
You have been assigned a new task as part of the event "${eventName}". Please review the task details below:

Task Name: ${taskName}
Description: ${description}
Deadline: ${deadline ? deadline : "Not specified"}
Budget: ${budget ? budget : "Not applicable"}

We kindly request that you review the task details and take the necessary actions to complete it by the stated deadline. Should you require further clarification, please do not hesitate to reach out to your supervisor.

Thank you for your prompt attention.

Best regards,
Orchestrate`;

        return sendEmail(assignedToEmail, `New Task Assigned: ${eventName}`, emailText);
      }
    });

    await Promise.all(emailPromises);

    res.status(201).json({ message: "Event created and tasks assigned successfully", event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all current events
exports.getEvents = async (req, res) => {
  try {
    const currentDate = new Date();

    // Extract the user's email from the request headers
    const userEmail = req.headers["user-email"];

    // Find the employee by email
    const employee = await Employee.findOne({ email: userEmail });
    if (!employee) throw new Error("Employee not found");

    const userTeam = employee.team;

    // Fetch public and team-specific events, sorted by date (closest first)
    const events = await Event.find({
      date: { $gte: currentDate },
      $or: [
        { eventType: "firm-wide" },
        { eventType: "limited-entry" },
        { eventType: "team-specific", team: userTeam },
      ],
    }).sort({ date: 1 });  // Sort in ascending order of date

    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error.message);
    res.status(500).json({ message: "Error fetching events: " + error.message });
  }
};


// RSVP to an event
exports.rsvpToEvent = async (req, res) => {
  const { employeeName } = req.body;
  const eventId = req.params.id;

  try {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: "Event not found" });

      // Allow RSVP only for limited-entry events
      if (event.eventType !== "limited-entry") {
          return res.status(400).json({ message: "RSVP not allowed for this event type" });
      }

      // Check if already RSVP'd
      if (event.attendees.includes(employeeName)) {
          return res.status(400).json({ message: "Already RSVP’d" });
      }

      // Check available spots
      if (event.availableSlots !== null && event.availableSlots === 0) {
          return res.status(400).json({ message: "No slots available" });
      }

      // Update attendees and available spots using findByIdAndUpdate
      const updatedEvent = await Event.findByIdAndUpdate(
          eventId,
          {
              $push: { attendees: employeeName },
              $inc: { availableSlots: -1 }, // Decrease available spots by 1
          },
          { new: true } // Return the updated document
      );

      res.status(200).json({ message: "RSVP successful", availableSlots: updatedEvent.availableSlots });
  } catch (error) {
      console.error("RSVP Error:", error.message);
      res.status(500).json({ message: "Server error: " + error.message });
  }
};