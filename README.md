# Node.js Express API 项目模板

完整的 Node.js + Express 项目模板，包含最佳实践和常用功能。

## 📦 功能特性

- ✅ Express 框架
- ✅ RESTful API 设计
- ✅ 统一错误处理
- ✅ 请求参数验证
- ✅ 日志系统
- ✅ CORS 跨域
- ✅ 安全头配置（Helmet）
- ✅ 请求限流
- ✅ Gzip 压缩
- ✅ PM2 集群模式

## 📁 项目结构

```
nodejs-template/
├── src/
│   ├── controllers/        # 控制器
│   │   ├── user.controller.js
│   │   └── auth.controller.js
│   ├── routes/            # 路由
│   │   ├── index.js
│   │   ├── user.routes.js
│   │   └── auth.routes.js
│   ├── middlewares/       # 中间件
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── validations/       # 验证规则
│   │   ├── user.validation.js
│   │   └── auth.validation.js
│   ├── utils/            # 工具函数
│   │   ├── response.js
│   │   └── logger.js
│   └── app.js            # 主应用
├── logs/                 # 日志文件
├── .env.example         # 环境变量示例
├── .gitignore
├── package.json
├── ecosystem.config.js  # PM2 配置
└── README.md

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库等信息
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 启动生产服务器

```bash
# 直接运行
npm start

# 或使用 PM2（推荐）
pm2 start ecosystem.config.js --env production
```

## 📡 API 接口

### 健康检查
```
GET /health
```

### 用户管理
```
GET    /api/users          # 获取用户列表
GET    /api/users/:id      # 获取单个用户
POST   /api/users          # 创建用户
PUT    /api/users/:id      # 更新用户
DELETE /api/users/:id      # 删除用户
```

### 认证
```
POST   /api/auth/register  # 用户注册
POST   /api/auth/login     # 用户登录
POST   /api/auth/logout    # 用户登出
```

## 📝 API 测试示例

### 获取用户列表
```bash
curl http://localhost:3000/api/users
```

### 创建用户
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25
  }'
```

### 用户登录
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "Password123"
  }'
```

## 🛠️ 开发命令

```bash
npm run dev      # 开发模式（nodemon 热重载）
npm start        # 生产模式
npm test         # 运行测试
npm run lint     # 代码检查
```

## 📦 PM2 部署

```bash
# 启动
pm2 start ecosystem.config.js --env production

# 重启
pm2 restart nodejs-template

# 停止
pm2 stop nodejs-template

# 查看日志
pm2 logs nodejs-template

# 监控
pm2 monit
```

## 🔒 环境变量说明

| 变量 | 说明 | 默认值 |
|------|------|--------|
| NODE_ENV | 环境类型 | development |
| PORT | 服务端口 | 3000 |
| DB_HOST | 数据库主机 | localhost |
| DB_PORT | 数据库端口 | 3306 |
| DB_NAME | 数据库名称 | mydb |
| JWT_SECRET | JWT 密钥 | - |

## 📚 技术栈

- **Node.js** 18+
- **Express** 4.x
- **express-validator** - 参数验证
- **helmet** - 安全头
- **cors** - 跨域支持
- **morgan** - 请求日志
- **compression** - Gzip 压缩
- **dotenv** - 环境变量
- **PM2** - 进程管理

## 🚀 部署到服务器

1. 克隆代码到服务器
```bash
git clone <your-repo-url>
cd nodejs-template
```

2. 安装依赖
```bash
npm install --production
```

3. 配置环境变量
```bash
cp .env.example .env
nano .env  # 编辑配置
```

4. 启动服务
```bash
pm2 start ecosystem.config.js --env production
pm2 save
```

## 📄 License

MIT
