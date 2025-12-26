// client/src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email, password } : { name, email, password, role: 'admin' };
            const res = await axios.post(endpoint, payload);
            
            if (isLogin) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                navigate('/dashboard');
            } else {
                alert("Registration Successful! Please Login.");
                setIsLogin(true);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    // --- NEW ICON STYLE FOR PERFECT CENTERING ---
    const iconStyle = { 
        position: 'absolute', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        left: '18px', 
        color: 'rgba(255,255,255,0.8)',
        fontSize: '1.1rem',
        pointerEvents: 'none' // Prevents icon from blocking clicks
    };

    const inputWrapperStyle = { position: 'relative', width: '100%' };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.5 }}
                className="glass-card"
                style={{ width: '380px', textAlign: 'center', padding: '3rem 2rem' }}
            >
                <motion.h2 
                    key={isLogin ? "login" : "register"}
                    initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    style={{ marginBottom: '2rem', fontSize: '1.8rem' }}
                >
                    {isLogin ? "Welcome Back" : "Create Account"}
                </motion.h2>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {!isLogin && (
                        <div style={inputWrapperStyle}>
                            <FaUser style={iconStyle} />
                            {/* Padding is now handled in CSS class */}
                            <input className="modern-input" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                    )}
                    <div style={inputWrapperStyle}>
                        <FaEnvelope style={iconStyle} />
                        <input className="modern-input" placeholder="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div style={inputWrapperStyle}>
                        <FaLock style={iconStyle} />
                        <input className="modern-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.03 }} 
                        whileTap={{ scale: 0.98 }} 
                        className="btn-primary" 
                        type="submit"
                        style={{ marginTop: '10px', padding: '15px' }}
                    >
                        {isLogin ? "Login" : "Sign Up"}
                    </motion.button>
                </form>

                <p className="link-text" onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.9 }}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </p>
            </motion.div>
        </div>
    );
};

export default Login;