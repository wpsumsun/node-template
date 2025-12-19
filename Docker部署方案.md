# Docker 部署方案详细指南

## 📋 目录

1. [方案概述](#1-方案概述)
2. [前置准备](#2-前置准备)
3. [Docker 配置文件](#3-docker-配置文件)
4. [本地测试](#4-本地测试)
5. [服务器部署](#5-服务器部署)
6. [自动化部署](#6-自动化部署)
7. [运维管理](#7-运维管理)
8. [进阶配置](#8-进阶配置)

---

## 1. 方案概述

### 1.1 架构图

```
┌─────────────────────────────────────────┐
│           Nginx 容器 (80/443)            │
│         反向代理 + HTTPS                  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Node.js 应用容器 (3000)           │
│      自动重启 + 健康检查                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   可选: MySQL/Redis 容器                 │
└─────────────────────────────────────────┘
```

### 1.2 优势

✅ **环境一致性**：开发、测试、生产环境完全一致
✅ **易于部署**：一键启动，无需安装 Node.js、PM2
✅ **自动重启**：容器崩溃自动重启
✅ **资源隔离**：不同项目互不影响
✅ **易于扩展**：轻松实现负载均衡
✅ **版本管理**：镜像版本化，方便回滚

---

## 2. 前置准备

### 2.1 本地环境

**安装 Docker Desktop（Windows/Mac）**

```bash
# Windows: 下载安装
https://www.docker.com/products/docker-desktop

# Mac
brew install --cask docker

# 验证安装
docker --version
docker-compose --version
```

**Linux 安装 Docker**

```bash
# 一键安装脚本
curl -fsSL https://get.docker.com | sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 添加当前用户到 docker 组（免 sudo）
sudo usermod -aG docker $USER
newgrp docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证
docker --version
docker-compose --version
```

### 2.2 服务器要求

- **最低配置**：1 核 CPU + 1GB 内存
- **推荐配置**：2 核 CPU + 2GB 内存
- **操作系统**：Ubuntu 20.04+、CentOS 7+、Debian 10+
- **开放端口**：80、443、3000（可选）

---

## 3. Docker 配置文件

### 3.1 项目结构

```
nodejs-template/
├── Dockerfile                 # Docker 镜像构建文件
├── docker-compose.yml         # 容器编排配置
├── .dockerignore             # Docker 忽略文件
├── nginx.conf                # Nginx 配置（可选）
├── deploy-docker.sh          # 部署脚本
├── .env.example              # 环境变量示例
└── src/
    └── app.js
```

### 3.2 Dockerfile（已创建）

查看 [Dockerfile](Dockerfile)

**关键配置说明：**

```dockerfile
# 1. 多阶段构建 - 减小镜像体积
FROM node:18-alpine AS builder

# 2. 只安装生产依赖
RUN npm ci --only=production

# 3. 非 root 用户运行 - 安全
USER nodejs

# 4. 健康检查 - 自动重启
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node -e "require('http').get('http://localhost:3000/health', ...)"
```

### 3.3 docker-compose.yml（已创建）

查看 [docker-compose.yml](docker-compose.yml)

**关键配置说明：**

```yaml
services:
  app:
    restart: unless-stopped    # 自动重启策略
    ports:
      - "3000:3000"           # 端口映射
    env_file:
      - .env                  # 环境变量文件
    volumes:
      - ./logs:/app/logs      # 日志持久化
    healthcheck:              # 健康检查
      test: [...]
      interval: 30s
```

### 3.4 .dockerignore（已创建）

查看 [.dockerignore](.dockerignore)

### 3.5 Nginx 配置（可选，用于反向代理）

创建 `nginx.conf`：

```nginx
events {
    worker_connections 1024;
}

http {
    upstream nodejs_app {
        server app:3000;
    }

    server {
        listen 80;
        server_name _;

        # 请求体大小限制
        client_max_body_size 10M;

        # Gzip 压缩
        gzip on;
        gzip_types text/plain text/css application/json application/javascript;

        # API 代理
        location / {
            proxy_pass http://nodejs_app;
            proxy_http_version 1.1;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_cache_bypass $http_upgrade;

            # 超时设置
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # 健康检查
        location /health {
            access_log off;
            proxy_pass http://nodejs_app/health;
        }
    }
}
```

---

## 4. 本地测试

### 4.1 准备环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env
```

`.env` 示例：
```bash
NODE_ENV=production
PORT=3000
APP_NAME=nodejs-template

# 数据库（如果需要）
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mydb
DB_USER=root
DB_PASSWORD=password

# JWT
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=7d
```

### 4.2 本地构建和运行

```bash
# 1. 构建镜像
docker-compose build

# 2. 启动容器
docker-compose up

# 或后台运行
docker-compose up -d

# 3. 查看日志
docker-compose logs -f app

# 4. 查看容器状态
docker-compose ps

# 5. 测试应用
curl http://localhost:3000/api/test
```

### 4.3 常用命令

```bash
# 停止容器
docker-compose down

# 停止并删除数据卷
docker-compose down -v

# 重启容器
docker-compose restart

# 重新构建并启动
docker-compose up -d --build

# 查看容器日志（最近 100 行）
docker-compose logs --tail=100 app

# 进入容器内部
docker-compose exec app sh

# 查看资源使用情况
docker stats
```

---

## 5. 服务器部署

### 5.1 准备服务器

```bash
# 1. 连接服务器
ssh root@your-server-ip

# 2. 安装 Docker（如果未安装）
curl -fsSL https://get.docker.com | sh
sudo systemctl start docker
sudo systemctl enable docker

# 3. 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. 验证安装
docker --version
docker-compose --version

# 5. 创建应用目录
mkdir -p ~/apps
cd ~/apps
```

### 5.2 部署代码

**方式 1：Git 克隆（推荐）**

```bash
# 克隆仓库
git clone git@github.com:wpsumsun/node-template.git nodejs-template
cd nodejs-template

# 配置环境变量
cp .env.example .env
nano .env  # 修改为生产环境配置

# 构建并启动
docker-compose up -d --build

# 查看状态
docker-compose ps
docker-compose logs -f app
```

**方式 2：使用部署脚本**

```bash
# 克隆代码
git clone git@github.com:wpsumsun/node-template.git nodejs-template
cd nodejs-template

# 配置环境变量
cp .env.example .env
nano .env

# 执行部署脚本
chmod +x deploy-docker.sh
./deploy-docker.sh
```

### 5.3 配置防火墙

**CentOS/Alibaba Cloud Linux**

```bash
# 开放端口
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp  # 如果需要直接访问
sudo firewall-cmd --reload

# 查看已开放端口
sudo firewall-cmd --list-all
```

**Ubuntu**

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

**阿里云安全组**

在阿里云控制台配置安全组规则：
- 入方向：80/TCP
- 入方向：443/TCP
- 入方向：3000/TCP（可选）

### 5.4 验证部署

```bash
# 1. 检查容器状态
docker-compose ps

# 应该看到：
# NAME                COMMAND             SERVICE   STATUS    PORTS
# nodejs-template     "node src/app.js"   app       Up        0.0.0.0:3000->3000/tcp

# 2. 查看日志
docker-compose logs --tail=50 app

# 3. 测试接口
curl http://localhost:3000/api/test

# 4. 从外部测试
curl http://your-server-ip:3000/api/test
```

---

## 6. 自动化部署

### 6.1 使用部署脚本（已创建）

查看 [deploy-docker.sh](deploy-docker.sh)

**使用方法：**

```bash
# 首次部署
chmod +x deploy-docker.sh
./deploy-docker.sh

# 后续更新
./deploy-docker.sh
```

### 6.2 GitHub Actions 自动部署（已创建）

查看 [.github/workflows/deploy.yml](.github/workflows/deploy.yml)

**配置 GitHub Secrets：**

1. 进入仓库 → Settings → Secrets and variables → Actions
2. 添加以下 Secrets：

| Name | Value | 说明 |
|------|-------|------|
| `SERVER_IP` | `182.92.112.82` | 服务器 IP |
| `SERVER_USER` | `root` 或 `deploy` | SSH 用户名 |
| `SSH_PRIVATE_KEY` | 私钥内容 | 从 `~/.ssh/id_ed25519` 复制 |

**获取私钥：**

```bash
# 本地执行
cat ~/.ssh/id_ed25519

# 复制完整输出（包括 BEGIN 和 END 行）
```

**测试自动部署：**

```bash
# 修改代码
git add .
git commit -m "Test auto deploy"
git push origin main

# GitHub Actions 会自动触发部署
# 在仓库的 Actions 标签查看进度
```

### 6.3 Webhook 自动部署（可选）

创建 `webhook.js`：

```javascript
const http = require('http');
const { execSync } = require('child_process');

const PORT = 9000;
const SECRET = 'your-webhook-secret';

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);

        // 验证密钥（GitHub Webhook）
        // if (req.headers['x-hub-signature-256'] !== ...) return;

        console.log('收到部署请求:', new Date());

        // 执行部署脚本
        execSync('cd ~/apps/nodejs-template && ./deploy-docker.sh', {
          stdio: 'inherit'
        });

        res.writeHead(200);
        res.end('OK');
      } catch (err) {
        console.error('部署失败:', err);
        res.writeHead(500);
        res.end('Error');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
}).listen(PORT, () => {
  console.log(`Webhook 服务运行在端口 ${PORT}`);
});
```

---

## 7. 运维管理

### 7.1 日常运维命令

```bash
# 查看容器状态
docker-compose ps

# 查看实时日志
docker-compose logs -f app

# 查看最近 100 行日志
docker-compose logs --tail=100 app

# 重启应用
docker-compose restart app

# 停止应用
docker-compose stop app

# 启动应用
docker-compose start app

# 完全停止并删除容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### 7.2 进入容器调试

```bash
# 进入容器 shell
docker-compose exec app sh

# 在容器内执行命令
docker-compose exec app node -v
docker-compose exec app npm list

# 查看容器文件系统
docker-compose exec app ls -la /app
```

### 7.3 查看资源使用

```bash
# 查看所有容器资源使用
docker stats

# 查看特定容器
docker stats nodejs-template

# 查看镜像大小
docker images

# 清理未使用的资源
docker system prune -a
```

### 7.4 日志管理

**查看日志：**

```bash
# 实时日志
docker-compose logs -f app

# 查看错误日志
docker-compose logs app | grep ERROR

# 导出日志
docker-compose logs app > app.log
```

**日志轮转配置（docker-compose.yml）：**

```yaml
services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"      # 单个日志文件最大 10MB
        max-file: "3"        # 保留最近 3 个日志文件
```

### 7.5 备份和恢复

**备份：**

```bash
# 备份代码
cd ~/apps/nodejs-template
tar -czf backup-$(date +%Y%m%d).tar.gz .

# 备份镜像
docker save nodejs-template-app:latest | gzip > nodejs-template-image.tar.gz

# 备份数据卷（如果有）
docker run --rm -v nodejs-template_logs:/data -v $(pwd):/backup alpine tar czf /backup/logs-backup.tar.gz /data
```

**恢复：**

```bash
# 恢复代码
tar -xzf backup-20231219.tar.gz

# 恢复镜像
docker load < nodejs-template-image.tar.gz

# 恢复数据
docker run --rm -v nodejs-template_logs:/data -v $(pwd):/backup alpine tar xzf /backup/logs-backup.tar.gz -C /
```

---

## 8. 进阶配置

### 8.1 多环境部署

创建不同的 compose 文件：

**docker-compose.dev.yml**（开发环境）

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - ./src:/app/src      # 热更新
      - ./logs:/app/logs
    command: npm run dev    # 使用 nodemon
```

**docker-compose.prod.yml**（生产环境）

```yaml
version: '3.8'

services:
  app:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
```

**使用：**

```bash
# 开发环境
docker-compose -f docker-compose.dev.yml up

# 生产环境
docker-compose -f docker-compose.prod.yml up -d
```

### 8.2 集群模式（多实例）

修改 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    deploy:
      replicas: 3          # 运行 3 个实例
      restart_policy:
        condition: on-failure
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**nginx-lb.conf**（负载均衡配置）：

```nginx
events {
    worker_connections 1024;
}

http {
    upstream nodejs_cluster {
        least_conn;
        server app:3000 max_fails=3 fail_timeout=30s;
    }

    server {
        listen 80;

        location / {
            proxy_pass http://nodejs_cluster;
            proxy_next_upstream error timeout http_500 http_502 http_503;
            # ... 其他配置
        }
    }
}
```

### 8.3 添加 MySQL/Redis

修改 `docker-compose.yml`：

```yaml
version: '3.8'

services:
  app:
    build: .
    depends_on:
      - mysql
      - redis
    environment:
      - DB_HOST=mysql
      - REDIS_HOST=redis
    networks:
      - app-network

  mysql:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: mydb
      MYSQL_USER: appuser
      MYSQL_PASSWORD: apppassword
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - app-network

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - app-network

volumes:
  mysql_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

### 8.4 HTTPS 配置

使用 Let's Encrypt 自动证书：

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
      - certbot-www:/var/www/certbot
    networks:
      - app-network

  certbot:
    image: certbot/certbot
    volumes:
      - ./certs:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  certbot-www:
```

获取证书：

```bash
docker-compose run --rm certbot certonly --webroot \
  -w /var/www/certbot \
  -d yourdomain.com \
  --email your@email.com \
  --agree-tos
```

---

## 9. 故障排查

### 9.1 容器无法启动

```bash
# 查看详细日志
docker-compose logs app

# 查看容器退出码
docker-compose ps

# 检查配置文件
docker-compose config

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 9.2 端口冲突

```bash
# 查看端口占用
sudo netstat -tlnp | grep 3000
sudo lsof -i :3000

# 修改 docker-compose.yml 中的端口映射
ports:
  - "3001:3000"  # 改为 3001
```

### 9.3 性能问题

```bash
# 查看资源使用
docker stats nodejs-template

# 限制资源
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
```

### 9.4 网络问题

```bash
# 检查网络
docker network ls
docker network inspect nodejs-template_app-network

# 重建网络
docker-compose down
docker network prune
docker-compose up -d
```

---

## 10. 最佳实践

### 10.1 安全建议

- ✅ 使用非 root 用户运行容器
- ✅ 不要在镜像中包含敏感信息
- ✅ 使用 `.dockerignore` 减少镜像体积
- ✅ 定期更新基础镜像
- ✅ 使用健康检查
- ✅ 限制容器资源

### 10.2 性能优化

- ✅ 使用多阶段构建减小镜像
- ✅ 合理使用缓存层
- ✅ 使用 alpine 基础镜像
- ✅ 只安装生产依赖
- ✅ 配置日志轮转

### 10.3 监控建议

```bash
# 安装 cAdvisor（容器监控）
docker run -d \
  --name=cadvisor \
  -p 8080:8080 \
  -v /:/rootfs:ro \
  -v /var/run:/var/run:ro \
  -v /sys:/sys:ro \
  -v /var/lib/docker/:/var/lib/docker:ro \
  google/cadvisor:latest

# 访问 http://your-server:8080
```

---

## 11. 快速参考

### 常用命令速查

| 操作 | 命令 |
|------|------|
| 构建镜像 | `docker-compose build` |
| 启动容器 | `docker-compose up -d` |
| 停止容器 | `docker-compose down` |
| 重启容器 | `docker-compose restart` |
| 查看日志 | `docker-compose logs -f app` |
| 查看状态 | `docker-compose ps` |
| 进入容器 | `docker-compose exec app sh` |
| 更新部署 | `./deploy-docker.sh` |
| 清理资源 | `docker system prune -a` |

### 端口说明

| 端口 | 用途 |
|------|------|
| 3000 | Node.js 应用 |
| 80 | HTTP（Nginx） |
| 443 | HTTPS（Nginx） |
| 3306 | MySQL（如果使用） |
| 6379 | Redis（如果使用） |

---

## 📚 相关资源

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 文档](https://docs.docker.com/compose/)
- [Node.js Docker 最佳实践](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**最后更新：** 2025-12-19
