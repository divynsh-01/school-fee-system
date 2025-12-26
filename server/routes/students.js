const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const ClassModel = require('../models/Class');

// Create Class
router.post('/class', async (req, res) => {
    const newClass = new ClassModel(req.body);
    await newClass.save();
    res.json(newClass);
});

// Get All Classes
router.get('/class', async (req, res) => {
    const classes = await ClassModel.find();
    res.json(classes);
});

// Add Student
router.post('/student', async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
});

// Get Students by Class
router.get('/student/class/:id', async (req, res) => {
    const students = await Student.find({ classId: req.params.id }).populate('classId');
    res.json(students);
});

// Get Single Student
router.get('/student/:id', async (req, res) => {
    const student = await Student.findById(req.params.id).populate('classId');
    res.json(student);
});

// --- UPDATED UPDATE ROUTE ---
router.put('/student/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        
        // CASE 1: Adding a Payment (History + Increment)
        if (req.body.paymentAmount) {
            const amount = parseInt(req.body.paymentAmount);
            
            student.feesPaid += amount; // Increase total paid
            student.paymentHistory.push({ // Add to history
                amount: amount,
                date: new Date()
            });
            
            await student.save();
            return res.json(student);
        }

        // CASE 2: Just updating info (like Total Fees or Name)
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;