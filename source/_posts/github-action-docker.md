---
title: 使用 GitHub Actions 自动化部署 Nuxt3 应用到 Docker 容器中
date: 2024-04-08 13:38:20
tag: [git, github, docker]
---

## 使用 GitHub Actions 自动化部署 Nuxt3 应用到 Docker 容器中

### 介绍

在当今的软件开发中，自动化部署是提高生产效率和保证代码质量的关键步骤之一。`GitHub Actions` 是一个强大的持续集成和持续部署工具，而 `Docker` 则提供了一种轻量级、可移植的容器化解决方案。本文将介绍如何结合 `GitHub Actions` 和 `Docker`，自动化部署一个基于 `Nuxt.js 3` 的应用到 `Docker` 容器中。

### 前提条件

在开始之前，请确保您已经具备以下环境和工具：

- 一个 `GitHub` 账号，并且在该账号下创建了一个仓库用于存放您的 `Nuxt.js 3` 项目。
- 一个 `Docker Hub` 账号，用于存放您的 `Docker` 镜像。
- 安装了 `Docker` 和 `Docker Compose` 的开发环境。

#### 步骤一：准备 Nuxt.js 3 项目
首先，您需要有一个基于 `Nuxt.js 3` 的项目。如果还没有，可以通过以下命令创建一个新的 `Nuxt.js 3` 项目：

``` bash
Copy code
npx create-nuxt-app@latest my-nuxt-app
```

按照提示选择项目配置，然后进入项目目录。

#### 步骤二：编写 Dockerfile

接下来，我们需要创建一个 `Dockerfile` 文件，用于构建 `Docker` 镜像。在项目根目录下创建一个名为 `Dockerfile` 的文件，并添加以下内容：

``` Dockerfile
# 使用 Node 18 作为基础镜像
FROM node:18 AS builder

# 设置工作目录
WORKDIR /app

# 拷贝 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 拷贝源代码到工作目录
COPY . .

# 构建应用
RUN npm run build

# 使用 Nginx 作为基础镜像
FROM nginx:alpine

# 拷贝 Nuxt.js 应用到 Nginx 静态文件目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

该 `Dockerfile` 文件中定义了两个阶段的构建过程。第一阶段使用 `Node 14` 作为基础镜像，用于构建 `Nuxt.js` 应用；第二阶段使用 `Nginx` 作为基础镜像，用于运行 `Nuxt.js` 应用。

### 步骤三：编写 `Docker Compose` 文件

为了简化 `Docker` 容器的管理，我们可以使用 `Docker Compose` 来定义和运行多个容器。在项目根目录下创建一个名为 `docker-compose.yml` 的文件，并添加以下内容：

``` yaml
version: '3'
services:
  app:
    build: .
    ports:
      - '3000:80'
    environment:
      - NODE_ENV=production
    restart: always
```

该 `Docker Compose` 文件定义了一个名为 `app` 的服务，使用了刚才编写的 `Dockerfile` 来构建镜像，并将容器的 `80` 端口映射到宿主机的 `3000` 端口。另外，设置了 NODE_ENV 环境变量为 `production`，并且设置容器始终在退出时重新启动。

#### 步骤四：配置 GitHub Actions

接下来，我们将配置 `GitHub Actions`，使其在每次推送代码到仓库时自动构建并部署应用到 `Docker` 容器中。

在项目根目录下创建一个名为 `.github/workflows` 的目录，并在该目录下创建一个名为 `deploy.yml` 的文件，并添加以下内容：

``` yaml
name: Deploy to Docker

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Log in to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v2
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/my-nuxt-app:latest

      - name: Deploy to Docker Compose
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: docker-compose pull && docker-compose up -d
```

该 `GitHub Actions` 配置文件定义了一个名为 `Deploy to Docker` 的工作流，在代码推送到 `master` 分支时触发。它包含了以下几个步骤：


- 检出仓库代码。
- 设置 `Docker Buildx`，以便支持多平台构建。
- 登录到 `Docker Hub`。
- 构建并推送 `Docker` 镜像到 `Docker Hub`。
- 使用 `SSH` 连接到部署目标主机，并执行 `docker-compose pull` 和 `docker-compose up -d` 命令来更新容器。

#### 步骤五：配置 Secrets

为了安全地管理敏感信息，如 `Docker Hub` 和部署目标主机的凭据，我们需要在 `GitHub` 仓库的 `Settings -> Secrets` 页面中添加这些凭据。

添加以下凭据：

- **DOCKER_USERNAME**: 您的 `Docker Hub` 用户名。
- **DOCKER_PASSWORD**: 您的 `Docker Hub` 密码或访问令牌。
- **SSH_HOST**: 部署目标主机的 `IP` 地址或域名。
- **SSH_USERNAME**: 部署目标主机的用户名。
- **SSH_PRIVATE_KEY**: `SSH` 私钥，用于与部署目标主机建立安全连接。

#### 总结

通过结合 `GitHub Actions`、`Docker` 和 `Docker Compose`，我们成功实现了一个自动化部署流程，可以在每次代码更新时自动构建并部署 `Nuxt.js 3` 应用到 `Docker` 容器中。这种自动化流程可以大大提高开发团队的生产效率，并且确保了部署的一致性和可靠性。