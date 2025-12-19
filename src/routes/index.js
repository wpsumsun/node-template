const express = require('express');
const router = express.Router();

const userRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');

// API 版本信息
router.get('/', (req, res) => {
  res.json({
    message: 'API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/health'
    }
  });
});

// 子路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;
