const jwt = require('jsonwebtoken');


function authRequired(req, res, next) {
const header = req.headers.authorization || '';
const token = header.startsWith('Bearer ') ? header.slice(7) : null;
if (!token) return res.status(401).json({ message: 'No token' });
try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { id, role, name, email }
next();
} catch (e) {
return res.status(401).json({ message: 'Invalid token' });
}
}


function requireRole(...roles) {
return (req, res, next) => {
if (!req.user || !roles.includes(req.user.role)) {
return res.status(403).json({ message: 'Forbidden' });
}
next();
};
}


module.exports = { authRequired, requireRole };