import axios from 'axios';

export const fetchTasks = async () => {
  try {
    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      console.error("User email not found in localStorage. Please log in.");
      alert("Session expired. Please log in again.");
      return [];
    }

    const response = await axios.get("http://localhost:5000/api/tasks/assigned", {
      headers: { "user-email": userEmail },
    });

    console.log("Fetched Assigned Tasks:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const addCommentToTask = async (taskId, message) => {
  try {
    const userEmail = localStorage.getItem("userEmail");
    const response = await axios.post(`http://localhost:5000/api/tasks/assigned/${taskId}/comments`, 
      { message }, 
      { headers: { "user-email": userEmail } }
    );
    console.log("Comment added successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    return null;
  }
};

export const updateTaskStatus = async (taskId, status) => {
  try {
    if (!taskId) {
      console.error("Error: Task ID is missing!");
      return null;
    }

    const response = await axios.patch( //  Use PATCH instead of PUT
      `http://localhost:5000/api/tasks/${taskId}/status`, 
      { status } // Only send status, taskId is already in the URL
    );

    console.log(`Task status updated to: ${status}`);
    return response.data;
  } catch (error) {
    console.error("Error updating task status:", error);
    return null;
  }
};
