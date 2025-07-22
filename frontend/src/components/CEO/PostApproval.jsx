import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CeoDashboard.css';

const PostApproval = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useAuth();

  useEffect(() => {
    const fetchPendingPosts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/posts/pending');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch pending posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPosts();
  }, []);

  const handleApprove = async (postId) => {
    try {
      await api.put(`/posts/${postId}/approve`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to approve post');
      console.error(err);
    }
  };

  const handleReject = async (postId) => {
    try {
      await api.put(`/posts/${postId}/reject`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      setError('Failed to reject post');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">Loading pending posts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="post-approval">
      <h2>Pending Posts for Approval</h2>
      
      {posts.length === 0 ? (
        <p>No posts pending approval</p>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <span className="platform">{post.platform}</span>
                <span className="schedule">Scheduled: {new Date(post.scheduledTime).toLocaleString()}</span>
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
              
              <div className="post-actions">
                <button 
                  className="approve-btn"
                  onClick={() => handleApprove(post.id)}
                >
                  Approve
                </button>
                <button 
                  className="reject-btn"
                  onClick={() => handleReject(post.id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostApproval;