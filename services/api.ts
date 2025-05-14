import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Replace with your actual API URL
const API_URL = 'https://api.linkupapp.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints for user management
export const userApi = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  },
  
  // Update user profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/users/me', userData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },
  
  // Update user visibility
  updateVisibility: async (isVisible) => {
    try {
      const response = await api.patch('/users/me/visibility', { isVisible });
      return response.data;
    } catch (error) {
      console.error('Failed to update visibility:', error);
      throw error;
    }
  },
  
  // Get user's matches
  getMatches: async () => {
    try {
      const response = await api.get('/users/me/matches');
      return response.data;
    } catch (error) {
      console.error('Failed to get matches:', error);
      throw error;
    }
  },
};

// API endpoints for matching
export const matchingApi = {
  // Get potential matches
  getPotentialMatches: async (filters = {}) => {
    try {
      const response = await api.get('/matching/potential', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Failed to get potential matches:', error);
      throw error;
    }
  },
  
  // Like/accept a potential match
  acceptMatch: async (userId) => {
    try {
      const response = await api.post('/matching/accept', { userId });
      return response.data;
    } catch (error) {
      console.error('Failed to accept match:', error);
      throw error;
    }
  },
  
  // Dislike/reject a potential match
  rejectMatch: async (userId) => {
    try {
      const response = await api.post('/matching/reject', { userId });
      return response.data;
    } catch (error) {
      console.error('Failed to reject match:', error);
      throw error;
    }
  },
  
  // Update matching preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/matching/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  },
};

// API endpoints for messaging
export const messageApi = {
  // Get conversation list
  getConversations: async () => {
    try {
      const response = await api.get('/messages/conversations');
      return response.data;
    } catch (error) {
      console.error('Failed to get conversations:', error);
      throw error;
    }
  },
  
  // Get messages for a specific conversation
  getMessages: async (conversationId) => {
    try {
      const response = await api.get(`/messages/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get messages:', error);
      throw error;
    }
  },
  
  // Send a message
  sendMessage: async (conversationId, text) => {
    try {
      const response = await api.post(`/messages/conversations/${conversationId}`, { text });
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },
};

// API endpoints for video calls
export const videoCallApi = {
  // Get scheduled calls
  getScheduledCalls: async () => {
    try {
      const response = await api.get('/video-calls/scheduled');
      return response.data;
    } catch (error) {
      console.error('Failed to get scheduled calls:', error);
      throw error;
    }
  },
  
  // Schedule a call
  scheduleCall: async (userId, scheduledTime) => {
    try {
      const response = await api.post('/video-calls/schedule', { userId, scheduledTime });
      return response.data;
    } catch (error) {
      console.error('Failed to schedule call:', error);
      throw error;
    }
  },
  
  // Join a call
  joinCall: async (callId) => {
    try {
      const response = await api.post(`/video-calls/${callId}/join`);
      return response.data;
    } catch (error) {
      console.error('Failed to join call:', error);
      throw error;
    }
  },
  
  // End a call
  endCall: async (callId) => {
    try {
      const response = await api.post(`/video-calls/${callId}/end`);
      return response.data;
    } catch (error) {
      console.error('Failed to end call:', error);
      throw error;
    }
  },
  
  // Submit call feedback
  submitFeedback: async (callId, feedback) => {
    try {
      const response = await api.post(`/video-calls/${callId}/feedback`, feedback);
      return response.data;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw error;
    }
  },
};

// Export all API services
export default {
  userApi,
  matchingApi,
  messageApi,
  videoCallApi,
};