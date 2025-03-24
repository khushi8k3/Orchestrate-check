const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {type: String,required: true,},
  description: {type: String,required: true,},
  eventName: {type: String,required: true,},
  status: {type: String,enum: ['Pending', 'In Progress', 'Completed'],default: 'Pending',},
  budget: {type: Number,default: null,},
  creator: {type: String,required: true,},// Storing email directly as a string
  assignee: {type: String, required: true,},// Storing email directly as a string
  deadline: {type: Date,default: null,},
  comments: [
    {
      author: {
        type: String, // Storing email of the comment author
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
],
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);