const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventType: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  description: { type: String, required: true },
  availableSlots: { type: Number, default: null },
  attendees: [{ type: String }],
  team: { type: String, default: "" },
  tasks: [
    {
      taskName: { type: String, required: true },
      assignedTo: { type: String, required: true },
      deadline: { type: Date, required: true },
      budget: { type: Number, default: null },
      status: { type: String, default: "Pending" }
    }
  ]
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
