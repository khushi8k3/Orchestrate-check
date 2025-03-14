const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventType: { type: String, enum: ['firm-wide', 'limited-entry', 'team-specific'], required: true },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    availableSlots: { type: Number, default: null },
    attendees: { type: [String], default: [] },
    team: { type: String, default: "" },
    isPaid: { type: Boolean, required: true }
});

module.exports = mongoose.model("Event", eventSchema);

