const asyncHandler = require('express-async-handler');
const Transaction = require('../models/Transaction');
const mongoose = require('mongoose');

// @desc    Get all transactions for logged-in user
// @route   GET /api/finance/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category, limit = 100, page = 1 } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
        query.type = type.toUpperCase();
    }
    
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }
    
    if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
    }
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const transactions = await Transaction.find(query)
        .sort({ date: -1 })
        .limit(parseInt(limit))
        .skip(skip);
    
    const total = await Transaction.countDocuments(query);
    
    res.json({
        transactions,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / parseInt(limit))
        }
    });
});

// @desc    Get single transaction
// @route   GET /api/finance/transactions/:id
// @access  Private
const getTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    
    // Verify ownership
    if (transaction.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to view this transaction');
    }
    
    res.json(transaction);
});

// @desc    Add new transaction
// @route   POST /api/finance/transactions
// @access  Private
const addTransaction = asyncHandler(async (req, res) => {
    console.log('addTransaction called');
    console.log('User ID:', req.user?.id);
    console.log('Request body:', req.body);
    
    const { type, category, amount, date, description, paymentMethod, tags } = req.body;
    
    // Validation
    if (!type || !category || !amount) {
        console.log('Validation failed: missing required fields');
        res.status(400);
        throw new Error('Please provide type, category, and amount');
    }
    
    if (!['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
        console.log('Validation failed: invalid type', type);
        res.status(400);
        throw new Error('Type must be either INCOME or EXPENSE');
    }
    
    if (amount <= 0) {
        console.log('Validation failed: invalid amount', amount);
        res.status(400);
        throw new Error('Amount must be greater than 0');
    }
    
    const transactionData = {
        user: req.user.id,
        type: type.toUpperCase(),
        category,
        amount,
        date: date || Date.now(),
        description,
        paymentMethod: paymentMethod || 'CASH',
        tags: tags || []
    };
    
    console.log('Creating transaction with data:', transactionData);
    
    const transaction = await Transaction.create(transactionData);
    
    console.log('Transaction created successfully:', transaction);
    
    res.status(201).json(transaction);
});

// @desc    Update transaction
// @route   PUT /api/finance/transactions/:id
// @access  Private
const updateTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    
    // Verify ownership
    if (transaction.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to update this transaction');
    }
    
    const { type, category, amount, date, description, paymentMethod, tags } = req.body;
    
    // Update fields
    if (type && ['INCOME', 'EXPENSE'].includes(type.toUpperCase())) {
        transaction.type = type.toUpperCase();
    }
    if (category) transaction.category = category;
    if (amount && amount > 0) transaction.amount = amount;
    if (date) transaction.date = date;
    if (description !== undefined) transaction.description = description;
    if (paymentMethod) transaction.paymentMethod = paymentMethod;
    if (tags) transaction.tags = tags;
    
    const updatedTransaction = await transaction.save();
    res.json(updatedTransaction);
});

// @desc    Delete transaction
// @route   DELETE /api/finance/transactions/:id
// @access  Private
const deleteTransaction = asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
        res.status(404);
        throw new Error('Transaction not found');
    }
    
    // Verify ownership
    if (transaction.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to delete this transaction');
    }
    
    await transaction.deleteOne();
    
    res.json({ 
        success: true,
        message: 'Transaction deleted successfully',
        id: req.params.id 
    });
});

