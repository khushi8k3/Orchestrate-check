require("dotenv").config();
const Event = require("../models/Event");
const Task = require("../models/Task");
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
            isPaid: eventType.toLowerCase() === "limited-entry"
        });

        await event.save();

        // Save tasks separately in the Task collection
        const taskPromises = tasks.map(async (task) => {
            const { taskName, description, deadline, budget, creator, assignee } = task;

            const newTask = new Task({
                taskName,
                description,
                eventName,
                deadline,
                budget,
                creater,
                assignee
            });

            await newTask.save();

            // Send email notification
            const employee = await Employee.findOne({ email: assignee });
            if (employee) {
                const emailText = `Dear ${employee.name},
You have been assigned a new task as part of the event "${eventName}". Please review the task details below:

Task Name: ${taskName}
Description: ${description}
Deadline: ${deadline ? deadline : "Not specified"}
Budget: ${budget ? budget : "Not applicable"}

We kindly request that you review the task details and take the necessary actions to complete it by the stated deadline. Should you require further clarification, please do not hesitate to reach out to your supervisor.

Best regards,
Orchestrate`;

                return sendEmail(assignee, `New Task Assigned: ${eventName}`, emailText);
            }
        });

        await Promise.all(taskPromises);

        res.status(201).json({ message: "Event created and tasks assigned successfully", event });
    } catch (error) {
        console.error("Error creating event:", error.message);
        res.status(500).json({ error: error.message });
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

// RSVP to an Event (Only for Unpaid Events)
exports.confirmRSVP = async (req, res) => {
    const { eventId, employeeName } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.eventType !== "limited-entry") {
            return res.status(400).json({ message: "RSVP not allowed for this event type" });
        }

        // Check if the event is unpaid (ticketPrice should be null or 0)
        if (event.ticketPrice !== null && event.ticketPrice > 0) {
            return res.status(400).json({ message: "RSVP is only allowed for unpaid events." });
        }

        if (event.attendees.includes(employeeName)) {
            return res.status(400).json({ message: "You have already RSVP’d for this event." });
        }

        if (event.availableSlots !== null && event.availableSlots === 0) {
            return res.status(400).json({ message: "No slots available" });
        }

        // Mark RSVP successful
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

// Un-RSVP from an Event (Only for Unpaid Events)
exports.unRSVP = async (req, res) => {
    const { eventId, employeeName } = req.body;

    try {
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.eventType !== "limited-entry") {
            return res.status(400).json({ message: "Un-RSVP not allowed for this event type" });
        }

        // Check if the event is unpaid (ticketPrice should be null or 0)
        if (event.ticketPrice !== null && event.ticketPrice > 0) {
            return res.status(400).json({ message: "Un-RSVP is only allowed for unpaid events." });
        }

        if (!event.attendees.includes(employeeName)) {
            return res.status(400).json({ message: "You have not RSVP'd for this event." });
        }

        // Remove the employee from the attendees list and increase available slots
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            {
                $pull: { attendees: employeeName },
                $inc: { availableSlots: 1 },
            },
            { new: true }
        );

        res.status(200).json({ message: "RSVP cancelled successfully", availableSlots: updatedEvent.availableSlots });
    } catch (error) {
        console.error("Un-RSVP Error:", error.message);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

exports.getDetailedReport = async (req, res) => {
    try {
        const { eventName, year, team } = req.query;
        const query = {};

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

        const events = await Event.find(query);
        if (!events.length) {
            return res.status(404).json({ message: "No events found with the specified criteria." });
        }

        const reportData = await Promise.all(events.map(async (event) => {
            const tasks = await Task.find({ eventID: event._id });

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.status === "Completed").length;
            const taskCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
            const totalBudget = tasks.reduce((sum, task) => sum + (task.budget || 0), 0);

            return {
                eventID: event._id,
                eventName: event.eventName,
                year: event.date?.getFullYear(),
                team: event.team,
                eventType: event.eventType,
                totalTasks,
                completedTasks,
                taskCompletionRate,
                totalBudget,
                tasks: tasks.map(task => ({
                    taskName: task.taskName,
                    description: task.description,
                    status: task.status,
                    budget: task.budget,
                    creator: task.creator,
                    assignee: task.assignee,
                    deadline: task.deadline,
                }))
            };
        }));

        res.status(200).json(reportData);
    } catch (error) {
        console.error("Error generating detailed report:", error.message);
        res.status(500).json({ error: error.message });
    }
};


// Get Compiled Event Report
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
        const reportData = await Promise.all(events.map(async (event) => {
            // Fetch related tasks from the Task collection
            const tasks = await Task.find({ eventName: event.eventName });

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.status === "Completed").length;
            const taskCompletionRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(2) : 0;
            const totalBudget = tasks.reduce((sum, task) => sum + (task.budget || 0), 0);

            return {
                eventName: event.eventName,
                year: event.date?.getFullYear(),
                team: event.team,
                eventType: event.eventType,
                totalTasks,
                completedTasks,
                taskCompletionRate,
                totalBudget,
            };
        }));

        res.status(200).json(reportData);
    } catch (error) {
        console.error("Error generating compiled report:", error.message);
        res.status(500).json({ error: error.message });
    }
};