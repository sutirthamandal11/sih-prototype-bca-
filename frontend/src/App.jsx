import React, { useState, useEffect } from 'react';
import { 
  api, getAuthToken, setAuthToken, removeAuthToken, 
  getStoredUser, setStoredUser, removeStoredUser 
} from './services/api';
import Navbar from './components/Navbar';
import LoginScreen from './components/LoginScreen';
import LearnerDashboard from './components/LearnerDashboard';
import TrainerDashboard from './components/TrainerDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import AdminDashboard from './components/AdminDashboard';
import QuizModal from './components/QuizModal';
import QuizResultModal from './components/QuizResultModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [demoUsers, setDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Role Specific Dashboard Data
  const [learnerData, setLearnerData] = useState(null);
  const [trainerData, setTrainerData] = useState(null);
  const [managerData, setManagerData] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // Assessment & Quiz Modals
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  // On initial mount: load demo users and check existing session
  useEffect(() => {
    async function init() {
      try {
        const users = await api.getDemoUsers().catch(() => []);
        setDemoUsers(users);

        const storedToken = getAuthToken();
        const storedUser = getStoredUser();

        if (storedToken && storedUser) {
          setCurrentUser(storedUser);
          await loadRoleDashboard(storedUser);
        }
      } catch (err) {
        console.error('Initialization error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Fetch role-specific data depending on the active user role
  const loadRoleDashboard = async (user) => {
    if (!user) return;
    setDashboardLoading(true);
    try {
      const allTopics = await api.getTopics().catch(() => []);
      setTopics(allTopics);

      if (user.role === 'learner') {
        const prog = await api.getMyProgress();
        setLearnerData(prog);
      } else if (user.role === 'trainer') {
        const tData = await api.getTrainerLearners();
        setTrainerData(tData);
      } else if (user.role === 'manager') {
        const mData = await api.getManagerHierarchy();
        setManagerData(mData);
      } else if (user.role === 'admin') {
        const aData = await api.getAdminOverview();
        setAdminData(aData);
      }
    } catch (err) {
      console.error('Error loading role dashboard data:', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await api.login(email, password);
      setCurrentUser(res.user);
      await loadRoleDashboard(res.user);
    } catch (err) {
      setAuthError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeStoredUser();
    setCurrentUser(null);
    setLearnerData(null);
    setTrainerData(null);
    setManagerData(null);
    setAdminData(null);
  };

  const handleSwitchRole = async (targetEmail) => {
    await handleLogin(targetEmail, 'password123');
  };

  // Assessment Handlers
  const handleStartAssessment = async (topicId) => {
    try {
      const quiz = await api.generateQuiz(topicId, currentUser?.id);
      setActiveQuiz(quiz);
    } catch (err) {
      alert('Error generating assessment: ' + err.message);
    }
  };

  const handleStartRetest = async (topicId) => {
    try {
      // Close result modal if open
      setQuizResult(null);
      const quiz = await api.generateRetest(topicId, currentUser?.id);
      setActiveQuiz(quiz);
    } catch (err) {
      alert('Error generating retest: ' + err.message);
    }
  };

  const handleSubmitQuiz = async (quizId, answers) => {
    setIsSubmittingQuiz(true);
    try {
      const result = await api.submitQuiz(quizId, answers, currentUser?.id);
      setActiveQuiz(null);
      setQuizResult(result);
      // Refresh learner data
      if (currentUser?.role === 'learner') {
        const updatedProg = await api.getMyProgress();
        setLearnerData(updatedProg);
      }
    } catch (err) {
      alert('Error submitting quiz: ' + err.message);
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const handleEnrollTopic = async (topicId) => {
    try {
      await api.enrollTopic(topicId);
      const updatedProg = await api.getMyProgress();
      setLearnerData(updatedProg);
    } catch (err) {
      alert('Enrollment failed: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchRole={handleSwitchRole}
        demoUsers={demoUsers}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {!currentUser ? (
          <LoginScreen
            onLogin={handleLogin}
            demoUsers={demoUsers}
            loading={loading}
            error={authError}
          />
        ) : (
          <>
            {/* 1. LEARNER VIEW */}
            {currentUser.role === 'learner' && (
              <LearnerDashboard
                progressData={learnerData}
                topics={topics}
                onStartAssessment={handleStartAssessment}
                onStartRetest={handleStartRetest}
                onEnrollTopic={handleEnrollTopic}
                loading={dashboardLoading}
              />
            )}

            {/* 2. TRAINER VIEW */}
            {currentUser.role === 'trainer' && (
              <TrainerDashboard
                trainerData={trainerData}
                loading={dashboardLoading}
              />
            )}

            {/* 3. TRAINING MANAGER VIEW */}
            {currentUser.role === 'manager' && (
              <ManagerDashboard
                managerData={managerData}
                loading={dashboardLoading}
              />
            )}

            {/* 4. ADMIN VIEW */}
            {currentUser.role === 'admin' && (
              <AdminDashboard
                adminData={adminData}
                loading={dashboardLoading}
              />
            )}
          </>
        )}
      </main>

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          quiz={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onSubmit={handleSubmitQuiz}
          isSubmitting={isSubmittingQuiz}
        />
      )}

      {/* Quiz Result Modal */}
      {quizResult && (
        <QuizResultModal
          result={quizResult}
          onClose={() => setQuizResult(null)}
          onStartRetest={handleStartRetest}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-400">
        SkillFlow AI • SIH Prototype • Multi-Tier Role Governance & Adaptive Competency Loop
      </footer>

    </div>
  );
}
