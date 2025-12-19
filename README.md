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

## 🚀 部署方案

### 方案 1：Docker 部署（⭐推荐）

**优势：** 环境一致、一键部署、自动重启

```bash
# 1. 构建并启动
docker-compose up -d --build

# 2. 查看状态
docker-compose ps

# 3. 查看日志
docker-compose logs -f app

# 4. 更新部署
./deploy-docker.sh
```

详细文档：[Docker 部署方案](Docker部署方案.md)

### 方案 2：传统 PM2 部署

```bash
# 1. 克隆代码到服务器
git clone git@github.com:wpsumsun/node-template.git
cd nodejs-template

# 2. 安装依赖
npm install --production

# 3. 配置环境变量
cp .env.example .env
nano .env  # 编辑配置

# 4. 启动服务
pm2 start ecosystem.config.js --env production
pm2 save
```

详细文档：[部署流程](部署流程.md)

### 方案 3：自动化部署（GitHub Actions）

每次推送到 main 分支自动部署：

1. 配置 GitHub Secrets（`SERVER_IP`, `SERVER_USER`, `SSH_PRIVATE_KEY`）
2. 推送代码：`git push origin main`
3. 自动触发部署

配置文件：[.github/workflows/deploy.yml](.github/workflows/deploy.yml)

## 📂 项目文件说明

### Docker 相关
- `Dockerfile` - Docker 镜像构建文件
- `docker-compose.yml` - Docker Compose 配置
- `.dockerignore` - Docker 构建忽略文件
- `nginx.conf` - Nginx 反向代理配置
- `deploy-docker.sh` - Docker 部署脚本

### 部署相关
- `ecosystem.config.js` - PM2 进程管理配置
- `.github/workflows/deploy.yml` - GitHub Actions 自动部署
- `部署流程.md` - 传统部署详细流程
- `Docker部署方案.md` - Docker 部署详细方案

## 🔧 配置文件

### 环境变量（.env）
```bash
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mydb
JWT_SECRET=your-secret-key
```

### PM2 配置（ecosystem.config.js）
支持集群模式、自动重启、日志管理等功能。

### Docker 配置（docker-compose.yml）
包含健康检查、自动重启、日志轮转等功能。

## 📊 监控和日志

### PM2 监控
```bash
pm2 list           # 查看所有进程
pm2 logs           # 查看日志
pm2 monit          # 实时监控
pm2 show <name>    # 查看详细信息
```

### Docker 监控
```bash
docker-compose ps              # 查看容器状态
docker-compose logs -f app     # 查看实时日志
docker stats                   # 查看资源使用
```

## 📄 License

MIT
