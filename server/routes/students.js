const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const ClassModel = require('../models/Class');

// Create a Class
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

// Get Students by Class (Populate shows class details, not just ID)
router.get('/student/class/:id', async (req, res) => {
    const students = await Student.find({ classId: req.params.id }).populate('classId');
    res.json(students);
});

// Update Student (Fees or Info)
router.put('/student/:id', async (req, res) => {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
});

// Get Single Student details
router.get('/student/:id', async (req, res) => {
    const student = await Student.findById(req.params.id).populate('classId');
    res.json(student);
});

module.exports = router;