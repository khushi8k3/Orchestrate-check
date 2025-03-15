const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDateTime: { type: Date, required: true },
    budget: { type: Number, required: true },
    eventType: { 
        type: String, 
        enum: ['Firm Wide', 'Team Specific', 'Limited Entry'],
        required: true 
    },
    ticketPrice: { type: Number, required: function() { return this.eventType === 'Limited Entry'; } },
    maxPeopleAllowed: { type: Number, required: function() { return this.eventType === 'Limited Entry'; } },
    rsvpPeople: [{ type: String }], // Employee emails
    tasks: [{
        taskName: String,
        deadline: Date,
        taskBudget: Number,
        assignedTo: String // Employee email
    }]
});

module.exports = mongoose.model('Event', EventSchema);