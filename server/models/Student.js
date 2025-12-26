const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNum: { type: String, required: true },
    mobile: { type: String },
    
    classId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    },

    totalFees: { type: Number, required: true },
    feesPaid: { type: Number, default: 0 },

    // NEW: Stores the list of every payment
    paymentHistory: [{
        amount: Number,
        date: { type: Date, default: Date.now }
    }]

}, {
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
});

StudentSchema.virtual('remainingFees').get(function() {
    return this.totalFees - this.feesPaid;
});

module.exports = mongoose.model('Student', StudentSchema);