// src/App.js

import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatGPTComponent from './Chatbot/chatbotapp';
import Login from './Auth/Login';
import Signup from './Auth/Signup';
import PrivateRoute from './Auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <ChatGPTComponent />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
