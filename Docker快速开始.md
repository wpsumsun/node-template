# Docker 部署快速开始（5 分钟）

## 🎯 目标

5 分钟内使用 Docker 将应用部署到服务器。

---

## 📋 前置要求

- ✅ 一台服务器（阿里云、腾讯云等）
- ✅ 服务器已安装 Docker 和 Docker Compose
- ✅ 本地已配置 SSH 密钥到服务器

---

## 🚀 部署步骤

### 1️⃣ 服务器安装 Docker（首次需要）

```bash
# SSH 登录服务器
ssh root@your-server-ip

# 一键安装 Docker
curl -fsSL https://get.docker.com | sh

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 2️⃣ 克隆项目到服务器

```bash
# 创建应用目录
mkdir -p ~/apps
cd ~/apps

# 克隆代码
git clone git@github.com:wpsumsun/node-template.git nodejs-template
cd nodejs-template
```

### 3️⃣ 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置（修改数据库密码、JWT密钥等）
nano .env
```

**最小配置：**
```bash
NODE_ENV=production
PORT=3000
```

### 4️⃣ 一键部署

```bash
# 方式 1：使用部署脚本（推荐）
chmod +x deploy-docker.sh
./deploy-docker.sh

# 方式 2：手动执行
docker-compose up -d --build
```

### 5️⃣ 验证部署

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 测试接口
curl http://localhost:3000/api/test
curl http://your-server-ip:3000/api/test
```

**预期输出：**
```json
{
  "success": true,
  "message": "API is working!",
  "data": { "timestamp": "2025-12-19T..." }
}
```

---

## 🎉 完成！

你的应用已经成功部署！

**访问地址：**
- 直接访问：http://your-server-ip:3000/api/test
- Nginx 代理（如果配置）：http://your-server-ip/api/test

---

## 🔄 后续更新

每次代码更新后：

```bash
# 在服务器上执行
cd ~/apps/nodejs-template
./deploy-docker.sh
```

或配置 GitHub Actions 自动部署（推送代码即自动部署）。

---

## 📊 常用命令

```bash
# 查看容器状态
docker-compose ps

# 查看日志
docker-compose logs -f app

# 重启应用
docker-compose restart app

# 停止应用
docker-compose down

# 查看资源使用
docker stats nodejs-template
```

---

## ❓ 遇到问题？

### 问题 1：端口被占用

```bash
# 查看端口占用
sudo netstat -tlnp | grep 3000

# 修改 docker-compose.yml 中的端口
ports:
  - "3001:3000"  # 改为 3001
```

### 问题 2：容器启动失败

```bash
# 查看详细日志
docker-compose logs app

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

### 问题 3：无法访问

```bash
# 检查防火墙
sudo firewall-cmd --list-all

# 开放端口
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# 检查阿里云安全组规则
# 确保已开放 3000 端口
```

---

## 🌟 进阶配置

### 配置 Nginx 反向代理

修改 `docker-compose.yml`，取消注释 nginx 服务：

```yaml
nginx:
  image: nginx:alpine
  container_name: nginx-proxy
  restart: unless-stopped
  ports:
    - "80:80"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf:ro
  depends_on:
    - app
  networks:
    - app-network
```

启动：
```bash
docker-compose up -d
```

现在可以通过 80 端口访问：http://your-server-ip/api/test

### 配置 GitHub Actions 自动部署

1. 在 GitHub 仓库设置 Secrets：
   - `SERVER_IP`: 服务器 IP
   - `SERVER_USER`: SSH 用户名
   - `SSH_PRIVATE_KEY`: SSH 私钥

2. 推送代码到 main 分支，自动触发部署

3. 在 Actions 标签查看部署进度

---

## 📚 更多文档

- [完整 Docker 部署方案](Docker部署方案.md)
- [传统部署流程](部署流程.md)
- [项目 README](README.md)

---

**预计时间：5 分钟** ⏱️

**难度：⭐（非常简单）**
