const { validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    // 执行所有验证
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({
      field: err.path,
      message: err.msg
    }));

    return res.status(400).json({
      success: false,
      code: 400,
      message: '请求参数验证失败',
      errors: extractedErrors
    });
  };
};
