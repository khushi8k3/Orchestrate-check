require("dotenv").config();
const Event = require("../models/Event");
const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");

// Create an Event
exports.createEvent = async (req, res) => {
    try {
        const { eventName, eventType, date, venue, description, availableSlots, ticketPrice, team, tasks } = req.body;

        if (eventType.toLowerCase() === "team-specific" && !team) {
            return res.status(400).json({ error: "Team is required for team-specific events." });
        }

        if (!Array.isArray(tasks) || tasks.length === 0) {
            return res.status(400).json({ error: "At least one task must be assigned to create an event." });
        }

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

        // Send task assignment emails
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

// RSVP to an Event (Only after Payment)
exports.confirmRSVP = async (req, res) => {
    const { eventId, employeeName } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.eventType !== "limited-entry") {
            return res.status(400).json({ message: "RSVP not allowed for this event type" });
        }

        if (event.attendees.includes(employeeName)) {
            return res.status(400).json({ message: "You have already RSVP’d for this event." });
        }

        if (event.availableSlots !== null && event.availableSlots === 0) {
            return res.status(400).json({ message: "No slots available" });
        }

        // Mark RSVP successful after payment
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $push: { attendees: employeeName },
                $inc: { availableSlots: -1 },
            },
            { new: true }
        );

        res.status(200).json({ message: "RSVP successful", availableSlots: updatedEvent.availableSlots });
    } catch (error) {
        console.error("RSVP Error:", error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

// Get All Events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};


exports.getDetailedReport = async (req, res) => {
    try {
      const { eventName, year, team } = req.query;
      const query = {};
  
      // Dynamically apply filters
      if (eventName) {
        query.eventName = { $regex: new RegExp(`^${eventName}$`, "i") };
      }
      if (team) {
        query.team = { $regex: new RegExp(`^${team}$`, "i") };
      }
      if (year) {
        const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
        const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
        query.date = { $gte: startOfYear, $lte: endOfYear };
      }
  
      console.log("Generated Query:", query);
  
      // Fetch matching events
      const events = await Event.find(query);
  
      if (!events || events.length === 0) {
        return res.status(404).json({ message: "No events found with the specified criteria." });
      }
  
      // Generate reports for each matching event
      const reportData = events.map((event) => {
        // Task Stats
        const totalTasks = event.tasks?.length || 0;
        const completedTasks = event.tasks?.filter(task => task.status === "Completed").length || 0;
        const taskCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
  
        // Budget Analysis
        const totalBudget = event.tasks?.reduce((sum, task) => sum + (task.budget || 0), 0);
  
        // Attendance Stats (Only for Limited Entry Events)
        let totalRSVP = 0;
        let totalAttended = 0;
        let attendancePercentage = 0;
  
        if (event.eventType === "limited-entry" && event.attendees) {
          totalRSVP = event.attendees?.length || 0;
          totalAttended = event.attendees?.filter(email => email !== "").length || 0;
          attendancePercentage = totalRSVP ? ((totalAttended / totalRSVP) * 100).toFixed(2) : 0;
        }
  
        return {
          eventName: event.eventName,
          year: event.date?.getFullYear(),
          team: event.team,
          eventType: event.eventType,
          totalRSVP,
          totalAttended,
          attendancePercentage,
          totalTasks,
          completedTasks,
          taskCompletionRate,
          totalBudget,
        };
      });
  
      res.status(200).json(reportData);
    } catch (error) {
      console.error("Error generating detailed report:", error);
      res.status(500).json({ error: error.message });
    }
  };

exports.getCompiledReport = async (req, res) => {
  try {
    const { eventName, year, team, eventType } = req.query;
    const query = {};

    // Dynamically apply filters
    if (eventName) {
      query.eventName = { $regex: new RegExp(`^${eventName}$`, "i") };
    }
    if (team) {
      query.team = { $regex: new RegExp(`^${team}$`, "i") };
    }
    if (eventType) {
      query.eventType = { $regex: new RegExp(`^${eventType}$`, "i") };
    }
    if (year) {
      const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
      const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
      query.date = { $gte: startOfYear, $lte: endOfYear };
    }

    console.log("Generated Query:", query);

    // Fetch matching events
    const events = await Event.find(query);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found with the specified criteria." });
    }

    // Generate reports for each matching event
    const reportData = events.map((event) => {
      // Ensure the date is valid
      const eventYear = event.date instanceof Date
        ? event.date.getFullYear()
        : new Date(event.date)?.getFullYear() || "N/A";

      // Task Stats
      const totalTasks = event.tasks?.length || 0;
      const completedTasks = event.tasks?.filter(task => task.status === "Completed").length || 0;
      const taskCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;

      // Budget Analysis
      const totalBudget = event.tasks?.reduce((sum, task) => sum + (task.budget || 0), 0);

      // Attendance Stats (Only for Limited Entry Events)
      let totalRSVP = 0;
      let totalAttended = 0;
      let attendancePercentage = 0;

      if (event.eventType === "limited-entry" && event.attendees) {
        totalRSVP = event.attendees?.length || 0;
        totalAttended = event.attendees?.filter(email => email !== "").length || 0;
        attendancePercentage = totalRSVP ? ((totalAttended / totalRSVP) * 100).toFixed(2) : 0;
      }

      return {
        eventName: event.eventName,
        year: eventYear,
        team: event.team,
        eventType: event.eventType,
        totalRSVP,
        totalAttended,
        attendancePercentage,
        totalTasks,
        completedTasks,
        taskCompletionRate,
        totalBudget,
      };
    });
    console.log("Report Data:", reportData);
    res.status(200).json(reportData);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ error: error.message });
  }
};
