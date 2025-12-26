const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNum: { type: String, required: true },
    mobile: { type: String },
    
    // Link this student to a specific Class ID
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    },

    // Fee Math
    totalFees: { type: Number, required: true },
    feesPaid: { type: Number, default: 0 }
}, {
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

// Virtual: Automatically calculates 'remainingFees' when we fetch data
StudentSchema.virtual('remainingFees').get(function() {
    return this.totalFees - this.feesPaid;
});

module.exports = mongoose.model('Student', StudentSchema);