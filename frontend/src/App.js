import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import Login from './screen/Login';
import Register from './screen/Register';
import Dashboard from './screen/Dashboard';
import UserManager from './screen/UserManager';
import TaskManager from './screen/TaskManager';
import TaskChatRoom from './screen/TaskChatRoom';

const App = () => {
  const [user, setUser] = useState(null);
  
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const token = localStorage.getItem("token")

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleLoginSuccess} user={user} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/user-manager" element={<UserManager />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/task-chat/:taskId" element={<TaskChatRoom />} />
      </Routes>
    </Router>
  );
};

export default App;

