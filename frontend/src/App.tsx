import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { User } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
        const user = await api.getMe();
        setUser(user);
        setLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-white">Loading...</div>;

  return (
    <Layout user={user} onLogout={handleLogout}>
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : user.role === 'teacher' ? (
        <TeacherDashboard user={user} />
      ) : (
        <StudentDashboard user={user} />
      )}
    </Layout>
  );
};

export default App;
