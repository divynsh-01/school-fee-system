import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMoneyBillWave, FaPen, FaCheckCircle, FaExclamationCircle, FaHistory, FaTrophy } from 'react-icons/fa';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [student, setStudent] = useState(null);
    const [amountToAdd, setAmountToAdd] = useState("");
    const [isEditingTotal, setIsEditingTotal] = useState(false);
    const [newTotalFee, setNewTotalFee] = useState("");

    const fetchStudent = useCallback(async () => {
        try {
            const res = await axios.get(`/api/student/${id}`);
            setStudent(res.data);
            setNewTotalFee(res.data.totalFees);
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        fetchStudent();
    }, [fetchStudent]);

    // Handle Payment
    const handleAddPayment = async () => {
        // 1. Validation: Check for empty or negative
        if (!amountToAdd || amountToAdd <= 0) return alert("Enter valid amount");

        // 2. Validation: Check for Overpayment
        const currentRemaining = student.totalFees - student.feesPaid;
        if (Number(amountToAdd) > currentRemaining) {
            return alert(`Error: You cannot pay more than the remaining amount (₹${currentRemaining})`);
        }

        try {
            const res = await axios.put(`/api/student/${id}`, { paymentAmount: amountToAdd });
            setStudent(res.data);
            setAmountToAdd("");
            alert("Payment Recorded Successfully!");
        } catch (err) { alert("Error recording payment"); }
    };

    const handleUpdateTotal = async () => {
        try {
            const res = await axios.put(`/api/student/${id}`, { totalFees: newTotalFee });
            setStudent(res.data);
            setIsEditingTotal(false);
        } catch (err) { alert("Error updating total"); }
    };

    if (!student) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="spinner" style={{ borderTopColor: '#2563eb', borderColor: '#dbeafe' }}></div>
        </div>
    );

    const remaining = student.totalFees - student.feesPaid;
    const isFullyPaid = remaining <= 0;

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
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
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: '#f9fafb', textAlign: 'center', padding: '20px' }}>
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
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: '#ecfdf5', borderColor: '#6ee7b7', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, color: '#065f46' }}>Paid</p>
                        <h2 style={{ margin: 0, color: '#059669' }}>₹{student.feesPaid}</h2>
                        <FaCheckCircle style={{ marginTop: '10px', color: '#059669' }} />
                    </motion.div>

                    {/* Remaining */}
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: isFullyPaid ? '#ecfdf5' : '#fef2f2', borderColor: isFullyPaid ? '#6ee7b7' : '#fca5a5', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8, color: isFullyPaid ? '#065f46' : '#991b1b' }}>Remaining</p>
                        <h2 style={{ margin: 0, color: isFullyPaid ? '#059669' : '#dc2626' }}>₹{remaining}</h2>
                        {isFullyPaid ? <FaCheckCircle style={{marginTop:'10px', color:'#059669'}}/> : <FaExclamationCircle style={{ marginTop: '10px', color: '#dc2626' }} />}
                    </motion.div>
                </div>

                {/* Payment Input Section OR "Fully Paid" Message */}
                <div style={{ background: '#f3f4f6', padding: '25px', borderRadius: '15px', marginBottom: '30px' }}>
                    {isFullyPaid ? (
                        <div style={{ textAlign: 'center', color: '#059669', padding: '10px' }}>
                            <FaTrophy style={{ fontSize: '3rem', marginBottom: '10px' }} />
                            <h2 style={{ margin: 0 }}>No Dues Left!</h2>
                            <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>This student has fully paid their fees.</p>
                        </div>
                    ) : (
                        <>
                            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaMoneyBillWave /> Record New Payment
                            </h3>
                            <p style={{ opacity: 0.7, marginBottom: '15px' }}>Enter the amount received physically (Cash/UPI)</p>
                            
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <input 
                                    className="modern-input" 
                                    type="number" 
                                    placeholder={`Max: ₹${remaining}`} 
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
                        </>
                    )}
                </div>

                {/* Payment History Section */}
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px' }}>
                        <FaHistory /> Payment History
                    </h3>
                    
                    {student.paymentHistory && student.paymentHistory.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
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
                                        background: '#ffffff', 
                                        padding: '15px', 
                                        borderRadius: '10px',
                                        border: '1px solid #e5e7eb'
                                    }}
                                >
                                    <div>
                                        <span style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#059669' }}>
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