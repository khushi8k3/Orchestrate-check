const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const seedEvents = async () => {
  await Event.deleteMany();

  const events = [
    {
      title: 'Annual Company Meet',
      description: 'Company-wide event to discuss achievements and future plans.',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      type: 'Firm-Wide',
      team: '',
      rsvpList: [],
      availableSpots: 100
    },
    {
      title: 'AI Workshop',
      description: 'Limited-entry event on AI innovations.',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      type: 'Limited-Entry',
      team: '',
      rsvpList: [],
      availableSpots: 20
    },
    {
      title: 'Team Outing - IT Team',
      description: 'Fun day out for the IT team.',
      date: new Date(new Date().setDate(new Date().getDate() + 7)),
      type: 'Team-Specific',
      team: 'IT',
      rsvpList: [],
      availableSpots: 30
    }
  ];

  await Event.insertMany(events);
  console.log('Events seeded!');
  mongoose.disconnect();
};

seedEvents();
