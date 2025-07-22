import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './ManagerDashboard.css';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    platform: 'facebook',
    content: '',
    scheduledTime: '',
    media: null
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      media: file
    }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formPayload = new FormData();
      formPayload.append('platform', formData.platform);
      formPayload.append('content', formData.content);
      formPayload.append('scheduledTime', formData.scheduledTime);
      if (formData.media) {
        formPayload.append('media', formData.media);
      }

      await api.post('/posts', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Post created successfully! It will be reviewed by the CEO.');
      setFormData({
        platform: 'facebook',
        content: '',
        scheduledTime: '',
        media: null
      });
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const getCharacterLimit = () => {
    switch (formData.platform) {
      case 'twitter':
        return 280;
      case 'facebook':
        return 63206;
      case 'linkedin':
        return 3000;
      case 'instagram':
        return 2200;
      case 'youtube':
        return 5000;
      default:
        return 5000;
    }
  };

  const characterCount = formData.content.length;
  const characterLimit = getCharacterLimit();
  const isOverLimit = characterCount > characterLimit;

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="platform">Platform</label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
          >
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            required
            className={isOverLimit ? 'error' : ''}
          />
          <div className={`character-count ${isOverLimit ? 'error' : ''}`}>
            {characterCount}/{characterLimit}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="scheduledTime">Schedule Date & Time</label>
          <input
            type="datetime-local"
            id="scheduledTime"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="media">Media (Image or Video)</label>
          <input
            type="file"
            id="media"
            name="media"
            onChange={handleFileChange}
            accept="image/*, video/*"
          />
          {preview && (
            <div className="media-preview">
              {formData.media.type.startsWith('image') ? (
                <img src={preview} alt="Preview" />
              ) : (
                <video controls src={preview} />
              )}
              <button 
                type="button" 
                className="remove-media"
                onClick={() => {
                  setPreview(null);
                  setFormData(prev => ({ ...prev, media: null }));
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>
        
        <button type="submit" disabled={loading || isOverLimit}>
          {loading ? 'Submitting...' : 'Submit for Approval'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;