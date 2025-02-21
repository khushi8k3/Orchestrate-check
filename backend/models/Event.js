const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  type: { type: String, enum: ['Firm-Wide', 'Limited-Entry', 'Team-Specific'] },
  team: String,
  rsvpList: [String],
  availableSpots: Number
});

module.exports = mongoose.model('Event', eventSchema);
