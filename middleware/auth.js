const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect('/');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/');
    }
};

exports.authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) return res.status(403).send('Access Denied');
        next();
    };
};