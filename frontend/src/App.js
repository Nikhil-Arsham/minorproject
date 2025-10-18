import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Contests from './pages/Contests';
import ContestProblems from './pages/ContestProblems';
import ProblemDetails from './pages/ProblemDetails';
import AdminPanel from './pages/AdminPanel';
import CreateContest from './pages/CreateContest';
import Logout from './pages/Logout';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import ContestList from './pages/ContestList';
import Problems from './pages/Problems';
import CreateProblem from './pages/CreateProblem';
// const API_BASE_URL = `${process.env.REACT_APP_API_URL}`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    console.log('App.js - Token:', token);
    console.log('App.js - User data from localStorage:', userData);
    
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      console.log('App.js - Parsed user:', parsedUser);
      console.log('App.js - User role from parsed data:', parsedUser.role);
      
      setIsLoggedIn(true);
      setUser(parsedUser);
      setUserRole(parsedUser.role || 'user');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setUserRole(userData.role || 'user');
    // Token is already set in localStorage by Login/Signup components
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setUserRole('user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <div className="App">
      <Router>
        <Navbar isLoggedIn={isLoggedIn} userRole={userRole} />
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isLoggedIn ? <Signup onSignup={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/leaderboard" element={<Leaderboard user={user} />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/contests" element={isLoggedIn ? <Contests user={user} /> : <Navigate to="/login" />} />
          <Route path="/contest/:contestId" element={isLoggedIn ? <ContestProblems user={user} /> : <Navigate to="/login" />} />
          <Route path="/problem/:contestId/:problemId" element={isLoggedIn ? <ProblemDetails user={user} /> : <Navigate to="/login" />} />
          <Route path="/problem/:problemId" element={isLoggedIn ? <ProblemDetails user={user} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          <Route path="/contest-list" element={<ContestList user={user} />} />
          <Route path="/problems" element={<Problems user={user} />} />
          <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminPanel user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/create-contest" element={isLoggedIn && userRole === 'admin' ? <CreateContest user={user} /> : <Navigate to="/" />} />
          <Route path="/admin/create-problem" element={isLoggedIn && userRole === 'admin' ? <CreateProblem user={user} /> : <Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;








