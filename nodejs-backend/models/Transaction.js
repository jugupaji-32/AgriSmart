const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User reference is required']
    },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE'],
        required: [true, 'Transaction type is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive']
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    paymentMethod: {
        type: String,
        enum: ['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'CARD', 'OTHER'],
        default: 'CASH'
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Index for faster queries
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, category: 1 });

// Virtual for formatted amount
transactionSchema.virtual('formattedAmount').get(function() {
    return `₹${this.amount.toFixed(2)}`;
});

// Method to get transaction summary
transactionSchema.statics.getSummaryByUser = async function(userId, startDate, endDate) {
    const matchStage = {
        user: mongoose.Types.ObjectId(userId)
    };
    
    if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) matchStage.date.$gte = new Date(startDate);
        if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    return this.aggregate([
        { $match: matchStage },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);
};

module.exports = mongoose.model('Transaction', transactionSchema);
