const mongoose = require("mongoose");
const taskSchema = require("./Task");

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, enum: ["firm-wide", "limited-entry", "team-specific"], required: true },
    date: { type: Date }, // Optional event date
    venue: { type: String }, // Optional venue
    description: { type: String, required: true },
    availableSlots: { type: Number }, // Only required for limited-entry events, validated at application level
    ticketPrice: { type: Number }, // Only for limited-entry events, validated at application level
    attendees: { type: [String], default: [] },
    team: { type: String, default: "" },
    isPaid: { type: Boolean, default: false },
    tasks: [taskSchema] // Embedded tasks array
});

module.exports = mongoose.model("Event", eventSchema);