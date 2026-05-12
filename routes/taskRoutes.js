const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, authorize } = require('../middleware/auth');

// Create Task (Admin Only)
router.post('/', protect, authorize('Admin'), async (req, res) => {
    try {
        await Task.create(req.body);
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update Task Status (Role-Based: Both can update status)
router.post('/:id/update', protect, async (req, res) => {
    try {
        const { status } = req.body;
        await Task.findByIdAndUpdate(req.params.id, { status });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).json({ error: "Update failed" });
    }
});

module.exports = router;