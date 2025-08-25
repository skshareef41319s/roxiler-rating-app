const router = require('express').Router();
const prisma = require('../prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nameRule, addressRule, emailRule, passwordRule } = require('../utils/validators');
const { validationResult, body } = require('express-validator');


// Normal user signup
router.post('/signup', [nameRule, emailRule, addressRule, passwordRule], async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { name, email, address, password } = req.body;
const exists = await prisma.user.findUnique({ where: { email } });
if (exists) return res.status(409).json({ message: 'Email already in use' });


const hash = await bcrypt.hash(password, 10);
const user = await prisma.user.create({ data: { name, email, address, password: hash, role: 'USER' } });
return res.status(201).json({ id: user.id });
});


// Login — all roles
router.post('/login', [emailRule, body('password').notEmpty()], async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });


const { email, password } = req.body;
const user = await prisma.user.findUnique({ where: { email } });
if (!user) return res.status(401).json({ message: 'Invalid credentials' });


const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(401).json({ message: 'Invalid credentials' });


const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
res.json({ token, user: { id: user.id, role: user.role, name: user.name, email: user.email } });
});


module.exports = router;