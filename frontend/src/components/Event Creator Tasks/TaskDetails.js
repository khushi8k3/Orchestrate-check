// components/TaskDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskById } from './taskService';
import axios from 'axios';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (!id) return;
  
    const loadTask = async () => {
      try {
        const taskData = await fetchTaskById(id);
        console.log("Task Data Received:", taskData);
        setTask(taskData);
        setComments(taskData?.comments || []);
      } catch (err) {
        console.error("Failed to load task:", err);
        setError("Failed to load task");
      } finally {
        setLoading(false);
      }
    };
    
    loadTask();

  }, [id]);
  
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      console.warn('Cannot submit empty comment');
      return;
    }
  
    if (!id) {
      console.error('Error: Task ID is missing.');
      return;
    }
  
    try {
      const author = JSON.parse(localStorage.getItem('user'))?.email;
      if (!author) {
        console.error('Error: Author name not found in localStorage');
        return;
      }
  
      const response = await axios.post(`http://localhost:5000/api/admin/${id}/comments`, {
        author,
        message: newComment,
      });
  
      console.log('Comment added successfully:', response.data);
  
      setComments([...comments, { author, message: newComment, timestamp: new Date().toISOString() }]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.response?.data?.message || error.message);
    }
  };
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  
  return (
    <div className="task-details">
      <h1>{task.taskName}</h1>
      <p><strong>Event:</strong> {task.eventName}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
  
      <h3>Comments</h3>
      <div className="comments">
        {comments.map((comment, index) => (
          <div key={index} className="comment">
            <p>{comment.message}</p>
            <small>{comment.author} - {new Date(comment.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <textarea
        id="commentInput"
        name="comment"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
      />
      <button onClick={handleCommentSubmit}>Add Comment</button>
    </div>
  );
  };
  
  export default TaskDetails;
  