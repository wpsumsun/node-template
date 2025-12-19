const { successResponse, errorResponse } = require('../utils/response');
const logger = require('../utils/logger');

// 模拟数据（实际项目中应该从数据库读取）
let users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
  { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 }
];

// 获取所有用户
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;

    // 搜索过滤
    let filteredUsers = users;
    if (search) {
      filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return successResponse(res, {
      data: paginatedUsers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit)
      }
    });
  } catch (error) {
    logger.error('Get users error:', error);
    return errorResponse(res, '获取用户列表失败', 500);
  }
};

// 获取单个用户
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = users.find(u => u.id === parseInt(id));

    if (!user) {
      return errorResponse(res, '用户不存在', 404);
    }

    return successResponse(res, { data: user });
  } catch (error) {
    logger.error('Get user error:', error);
    return errorResponse(res, '获取用户失败', 500);
  }
};

// 创建用户
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;

    // 检查邮箱是否已存在
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return errorResponse(res, '邮箱已被使用', 400);
    }

    const newUser = {
      id: users.length + 1,
      name,
      email,
      age
    };

    users.push(newUser);

    return successResponse(res, {
      message: '用户创建成功',
      data: newUser
    }, 201);
  } catch (error) {
    logger.error('Create user error:', error);
    return errorResponse(res, '创建用户失败', 500);
  }
};

// 更新用户
exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return errorResponse(res, '用户不存在', 404);
    }

    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      email: email || users[userIndex].email,
      age: age || users[userIndex].age
    };

    return successResponse(res, {
      message: '用户更新成功',
      data: users[userIndex]
    });
  } catch (error) {
    logger.error('Update user error:', error);
    return errorResponse(res, '更新用户失败', 500);
  }
};

// 删除用户
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(u => u.id === parseInt(id));

    if (userIndex === -1) {
      return errorResponse(res, '用户不存在', 404);
    }

    users.splice(userIndex, 1);

    return successResponse(res, { message: '用户删除成功' });
  } catch (error) {
    logger.error('Delete user error:', error);
    return errorResponse(res, '删除用户失败', 500);
  }
};
