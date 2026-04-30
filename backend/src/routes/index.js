const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const menuRoutes = require('./menu');
const orderRoutes = require('./orders');
const paymentRoutes = require('./payments');
const userRoutes = require('./users');

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/users', userRoutes);

module.exports = router;
