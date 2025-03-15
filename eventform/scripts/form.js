document.getElementById("add-task-btn").addEventListener("click", function() {
    const taskContainer = document.getElementById("tasks-container");
    
    const taskDiv = document.createElement("div");
    taskDiv.innerHTML = `
        <label>Task:</label>
        <input type="text" class="extra-task" required>
        
        <label>Deadline:</label>
        <input type="date" class="extra-deadline" required>

        <label>Task Budget:</label>
        <input type="number" class="extra-budget" required>

        <label>Assign To:</label>
        <input type="text" class="extra-assignee" required>

        <button type="button" class="remove-task">Remove</button>
        <hr>
    `;
    
    taskContainer.appendChild(taskDiv);

    taskDiv.querySelector(".remove-task").addEventListener("click", function() {
        taskDiv.remove();
    });
});

document.getElementById("event-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const eventData = {
        eventName: document.getElementById("event-name").value,
        eventDate: document.getElementById("event-date").value,
        eventBudget: document.getElementById("event-budget").value,
        rsvpPeople: Array.from(document.getElementById("rsvp-list").selectedOptions).map(option => option.value),
        mandatoryTask: {
            task: document.getElementById("mandatory-task").value,
            deadline: document.getElementById("task-deadline").value,
            budget: document.getElementById("task-budget").value,
            assignee: document.getElementById("task-assignee").value
        },
        additionalTasks: []
    };

    document.querySelectorAll(".extra-task").forEach((task, index) => {
        eventData.additionalTasks.push({
            task: task.value,
            deadline: document.querySelectorAll(".extra-deadline")[index].value,
            budget: document.querySelectorAll(".extra-budget")[index].value,
            assignee: document.querySelectorAll(".extra-assignee")[index].value
        });
    });

    console.log("Event Data:", eventData);
    alert("Event Created Successfully!");
});
document.getElementById("event-type").addEventListener("change", function() {
    const eventType = this.value;
    document.getElementById("ticket-price-section").classList.toggle("hidden", eventType !== "limited-entry");
});
