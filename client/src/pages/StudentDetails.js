// client/src/pages/StudentDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMoneyBillWave, FaPen, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [student, setStudent] = useState(null);
    const [amountToAdd, setAmountToAdd] = useState("");
    const [isEditingTotal, setIsEditingTotal] = useState(false);
    const [newTotalFee, setNewTotalFee] = useState("");

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                const res = await axios.get(`/api/student/${id}`);
                setStudent(res.data);
                setNewTotalFee(res.data.totalFees);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStudent();
    }, [id]);

    const handleAddPayment = async () => {
        if (!amountToAdd || amountToAdd <= 0) return alert("Enter valid amount");
        try {
            const newPaid = student.feesPaid + parseInt(amountToAdd);
            const res = await axios.put(`/api/student/${id}`, { feesPaid: newPaid });
            setStudent(res.data);
            setAmountToAdd("");
            alert("Payment Recorded!");
        } catch (err) { alert("Error"); }
    };

    const handleUpdateTotal = async () => {
        try {
            const res = await axios.put(`/api/student/${id}`, { totalFees: newTotalFee });
            setStudent(res.data);
            setIsEditingTotal(false);
        } catch (err) { alert("Error"); }
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
                    {/* Total Fee Box */}
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

                    {/* Paid Box */}
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: 'rgba(74, 222, 128, 0.2)', borderColor: '#4ade80', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Paid</p>
                        <h2 style={{ margin: 0, color: '#bbf7d0' }}>₹{student.feesPaid}</h2>
                        <FaCheckCircle style={{ marginTop: '10px', color: '#bbf7d0' }} />
                    </motion.div>

                    {/* Remaining Box */}
                    <motion.div whileHover={{ y: -5 }} className="glass-card" style={{ background: 'rgba(248, 113, 113, 0.2)', borderColor: '#f87171', textAlign: 'center', padding: '20px' }}>
                        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Remaining</p>
                        <h2 style={{ margin: 0, color: '#fecaca' }}>₹{remaining}</h2>
                        <FaExclamationCircle style={{ marginTop: '10px', color: '#fecaca' }} />
                    </motion.div>
                </div>

                {/* Payment Section */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '15px' }}>
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
            </motion.div>
        </div>
    );
};

export default StudentDetails;