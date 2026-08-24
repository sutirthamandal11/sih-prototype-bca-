const API_BASE_URL = '/api';

export const getAuthToken = () => localStorage.getItem('sih_auth_token');
export const setAuthToken = (token) => localStorage.setItem('sih_auth_token', token);
export const removeAuthToken = () => localStorage.removeItem('sih_auth_token');

export const getStoredUser = () => {
  const user = localStorage.getItem('sih_user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem('sih_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('sih_user');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || data.message || 'Request failed with status ' + response.status);
  }

  return data;
}

export const api = {
  // Auth
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      setAuthToken(data.access_token);
      setStoredUser(data.user);
    }
    return data;
  },
  getMe: () => request('/auth/me'),
  getDemoUsers: () => request('/auth/demo-users'),

  // Topics
  getTopics: () => request('/topics'),
  getTopicDetails: (id) => request(`/topics/${id}`),

  // Learner Progress
  getMyProgress: () => request('/progress/my'),
  enrollTopic: (topicId) => request(`/progress/enroll/${topicId}`, { method: 'POST' }),

  // Trainer
  getTrainerLearners: () => request('/trainer/learners'),
  getLearnerDrilldown: (learnerId) => request(`/trainer/learner/${learnerId}`),

  // Manager
  getManagerHierarchy: () => request('/manager/trainers-and-learners'),

  // Admin
  getAdminOverview: () => request('/admin/overview'),
  getAdminUsers: () => request('/admin/users'),

  // Assessment Loop
  generateQuiz: (topicId, userId) =>
    request('/assessment/generate', {
      method: 'POST',
      body: JSON.stringify({ topic_id: topicId, user_id: userId }),
    }),
  submitQuiz: (quizId, answers, userId) =>
    request('/assessment/submit', {
      method: 'POST',
      body: JSON.stringify({ quiz_id: quizId, answers, user_id: userId }),
    }),
  generateRetest: (topicId, userId) =>
    request('/assessment/retest', {
      method: 'POST',
      body: JSON.stringify({ topic_id: topicId, user_id: userId }),
    }),
};
