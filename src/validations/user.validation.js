const { body } = require('express-validator');

exports.userValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('姓名不能为空')
      .isLength({ min: 2, max: 50 }).withMessage('姓名长度必须在 2-50 个字符之间'),
    body('email')
      .trim()
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('邮箱格式不正确')
      .normalizeEmail(),
    body('age')
      .optional()
      .isInt({ min: 1, max: 150 }).withMessage('年龄必须是 1-150 之间的整数')
  ],

  update: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('姓名长度必须在 2-50 个字符之间'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('邮箱格式不正确')
      .normalizeEmail(),
    body('age')
      .optional()
      .isInt({ min: 1, max: 150 }).withMessage('年龄必须是 1-150 之间的整数')
  ]
};
