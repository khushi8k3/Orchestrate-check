// backend/controllers/notificationController.js

const Event = require('../models/Event');
const User = require('../models/User');
const nodemailer = require('nodemailer');

require('dotenv').config(); // Ensure dotenv is configured first

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS  // Your email password from .env
  }
});

exports.createEvent = async (req, res) => {
  try {
    // Create new event using data from request body
    const newEvent = new Event(req.body);
    await newEvent.save();

    // For each task, look up the user by email, then add a website notification and send an email
    for (const task of newEvent.tasks) {
      // Find the user by email (assignedTo is now an email address)
      const user = await User.findOne({ email: task.assignedTo });
      if (user) {
        // Create website notification (push into notifications array)
        user.notifications.push({
          message: `You have been assigned to task "${task.title}" for event "${newEvent.title}".`
        });
        await user.save();

        // Prepare email options using your environment variable as the sender
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: `New Task Assigned: ${task.title}`,
          text: `Hello ${user.name},\n\nYou have been assigned to the task "${task.title}" for event "${newEvent.title}".\n\nPlease check your dashboard for more details.\n\nThank you!`
        };

        // Send email notification
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending email:', error);
          } else {
            console.log('Email sent:', info.response);
          }
        });
      } else {
        console.warn(`No user found with email: ${task.assignedTo}`);
      }
    }

    res.status(201).json({ message: 'Event created and notifications sent', event: newEvent });
  } catch (err) {
    console.error('Error in createEvent:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

