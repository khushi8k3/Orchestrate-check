// 📁 /backend/data/mockTasks.js

const mockTasks = [
    {
        _id: "67d5c09b851a00caa04d7943",
        eventName: "Annual Tech Summit",
        title: "Setup Event Streaming",
        description: "Ensure live streaming is ready",
        assignee: { name: "Anushka Sarkar", email: "anushka.sarkar@desisascendeducare.in" },
        assigner: { name: "Khyathi Gutta", email: "khyathi.gutta@desisascendeducare.in" },
        status: "in-progress",
        progress: "50%",
        comments: [
            { author: "Khyathi Gutta", message: "Please update me on the streaming progress.", timestamp: "2025-03-22T10:30:00Z" }
        ]
    },
    {
        _id: "67d5c09b851a00caa04d7944",
        eventName: "Marketing Campaign",
        title: "Design Poster",
        description: "Create promotional posters",
        assignee: { name: "Anushka Sarkar", email: "anushka.sarkar@desisascendeducare.in" },
        assigner: { name: "Rahul Mehta", email: "rahul.mehta@desisascendeducare.in" },
        status: "completed",
        progress: "100%",
        comments: [
            { author: "Rahul Mehta", message: "Great work on the poster!", timestamp: "2025-03-21T15:45:00Z" }
        ]
    }
];

module.exports = mockTasks;
