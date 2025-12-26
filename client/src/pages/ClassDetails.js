// client/src/pages/ClassDetails.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUserPlus, FaEdit, FaUserGraduate } from 'react-icons/fa';

const ClassDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [name, setName] = useState("");
    const [rollNum, setRollNum] = useState("");
    const [mobile, setMobile] = useState("");
    const [totalFees, setTotalFees] = useState("");

    const fetchStudents = useCallback(async () => {
        try {
            const res = await axios.get(`/api/student/class/${id}`);
            setStudents(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/student', { name, rollNum, mobile, totalFees, classId: id });
            setName(""); setRollNum(""); setMobile(""); setTotalFees("");
            fetchStudents();
        } catch (err) {
            alert("Error adding student");
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header & Back Button */}
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ marginBottom: '20px' }}>
                <button onClick={() => navigate('/dashboard')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FaArrowLeft /> Dashboard
                </button>
            </motion.div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }}>Class Details</motion.h1>
            </div>

            {/* Glass Add Student Form */}
            <motion.div 
                className="glass-card"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '40px' }}
            >
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaUserPlus /> Add New Student</h3>
                <form onSubmit={handleAddStudent} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', alignItems: 'center' }}>
                    <input className="modern-input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
                    <input className="modern-input" placeholder="Roll No." value={rollNum} onChange={e => setRollNum(e.target.value)} required />
                    <input className="modern-input" placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} />
                    <input className="modern-input" type="number" placeholder="Total Fees" value={totalFees} onChange={e => setTotalFees(e.target.value)} required />
                    <motion.button whileHover={{ scale: 1.05 }} className="btn-primary" type="submit" style={{ height: '45px' }}>Add</motion.button>
                </form>
            </motion.div>

            {/* Student List */}
            <div className="glass-card" style={{ padding: '0' }}>
                <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ margin: 0 }}><FaUserGraduate /> Student List ({students.length})</h3>
                </div>
                
                {loading ? <p style={{ padding: '20px' }}>Loading...</p> : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        style={{ display: 'grid', gap: '10px', padding: '20px' }}
                    >
                        {/* Header Row (Hidden on mobile, visible on desktop) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '0.5fr 1.5fr 1fr 1fr 1fr 1fr', fontWeight: 'bold', padding: '10px', color: '#ffe600' }}>
                            <span>Roll</span>
                            <span>Name</span>
                            <span>Total</span>
                            <span>Paid</span>
                            <span>Remaining</span>
                            <span>Action</span>
                        </div>

                        {/* Animated Rows */}
                        {students.map((std) => (
                            <motion.div 
                                key={std._id}
                                variants={itemVariants}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)', scale: 1.01 }}
                                style={{ 
                                    display: 'grid', 
                                    gridTemplateColumns: '0.5fr 1.5fr 1fr 1fr 1fr 1fr', 
                                    alignItems: 'center',
                                    padding: '15px 10px', 
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px'
                                }}
                            >
                                <span>{std.rollNum}</span>
                                <span style={{ fontWeight: '600' }}>{std.name}</span>
                                <span>₹{std.totalFees}</span>
                                <span style={{ color: '#4ade80' }}>₹{std.feesPaid}</span>
                                <span style={{ color: '#f87171' }}>₹{std.remainingFees}</span>
                                <button 
                                    className="btn-secondary"
                                    onClick={() => navigate(`/student/${std._id}`)}
                                    style={{ background: 'rgba(255, 255, 255, 0.2)', fontSize: '0.9rem' }}
                                >
                                    <FaEdit /> details
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ClassDetails;