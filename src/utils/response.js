/**
 * 统一成功响应格式
 */
exports.successResponse = (res, data = {}, statusCode = 200) => {
  const response = {
    success: true,
    code: statusCode,
    message: data.message || 'Success',
    ...(data.data && { data: data.data }),
    ...(data.pagination && { pagination: data.pagination }),
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};

/**
 * 统一错误响应格式
 */
exports.errorResponse = (res, message = 'Error', statusCode = 400, errors = null) => {
  const response = {
    success: false,
    code: statusCode,
    message,
    ...(errors && { errors }),
    timestamp: new Date().toISOString()
  };

  return res.status(statusCode).json(response);
};
