// backend/models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  tasks: [
    {
      title: String,
      // Instead of storing an ObjectId, store the email directly:
      assignedTo: String 
    }
  ]
});

module.exports = mongoose.model('Event', eventSchema);

