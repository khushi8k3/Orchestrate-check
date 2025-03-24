const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Event = require('./models/Events');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection failed:', err));

const importData = async () => {
    try {
        // Read the events.json file
        const dataPath = path.join(__dirname, 'events.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const events = JSON.parse(rawData);

        // Transform and map the data properly
        const formattedEvents = events.map(event => ({
            eventName: event.eventName || "Untitled Event",
            eventType: event.eventType || "General",
            date: event.date?.$date ? new Date(event.date.$date) : new Date(),
            venue: event.venue || "TBD",   // Use "TBD" if venue is missing
            description: event.description || "No description provided",
            availableSlots: event.availableSlots || null,
            attendees: event.attendees || [],
            team: event.team || "",
            
            tasks: (event.tasks || []).map(task => ({
                taskName: task.taskName || "Untitled Task",
                assignedTo: task.assignedTo || task.assignedToEmail || "Unassigned",  // Map `assignedToEmail` if present
                deadline: task.deadline?.$date ? new Date(task.deadline.$date) : new Date(),
                budget: task.budget || 0,
                status: task.status || "Pending"
            }))
        }));

        // Clear the existing collection and insert the new data
        await Event.deleteMany();
        await Event.insertMany(formattedEvents);

        console.log('✅ Events imported successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Failed to import events:', error);
        process.exit(1);
    }
};

// Run the import function
importData();

