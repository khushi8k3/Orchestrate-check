const Event = require("../models/Event");
const Employee = require("../models/Employee");
const { sendEmail } = require("../services/emailService");

// ✅ Create an Event
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

        // ✅ Send task assignment emails
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
                const emailText = `Dear ${employee.name},\n
                You have been assigned a new task as part of the event "${eventName}".\n
                Task Name: ${taskName}\n
                Description: ${description}\n
                Deadline: ${deadline ? deadline : "Not specified"}\n
                Budget: ${budget ? budget : "Not applicable"}\n
                Please complete the task before the deadline.\n
                Best regards,\nOrchestrate`;

                return sendEmail(assignedToEmail, `New Task Assigned: ${eventName}`, emailText);
            }
        });

        await Promise.all(emailPromises);

        res.status(201).json({ message: "Event created and tasks assigned successfully", event });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ RSVP to an Event (Only after Payment)
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

        // ✅ Mark RSVP successful after payment
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

// ✅ Get All Events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find(); // Fetch all events
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