// @desc    Get financial summary with aggregation
// @route   GET /api/finance/summary
// @access  Private
const getSummary = asyncHandler(async (req, res) => {
    console.log('=== getSummary called ===');
    console.log('User ID:', req.user.id);
    console.log('Query params:', req.query);
    
    const { startDate, endDate, year } = req.query;
    const userId = mongoose.Types.ObjectId(req.user.id);
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);
    } else if (year) {
        // Default to specified year
        dateFilter.$gte = new Date(`${year}-01-01`);
        dateFilter.$lte = new Date(`${year}-12-31`);
    } else {
        // Default to current year
        const currentYear = new Date().getFullYear();
        dateFilter.$gte = new Date(`${currentYear}-01-01`);
        dateFilter.$lte = new Date(`${currentYear}-12-31`);
    }
    
    console.log('Date filter:', dateFilter);
    
    // Aggregation pipeline for summary
    const summaryPipeline = [
        {
            $match: {
                user: userId,
                ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
            }
        },
        {
            $group: {
                _id: '$type',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ];
    
    // Aggregation pipeline for monthly chart data
    const chartPipeline = [
        {
            $match: {
                user: userId,
                ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    type: '$type'
                },
                total: { $sum: '$amount' }
            }
        },
        {
            $sort: { '_id.year': 1, '_id.month': 1 }
        }
    ];
    
    // Aggregation for category breakdown
    const categoryPipeline = [
        {
            $match: {
                user: userId,
                ...(Object.keys(dateFilter).length > 0 && { date: dateFilter })
            }
        },
        {
            $group: {
                _id: {
                    category: '$category',
                    type: '$type'
                },
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { total: -1 }
        }
    ];
    
    // Execute all aggregations
    const [summary, chartData, categoryData] = await Promise.all([
        Transaction.aggregate(summaryPipeline),
        Transaction.aggregate(chartPipeline),
        Transaction.aggregate(categoryPipeline)
    ]);
    
    // Process summary
    let totalIncome = 0;
    let totalExpense = 0;
    let incomeCount = 0;
    let expenseCount = 0;
    
    summary.forEach(item => {
        if (item._id === 'INCOME') {
            totalIncome = item.total;
            incomeCount = item.count;
        } else if (item._id === 'EXPENSE') {
            totalExpense = item.total;
            expenseCount = item.count;
        }
    });
    
    const profit = totalIncome - totalExpense;
    
    // Format chart data by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartDataFormatted = {};
    
    chartData.forEach(item => {
        const monthKey = `${monthNames[item._id.month - 1]} ${item._id.year}`;
        if (!chartDataFormatted[monthKey]) {
            chartDataFormatted[monthKey] = { month: monthKey, income: 0, expense: 0 };
        }
        
        if (item._id.type === 'INCOME') {
            chartDataFormatted[monthKey].income = item.total;
        } else {
            chartDataFormatted[monthKey].expense = item.total;
        }
    });
    
    const chartDataArray = Object.values(chartDataFormatted);
    
    // Format category breakdown
    const categoryBreakdown = {
        income: [],
        expense: []
    };
    
    categoryData.forEach(item => {
        const category = {
            category: item._id.category,
            total: item.total,
            count: item.count,
            percentage: 0 // Will calculate after
        };
        
        if (item._id.type === 'INCOME') {
            category.percentage = totalIncome > 0 ? ((item.total / totalIncome) * 100).toFixed(2) : 0;
            categoryBreakdown.income.push(category);
        } else {
            category.percentage = totalExpense > 0 ? ((item.total / totalExpense) * 100).toFixed(2) : 0;
            categoryBreakdown.expense.push(category);
        }
    });
    
    console.log('=== Summary Response ===');
    console.log('Chart Data:', JSON.stringify(chartDataArray, null, 2));
    console.log('Category Breakdown:', JSON.stringify(categoryBreakdown, null, 2));
    
    res.json({
        summary: {
            totalIncome: parseFloat(totalIncome.toFixed(2)),
            totalExpense: parseFloat(totalExpense.toFixed(2)),
            profit: parseFloat(profit.toFixed(2)),
            incomeCount,
            expenseCount,
            profitMargin: totalIncome > 0 ? parseFloat(((profit / totalIncome) * 100).toFixed(2)) : 0
        },
        chartData: chartDataArray,
        categoryBreakdown,
        period: {
            startDate: dateFilter.$gte || null,
            endDate: dateFilter.$lte || null
        }
    });
});

// @desc    Get recent transactions (last 10)
// @route   GET /api/finance/recent
// @access  Private
const getRecentTransactions = asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user.id })
        .sort({ date: -1 })
        .limit(10);
    
    res.json(transactions);
});

// @desc    Get available categories
// @route   GET /api/finance/categories
// @access  Private
const getCategories = asyncHandler(async (req, res) => {
    const categories = await Transaction.distinct('category', { user: req.user.id });
    
    // Predefined common categories
    const commonCategories = {
        income: ['Crop Sales', 'Livestock Sales', 'Government Subsidy', 'Rental Income', 'Other Income'],
        expense: ['Seeds', 'Fertilizers', 'Pesticides', 'Labor', 'Equipment', 'Irrigation', 'Transportation', 'Maintenance', 'Other Expenses']
    };
    
    res.json({
        userCategories: categories.sort(),
        suggestions: commonCategories
    });
});

module.exports = {
    getTransactions,
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    getRecentTransactions,
    getCategories
};
