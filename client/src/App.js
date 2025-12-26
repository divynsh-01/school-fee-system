// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Import all the pages (MUST be at the top)
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClassDetails from './pages/ClassDetails';
import StudentDetails from './pages/StudentDetails';

// --- CONFIGURATION (Place this AFTER all imports) ---
// PASTE YOUR REAL BACKEND URL HERE (e.g., https://school-fee-backend.vercel.app)
axios.defaults.baseURL = "https://school-fee-system.vercel.app"; 
// ----------------------------------------------------

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/class/:id" element={<ClassDetails />} />
          <Route path="/student/:id" element={<StudentDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;