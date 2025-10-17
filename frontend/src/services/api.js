import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============= AUTH API =============
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  updateProfile: (profileData) => apiClient.put('/auth/profile', profileData),
  changePassword: (passwordData) => apiClient.put('/auth/password', passwordData),
  updateNotificationSettings: (settings) => apiClient.put('/auth/notifications', settings),
};

// ============= CURRICULUM API =============
export const curriculumAPI = {
  getStandards: () => apiClient.get('/curriculum/standards'),
  getSubjects: (standardId) => apiClient.get(`/curriculum/standards/${standardId}/subjects`),
  getChapters: (subjectId) => apiClient.get(`/curriculum/subjects/${subjectId}/chapters`),
  getChapterDetails: (chapterId) => apiClient.get(`/curriculum/chapters/${chapterId}`),
  getVideos: (chapterId) => apiClient.get(`/curriculum/chapters/${chapterId}/videos`),
  getTests: (chapterId) => apiClient.get(`/curriculum/chapters/${chapterId}/tests`),
  getPracticeProblems: (chapterId, params) => apiClient.get(`/curriculum/chapters/${chapterId}/practice`, { params }),
  getQuiz: (quizId) => apiClient.get(`/curriculum/quizzes/${quizId}`),
  submitQuiz: (quizId, answers) => apiClient.post(`/curriculum/quizzes/${quizId}/submit`, { answers }),
  updateProgress: (chapterId, data) => apiClient.post(`/curriculum/progress/${chapterId}`, data),
  getSubjectProgress: (subjectId) => apiClient.get(`/curriculum/subjects/${subjectId}/progress`),
};

// ============= TEST API =============
export const testAPI = {
  getTestDetails: (testId) => apiClient.get(`/curriculum/tests/${testId}`),
  submitTest: (testId, answers, timeTaken) =>
    apiClient.post(`/curriculum/tests/${testId}/submit`, { answers, timeTaken }),
  getTestResults: (testId) => apiClient.get(`/tests/${testId}/results`),
};

// ============= NOTES API =============
export const notesAPI = {
  generateNotes: (chapterId) => apiClient.post('/notes/generate', { chapterId }, { responseType: 'blob' }),
  downloadNotes: (noteId) => apiClient.get(`/notes/${noteId}/download`, { responseType: 'blob' }),
};

// ============= CHAT API =============
export const chatAPI = {
  getUsers: () => apiClient.get('/chat/users'),
  getMessages: (otherUserId) => apiClient.get(`/chat/messages/${otherUserId}`),
  sendMessage: (data) => apiClient.post('/chat/send', data),
  uploadImage: (formData) => apiClient.post('/chat/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  editMessage: (messageId, data) => apiClient.put(`/chat/message/${messageId}`, data),
  deleteMessage: (messageId) => apiClient.delete(`/chat/message/${messageId}`),
};

// ============= CHATBOT API =============
export const chatbotAPI = {
  sendMessage: (message) => apiClient.post('/chatbot/query', { query: message }),
};

// ============= PERFORMANCE API =============
export const performanceAPI = {
  getStats: () => apiClient.get('/performance/stats'),
  getTestHistory: () => apiClient.get('/performance/tests'),
  getProgress: () => apiClient.get('/performance/progress'),
  getLeaderboard: (standard) => apiClient.get(`/performance/leaderboard/${standard}`),
  getTeacherStats: () => apiClient.get('/performance/teacher-stats'),
  getTeacherOverview: () => apiClient.get('/performance/teacher-overview'),
  getAllStudents: (params) => apiClient.get('/performance/all', { params }),
};

// ============= COMMUNITY API =============
export const communityAPI = {
  getPosts: (page = 1, limit = 10) =>
    apiClient.get('/community', {
      params: {
        limit,
        offset: (page - 1) * limit,
      },
    }),
  createPost: (formData) => apiClient.post('/community', formData),
  addComment: (postId, content) =>
    apiClient.post(`/community/${postId}/reply`, { content }),
  likePost: (postId) => apiClient.post(`/community/${postId}/like`),
  deletePost: (postId) => apiClient.delete(`/community/${postId}`),
};

export default apiClient;
