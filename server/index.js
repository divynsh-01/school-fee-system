// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/auth');
const studentRoute = require('./routes/students');

const app = express();

// 1. Allow Frontend to talk to Backend (CORS)
app.use(cors({
    origin: "*", // Allow all origins for now to prevent blocking
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

// 2. The "Vercel-Safe" Database Connection
// We cache the connection so it doesn't reconnect every single time
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return; // If already connected, do nothing
    
    try {
        const db = await mongoose.connect('mongodb+srv://sdivyanshhh958:Divyansh%401234@divyansh.0xunbwq.mongodb.net/school_fees?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = db.connections[0].readyState;
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.log("DB Connection Error:", err);
    }
};

// 3. Middleware: Force every request to WAIT for DB connection
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// 4. Routes
app.use('/api/auth', authRoute);
app.use('/api', studentRoute);

// 5. Root Route (To test if server is alive)
app.get('/', (req, res) => {
    res.send("Backend is running and DB is connected!");
});

// Start Server (Only used locally, Vercel ignores this)
app.listen(5000, () => {
    console.log("Backend server running on port 5000!");
});

module.exports = app;