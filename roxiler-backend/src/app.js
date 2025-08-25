const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const ownerRoutes = require('./routes/owner');


const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => res.json({ ok: true, service: 'roxiler-backend' }));


app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/stores', storeRoutes);
app.use('/owner', ownerRoutes);


module.exports = app;