const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// Create Project (Admin Only)
router.post('/', protect, authorize('Admin'), async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            createdBy: req.user.id
        });
        res.redirect('/dashboard');
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get All Projects for the user
router.get('/', protect, async (req, res) => {
    const projects = req.user.role === 'Admin' 
        ? await Project.find({ createdBy: req.user.id }) 
        : await Project.find({ members: req.user.id });
    res.json(projects);
});

module.exports = router;