import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTaskById } from '../services/taskService';
import '../../../styles/TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const loadTask = async () => {
      try {
        const taskData = await fetchTaskById(id);
        setTask(taskData);
        setComments(taskData.comments || []);
      } catch (err) {
        setError('Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id]);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const updatedComments = [...comments, { text: newComment, date: new Date().toISOString() }];
      setComments(updatedComments);
      setNewComment('');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="task-details">
      <h1>{task.title}</h1>
      <p><strong>Event:</strong> {task.eventName}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Progress:</strong> {task.progress}</p>

      <div className="comments-section">
        <h3>Comments</h3>
        <div className="comments">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p>{comment.text}</p>
              <small>{new Date(comment.date).toLocaleString()}</small>
            </div>
          ))}
        </div>

        <div className="add-comment">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleCommentSubmit}>Add Comment</button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
