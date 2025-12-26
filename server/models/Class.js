const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
    grade: { type: String, required: true },  // e.g., "10"
    section: { type: String, required: true } // e.g., "A"
});

module.exports = mongoose.model('Class', ClassSchema);