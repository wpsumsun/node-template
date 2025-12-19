#!/bin/bash
set -e

echo "🚀 开始 Docker 部署..."

# 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 停止并删除旧容器
echo "🛑 停止旧容器..."
docker-compose down

# 构建新镜像
echo "🔨 构建新镜像..."
docker-compose build --no-cache

# 启动容器
echo "🚀 启动新容器..."
docker-compose up -d

# 查看状态
echo "📊 容器状态："
docker-compose ps

# 查看日志
echo "📝 最近日志："
docker-compose logs --tail=50 app

echo "✅ 部署完成！"
echo "💡 查看日志: docker-compose logs -f app"
echo "💡 查看状态: docker-compose ps"
echo "💡 进入容器: docker-compose exec app sh"
