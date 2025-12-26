import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMoneyBillWave, FaPen, FaCheckCircle, FaExclamationCircle, FaHistory } from 'react-icons/fa';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [student, setStudent] = useState(null);
    const [amountToAdd, setAmountToAdd] = useState("");
    const [isEditingTotal, setIsEditingTotal] = useState(false);
    const [newTotalFee, setNewTotalFee] = useState("");

    // Fetch Data
    const fetchStudent = async () => {
        try {
            const res = await axios.get(`/api/student/${id}`);
            setStudent(res.data);
            setNewTotalFee(res.data.totalFees);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    // Handle Payment (Updated to support History)
    const handleAddPayment = async () => {
        if (!amountToAdd || amountToAdd <= 0) return alert("Enter valid amount");
        try {
            // We now send 'paymentAmount' instead of calculating the total ourselves
            const res = await axios.put(`/api/student/${id}`, { paymentAmount: amountToAdd });
            setStudent(res.data);
            setAmountToAdd("");
            alert("Payment Recorded Successfully!");
        } catch (err) { alert("Error recording payment"); }
    };

    // Handle Total Fee Update
    const handleUpdateTotal = async () => {
        try {
            const res = await axios.put(`/api/student/${id}`, { totalFees: newTotalFee });
            setStudent(res.data);
            setIsEditingTotal(false);
        } catch (err) { alert("Error updating total"); }
    };

    if (!student) return <p style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</p>;
    const remaining = student.totalFees - student.feesPaid;

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <motion.button 
                whileHover={{ x: -5 }}
                onClick={() => navigate(-1)} 
                className="btn-secondary"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Back
            </motion.button>

            <motion.div 
                className="glass-card"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div>
                        <h1 style={{ margin: 0 }}>{student.name}</h1>
                        <p style={{ opacity: 0.8, marginTop: '5px' }}>Roll Number: {student.rollNum}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0 }}>Mobile: {student.mobile || "N/A"}</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                    
                    {/* Total Fee */}
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: 'rgba(255,255,255,0.15)', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Total Fee</p>
                        {isEditingTotal ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <input type="number" value={newTotalFee} onChange={e => setNewTotalFee(e.target.value)} className="modern-input" style={{ padding: '5px', textAlign: 'center' }} />
                                <button onClick={handleUpdateTotal} className="btn-primary" style={{ fontSize: '0.8rem', padding: '5px' }}>Save</button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                <h2 style={{ margin: 0 }}>₹{student.totalFees}</h2>
                                <FaPen onClick={() => setIsEditingTotal(true)} style={{ cursor: 'pointer', fontSize: '0.8rem', opacity: 0.7 }} />
                            </div>
                        )}
                    </motion.div>

                    {/* Paid */}
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: 'rgba(74, 222, 128, 0.2)', borderColor: '#4ade80', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Paid</p>
                        <h2 style={{ margin: 0, color: '#bbf7d0' }}>₹{student.feesPaid}</h2>
                        <FaCheckCircle style={{ marginTop: '10px', color: '#bbf7d0' }} />
                    </motion.div>

                    {/* Remaining */}
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: 'rgba(248, 113, 113, 0.2)', borderColor: '#f87171', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Remaining</p>
                        <h2 style={{ margin: 0, color: '#fecaca' }}>₹{remaining}</h2>
                        <FaExclamationCircle style={{ marginTop: '10px', color: '#fecaca' }} />
                    </motion.div>
                </div>

                {/* Payment Input Section */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaMoneyBillWave /> Record New Payment
                    </h3>
                    <p style={{ opacity: 0.7, marginBottom: '15px' }}>Enter the amount received physically (Cash/UPI)</p>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <input 
                            className="modern-input" 
                            type="number" 
                            placeholder="Amount (e.g. 500)" 
                            value={amountToAdd}
                            onChange={(e) => setAmountToAdd(e.target.value)}
                            style={{ margin: 0 }}
                        />
                        <motion.button 
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddPayment} 
                            className="btn-primary"
                            style={{ width: 'auto', whiteSpace: 'nowrap' }}
                        >
                            Update Record
                        </motion.button>
                    </div>
                </div>

                {/* NEW: Payment History Section */}
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                        <FaHistory /> Payment History
                    </h3>
                    
                    {student.paymentHistory && student.paymentHistory.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                            {/* We map the history in Reverse so newest is first */}
                            {[...student.paymentHistory].reverse().map((pay, index) => (
                                <motion.div 
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.05)', 
                                        padding: '15px', 
                                        borderRadius: '10px',
                                        border: '1px solid rgba(255,255,255,0.1)'
                                    }}
                                >
                                    <div>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#4ade80' }}>
                                            + ₹{pay.amount}
                                        </span>
                                    </div>
                                    <div style={{ opacity: 0.6, fontSize: '0.9rem' }}>
                                        {new Date(pay.date).toLocaleDateString()} at {new Date(pay.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ opacity: 0.5, fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                            No payment history available.
                        </p>
                    )}
                </div>

            </motion.div>
        </div>
    );
};

export default StudentDetails;