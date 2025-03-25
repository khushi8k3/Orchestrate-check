import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../styles/TaskDetails_Assignee.css';

const TaskDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { task } = location.state || {};
  const [assigneeDetails, setAssigneeDetails] = useState(null);
  const [comments, setComments] = useState(task.comments || []);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!task?.assignee) return;
  
    const fetchAssigneeDetails = async () => {
      try {
        console.log("Fetching assignee details for:", task.assignee);
        const response = await axios.get(`http://localhost:5000/api/employees/${task.assignee}`);
        setAssigneeDetails(response.data);
      } catch (error) {
        console.error("Error fetching assignee details:", error);
      }
    };
  
    fetchAssigneeDetails();
  }, [task?.assignee]);
  
  // Handle Add Comment with Improved State Update
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      console.warn('Comment is empty. Please add a message before submitting.');
      return;
    }
  
    try {
      const userEmail = localStorage.getItem('userEmail');
  
      if (!userEmail) {
        console.error('User email not found in localStorage');
        return;
      }
  
      const response = await axios.post(
        `http://localhost:5000/api/tasks/assigned/${task?._id}/comments`,
        { message: newComment },
        {
          headers: {
            "user-email": userEmail,
          },
        }
      );
  
      console.log('Comment added successfully:', response.data);
  
      if (response.data.task?.comments?.length) {
        const latestComment = response.data.task.comments.slice(-1)[0];
        setComments((prevComments) => [...prevComments, latestComment]);
        setNewComment('');
      } else {
        console.warn('No comments found in response.');
      }
    } catch (error) {
      console.error('Error adding comment:', error?.response?.data?.message || error.message);
    }
  };
    

  return (
    <div className="task-details">
      <h1>{task.taskName}</h1>
      <p><strong>Event:</strong> {task.eventName}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p>
        <strong>Assigned To:</strong> {assigneeDetails ? `${assigneeDetails.name} (${assigneeDetails.email})` : task.assignee}
      </p>
      <p><strong>Assigned By:</strong> {task.creator}</p>
      <p><strong>Status:</strong> {task.status}</p>

      <div className="comments-section">
        <h3>Comments</h3>
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.message}</p>
            <small>By {comment.author} at {new Date(comment.timestamp).toLocaleString()}</small>
          </div>
        ))}

        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Add Comment</button>
      </div>

      <button onClick={() => navigate('/pending-tasks')}>Back to Dashboard</button>
    </div>
  );
};

export default TaskDetails;