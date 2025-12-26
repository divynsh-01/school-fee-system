// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios'; // <--- IMPORT AXIOS

// --- CONFIGURATION ---
// PASTE YOUR VERCEL BACKEND URL HERE inside the quotes
axios.defaults.baseURL = "https://school-fee-system.vercel.app/"; 
// ---------------------

// Import all the pages we created
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClassDetails from './pages/ClassDetails';
import StudentDetails from './pages/StudentDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 1. Login Page (The starting point) */}
          <Route path="/" element={<Login />} />

          {/* 2. Dashboard (Create & View Classes) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* 3. Class Details (View Students in a specific class) */}
          <Route path="/class/:id" element={<ClassDetails />} />

          {/* 4. Student Details (View & Update Fees) */}
          <Route path="/student/:id" element={<StudentDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;