const { body } = require('express-validator');

exports.authValidation = {
  register: [
    body('username')
      .trim()
      .notEmpty().withMessage('用户名不能为空')
      .isLength({ min: 3, max: 20 }).withMessage('用户名长度必须在 3-20 个字符之间')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('用户名只能包含字母、数字和下划线'),
    body('email')
      .trim()
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('邮箱格式不正确')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('密码不能为空')
      .isLength({ min: 6 }).withMessage('密码长度至少为 6 个字符')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('密码必须包含大小写字母和数字')
  ],

  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('邮箱不能为空')
      .isEmail().withMessage('邮箱格式不正确')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('密码不能为空')
  ]
};
