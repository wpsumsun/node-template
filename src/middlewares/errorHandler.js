const logger = require('../utils/logger');

// 404 处理
exports.notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// 统一错误处理
exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  // 记录错误日志
  if (statusCode === 500) {
    logger.error({
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params
    });
  }

  res.status(statusCode).json({
    success: false,
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      error: err
    })
  });
};
