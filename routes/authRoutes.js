const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send('Name, email and password are required');
        }
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).send('Email already registered');

        const hashedPassword = await bcrypt.hash(password, 10);
        const safeRole = role === 'Admin' ? 'Admin' : 'Member';
        await User.create({ name, email, password: hashedPassword, role: safeRole });
        res.redirect('/');
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id, role: user.role, name: user.name },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            return res
                .cookie('token', token, { httpOnly: true, sameSite: 'lax' })
                .redirect('/dashboard');
        }
        res.status(401).send('Invalid email or password');
    } catch (err) {
        res.status(500).send('Login failed');
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

module.exports = router;
