const express = require('express');
const router = express.Router();
const {
    getTransactions,
    getTransaction,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getSummary,
    getRecentTransactions,
    getCategories
} = require('../controllers/financeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected (require authentication)

// Summary and analytics
router.get('/summary', protect, getSummary);
router.get('/recent', protect, getRecentTransactions);
router.get('/categories', protect, getCategories);

// Transaction CRUD
router.route('/transactions')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/transactions/:id')
    .get(protect, getTransaction)
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

module.exports = router;
