require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== 中间件配置 ==========

// 安全头
app.use(helmet());

// CORS 跨域
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : '*',
  credentials: true
}));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Gzip 压缩
app.use(compression());

// 请求日志
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 限流（防止 DDoS）
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 最多 100 个请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api/', limiter);

// ========== 路由 ==========

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API 路由
app.use('/api', routes);

// 404 处理
app.use(notFound);

// 错误处理
app.use(errorHandler);

// ========== 启动服务器 ==========

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV}`);
    logger.info(`🔗 API: http://localhost:${PORT}/api`);
  });
}

module.exports = app;
