---
title: 使用 GitHub Action 实现自动化发布 npm 包
date: 2024-04-06 20:22:20
tag: [git, github, blog]
---

## 使用 GitHub Action 实现自动化发布 npm 包

在开发 `JavaScript` 应用程序或库时，发布到 `npm` 上是一种常见的方式来分享和分发你的代码。手动发布 `npm` 包可能会变得繁琐和容易出错，因此自动化这个过程是非常有帮助的。

`GitHub Actions` 是一个功能强大的工具，它可以帮助你实现自动化发布 `npm` 包的流程。在本文中，我们将学习如何使用 `GitHub Action` 实现自动化发布 `npm` 包的步骤。

### 准备工作

1. 确保你有一个 [`npm` 账号](https://www.npmjs.com/)，并且已经登录到 `npm`。
2. 创建一个 `GitHub` 仓库用于存储你的 `npm` 包的代码。

### 设置 GitHub Action

1. 在你的 GitHub 仓库中，创建一个名为 `.github/workflows/npm-publish.yml` 的文件，用于存储 GitHub Action 的配置。
2. 在 `npm-publish.yml` 中添加以下内容：

```yaml
name: Publish to npm

on:
  push:
    branches:
      # 触发ci/cd的代码分支
      - master

jobs:
  build:
    # 指定操作系统
    runs-on: ubuntu-latest
    steps:
      # 将代码拉到虚拟机
      - name: 获取源码 🛎️
        uses: actions/checkout@v2
      # 指定node版本
      - name: Node环境版本 🗜️
        uses: actions/setup-node@v3
        with:
          node-version: 18
          registry-url: 'https://registry.npmjs.org'
      # 依赖缓存策略
      - name: Npm缓存 📁
        id: cache-dependencies
        uses: actions/cache@v3
        with:
          path: |
            **/node_modules
          key: ${{runner.OS}}-${{hashFiles('**/package-lock.json')}}
      # 依赖下载
      - name: 安装依赖 📦
        if: steps.cache-dependencies.outputs.cache-hit != 'true'
        run: npm install
      # 打包
      - name: 打包 🏗️
        run: npm run build
      # 测试
      - name: 测试 💣
        run: npm run test
      # 发布
      - name: 发布 🚀
        run: npm publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### 申请 npm 访问令牌

1. 登录 `npm` 官网，登录成功后，点开右上角头像，并点击 `Access Tokens` 选项。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/2b9ae517-3e57-417a-a00d-d9721a25c4c1)

2. 点开 `Generate New Token` 下拉框，点击 `Classic Token` 选项。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/b7bdbfd5-4a5f-483c-a795-08bb29d8f35e)

3. 创建一个名称为 `GITHUB_PUBLISH_TOKEN` 的令牌，并选择 `publish 发布`权限。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/922f2bca-5b37-4863-acd4-121e75e4388a)

4. 复制新生成的访问令牌。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/0eef68e5-8adf-483e-90dc-94ac12a45db9)

### 配置 npm 访问令牌

1. 进入项目仓库，点击仓库tab选项卡的 `Settings` ，点开 `Secrets and variables` 选项卡，点击 `Actions` 选项，点击对应页面的 `"New repository secret"` 按钮。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/6d4b0fd4-5f03-4ffc-a464-115a66ebfdcd)

2. 新建名称为 `NPM_TOKEN`的 `secret`, 并将刚刚申请到的`GITHUB_PUBLISH_TOKEN`填入 `secret` 字段。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/09de4a85-e1b9-4a10-98e5-1cf8bf2aec9e)

### 发布 npm 包

1. 在你的代码中做任何更改。
2. 提交这些更改并创建一个新的 `Release`。
3. `GitHub Action` 将自动触发并自动构建、测试和发布你的 `npm` 包。

通过以上步骤，你已经成功地设置了 `GitHub Action` 来实现自动化发布 `npm` 包的流程。现在，每当你创建一个新的 `Release`，你的代码将自动发布到 `npm` 上，让你的开发流程更加高效和方便。
