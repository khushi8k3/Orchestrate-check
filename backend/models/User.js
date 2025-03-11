// backend/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {   // In production, remember to hash passwords.
    type: String,
    required: true
  },
  notifications: [
    {
      message: String,
      date: { type: Date, default: Date.now },
      read: { type: Boolean, default: false }
    }
  ],
  userId: {
    type: String
  }
});

// Pre-save middleware to derive userId from the email address.
userSchema.pre('save', function (next) {
  if (!this.userId && this.email) {
    // Extract the portion before the '@' symbol.
    const emailParts = this.email.split('@');
    this.userId = emailParts[0];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);

