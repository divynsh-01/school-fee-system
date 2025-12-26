// client/src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa'; // Import Trash Icon

const Dashboard = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [grade, setGrade] = useState("");
    const [section, setSection] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else fetchClasses();
    }, [navigate]);

    const fetchClasses = async () => {
        const res = await axios.get('/api/class');
        setClasses(res.data);
    };

    const handleAddClass = async (e) => {
        e.preventDefault();
        if(!grade || !section) return alert("Please enter both Grade and Section");
        
        await axios.post('/api/class', { grade, section });
        setGrade(""); setSection("");
        fetchClasses();
    };

    // --- NEW: DELETE FUNCTION ---
    const handleDeleteClass = async (e, classId) => {
        e.stopPropagation(); // Stop the click from opening the class page
        
        if (window.confirm("Are you sure? This will delete the Class AND all its Students!")) {
            try {
                await axios.delete(`/api/class/${classId}`);
                fetchClasses(); // Refresh list immediately
            } catch (err) {
                alert("Error deleting class");
            }
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Dashboard</h1>
                <button className="btn-secondary" onClick={() => { localStorage.clear(); navigate('/'); }}>Logout</button>
            </motion.div>

            {/* Glass Create Form */}
            <motion.div 
                className="glass-card" 
                initial={{ x: -100, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }}
                style={{ marginTop: '20px', marginBottom: '40px', display: 'flex', gap: '10px', alignItems: 'center' }}
            >
                <h3 style={{ margin: 0, marginRight: '20px' }}>Add Class:</h3>
                <input className="modern-input" style={{ width: '150px', margin: 0 }} placeholder="Grade" value={grade} onChange={e => setGrade(e.target.value)} />
                <input className="modern-input" style={{ width: '150px', margin: 0 }} placeholder="Section" value={section} onChange={e => setSection(e.target.value)} />
                <motion.button whileHover={{ scale: 1.1 }} className="btn-primary" onClick={handleAddClass} style={{ width: 'auto' }}>+ Add</motion.button>
            </motion.div>

            {/* Animated Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
                {classes.map((cls, index) => (
                    <motion.div
                        key={cls._id}
                        className="glass-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.2)' }}
                        onClick={() => navigate(`/class/${cls._id}`)}
                        style={{ cursor: 'pointer', textAlign: 'center', position: 'relative' }} // Added relative position for delete button
                    >
                        {/* DELETE BUTTON (Top Right) */}
                        <button 
                            onClick={(e) => handleDeleteClass(e, cls._id)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(255, 0, 0, 0.2)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '30px',
                                height: '30px',
                                cursor: 'pointer',
                                color: '#ff6b6b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10
                            }}
                            title="Delete Class"
                        >
                            <FaTrash size={12} />
                        </button>

                        <h2 style={{ fontSize: '2.5rem', margin: '10px 0' }}>Class {cls.grade}</h2>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Section {cls.section}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;