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

// --- UPDATED UPDATE ROUTE (With Payment History) ---
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

// --- NEW: DELETE ROUTES ---

// Delete a single Student
router.delete('/student/:id', async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.status(200).json("Student has been deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete a Class (AND all students in that class)
router.delete('/class/:id', async (req, res) => {
    try {
        const classId = req.params.id;
        
        // 1. Delete the Class itself
        await ClassModel.findByIdAndDelete(classId);
        
        // 2. Automatically delete all students belonging to this class
        await Student.deleteMany({ classId: classId });

        res.status(200).json("Class and all its students deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;