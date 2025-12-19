const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validator');
const { authValidation } = require('../validations/auth.validation');

// POST /api/auth/register - 用户注册
router.post('/register', validate(authValidation.register), authController.register);

// POST /api/auth/login - 用户登录
router.post('/login', validate(authValidation.login), authController.login);

// POST /api/auth/logout - 用户登出
router.post('/logout', authController.logout);

module.exports = router;
