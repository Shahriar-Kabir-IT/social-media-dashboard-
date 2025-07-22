import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ManagerDashboard.css';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
   useAuth();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const endpoint = filter === 'all' ? '/posts/manager' : `/posts/manager?status=${filter}`;
        const response = await api.get(endpoint);
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [filter]);

  const handleEdit = (postId) => {
    // Navigate to edit page or open modal
    console.log('Edit post', postId);
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-list">
      <h2>My Posts</h2>
      
      <div className="filter-controls">
        <label>Filter by status:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Posts</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="published">Published</option>
        </select>
      </div>
      
      {posts.length === 0 ? (
        <p>No posts found</p>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <span className="platform">{post.platform}</span>
                <span className={`status ${post.status}`}>{post.status}</span>
                <span className="schedule">
                  {post.status === 'published' 
                    ? `Published: ${new Date(post.publishedAt).toLocaleString()}`
                    : `Scheduled: ${new Date(post.scheduledTime).toLocaleString()}`
                  }
                </span>
              </div>
              
              <div className="post-content">
                {post.content}
              </div>
              
              {post.media && (
                <div className="post-media">
                  {post.media.type.startsWith('image') ? (
                    <img src={post.media.url} alt="Post media" />
                  ) : (
                    <video controls>
                      <source src={post.media.url} type={post.media.type} />
                    </video>
                  )}
                </div>
              )}
              
              {post.status === 'rejected' && (
                <div className="post-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(post.id)}
                  >
                    Edit and Resubmit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;