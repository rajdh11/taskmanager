const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

const { protect } = require('./middleware/auth');
const User = require('./models/User');
const Task = require('./models/Task');

dotenv.config();

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Environment Variable Checks
if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment variables');
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error('Missing JWT_SECRET in environment variables');
    process.exit(1);
}

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch((err) => {
        console.error('DB connection error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));

// Home Route
app.get('/', (req, res) => {
    res.send('Backend Working Successfully');
});

// Signup Route
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Test Route
app.get('/test', (req, res) => {
    res.send('Backend Working');
});

// Dashboard Route
app.get('/dashboard', protect, async (req, res) => {
    try {
        const [tasks, members] = await Promise.all([
            Task.find().populate('assignedTo'),
            User.find({ role: 'Member' })
        ]);

        res.render('dashboard', {
            user: req.user,
            tasks,
            members
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load dashboard');
    }
});

// Start Server
const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});