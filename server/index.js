// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/auth');
const studentRoute = require('./routes/students');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Database Connection
// I replaced '@' with '%40' in your password so it works correctly!
mongoose.connect('mongodb+srv://sdivyanshhh958:Divyansh%401234@divyansh.0xunbwq.mongodb.net/school_fees?retryWrites=true&w=majority')
    .then(() => console.log("DB Connection Successful!"))
    .catch((err) => {
        console.log("DB Connection Error:"); 
        console.log(err);
    });

// Use Routes
app.use('/api/auth', authRoute);
app.use('/api', studentRoute);

// Start Server
app.listen(5000, () => {
    console.log("Backend server running on port 5000!");
});