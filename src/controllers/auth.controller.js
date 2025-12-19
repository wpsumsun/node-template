const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// 用户注册
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 实际项目中应该：
    // 1. 检查用户是否已存在
    // 2. 加密密码（bcrypt）
    // 3. 保存到数据库

    return successResponse(res, {
      message: '注册成功',
      data: {
        username,
        email,
        createdAt: new Date()
      }
    }, 201);
  } catch (error) {
    logger.error('Register error:', error);
    return errorResponse(res, '注册失败', 500);
  }
};

// 用户登录
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 实际项目中应该：
    // 1. 验证用户名和密码
    // 2. 生成 JWT token
    // 3. 返回 token

    return successResponse(res, {
      message: '登录成功',
      data: {
        token: 'mock-jwt-token',
        user: {
          email,
          username: 'Test User'
        }
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    return errorResponse(res, '登录失败', 500);
  }
};

// 用户登出
exports.logout = async (req, res, next) => {
  try {
    // 实际项目中应该：
    // 1. 清除 token
    // 2. 从 Redis 中删除 session

    return successResponse(res, { message: '登出成功' });
  } catch (error) {
    logger.error('Logout error:', error);
    return errorResponse(res, '登出失败', 500);
  }
};
