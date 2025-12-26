const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User (Run this once via Postman to create the Admin)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Admin Created!" });
    } catch (err) { res.status(500).json(err); }
});

// Login User
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json("User not found");

        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).json("Wrong password");

        // Create a Token (Digital Key)
        const token = jwt.sign({ id: user._id, role: user.role }, "SECRET_KEY_123");
        res.json({ token, user });
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;