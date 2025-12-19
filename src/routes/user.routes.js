const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validate } = require('../middlewares/validator');
const { userValidation } = require('../validations/user.validation');

// GET /api/users - 获取用户列表
router.get('/', userController.getUsers);

// GET /api/users/:id - 获取单个用户
router.get('/:id', userController.getUserById);

// POST /api/users - 创建用户
router.post('/', validate(userValidation.create), userController.createUser);

// PUT /api/users/:id - 更新用户
router.put('/:id', validate(userValidation.update), userController.updateUser);

// DELETE /api/users/:id - 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;
