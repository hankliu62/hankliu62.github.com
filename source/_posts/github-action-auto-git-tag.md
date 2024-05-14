---
title: 使用 GitHub Actions 自动推送 Git Tag
date: 2024-05-02 18:12:20
tag: [git, github, tag]
---

## 使用 GitHub Actions 自动推送 Git Tag

`GitHub Actions` 是 `GitHub` 提供的一项功能，用于实现自动化工作流程，可以帮助您自动执行多种任务，例如构建、测试、部署等。其中，自动推送 `Git Tag` 是一个常见的用例，特别是当您希望将版本号从项目的 `package.json` 文件中提取并自动发布为 `Git Tag` 时。

![GitHub Actions Logo](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg)

### 准备工作

在开始之前，您需要确保您具备以下条件：

1. 一个 `GitHub` 账号，并且您拥有要推送标签的仓库的写权限。
2. 项目使用了 `Git` 来进行版本控制，并且 `package.json` 文件中包含了版本号信息。
3. 对 `GitHub Actions` 有一定的了解，包括如何编写和配置工作流文件。

### 实现步骤

下面是实现自动推送 `Git Tag` 的详细步骤：

#### 1. 创建 Workflow 文件

首先，在您的 GitHub 仓库中创建一个新的 `Workflow` 文件，该文件将定义自动化工作流程。您可以在 `.github/workflows` 目录下创建一个 YAML 格式的文件，例如 `push-tag.yml`。

#### 2. 编写 Workflow 文件

在 `Workflow` 文件中，我们需要定义一个工作流程，该工作流程将在满足特定条件时触发，并执行推送标签的操作。下面是一个示例 `Workflow` 文件的内容：

```yaml
name: Push Tag

on:
  push:
    branches:
      - master

jobs:
  push-tag:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Get version from package.json
        id: version
        run: echo "VERSION=$(node -p 'require(`./package.json`).version')" >> $GITHUB_ENV

      - name: Push tag
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git tag -a v${{ env.VERSION }} -m "Auto-generated tag from GitHub Actions"
          git push origin v${{ env.VERSION }}
```

在这个示例中：

- 定义了一个名为 `Push Tag` 的工作流，它将在推送到 `master` 分支时触发。
- 创建了一个名为 `push-tag` 的 `job`，它在 `Ubuntu` 环境中运行。
- 工作流程包含三个步骤：检出仓库、从 `package.json` 文件中获取版本号、推送标签到远程仓库。
- 使用 `echo` 命令将从 `package.json` 文件中获取的版本号写入到环境文件中，该环境文件由 `GitHub Actions` 自动读取。
- 然后使用 `env` 关键字来获取环境变量中的版本号，并使用该版本号创建标签和推送标签。

#### 3. 提交并部署 Workflow 文件

将编写好的 `Workflow` 文件提交到您的 `GitHub` 仓库中，并等待 `GitHub Actions` 自动触发工作流程。当您推送代码到 `master` 分支时，`GitHub Actions` 将自动运行该工作流程，并根据 `package.json` 文件中的版本号创建并推送一个新的 `Git Tag`。

![GitHub Actions Workflow](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg)


### GitHub Actions YAML 配置参数

`GitHub Actions` 的 `YAML` 文件用于定义工作流程，其中包含了触发条件、作业配置和任务步骤等信息。以下是对 `YAML` 文件中常用字段的解释：

1. `name`: 定义工作流程的名称。

2. `on`: 定义触发工作流程的事件。可以是以下任何一个或组合：
   - `push`: 当代码推送到仓库时触发。
   - `pull_request`: 当创建或更新拉取请求时触发。
   - `schedule`: 按计划执行工作流程。
   - `workflow_dispatch`: 通过 `GitHub UI` 或 `API` 手动触发。

3. `jobs`: 定义工作流程中的作业列表，每个作业可以包含一个或多个步骤。
   - `name`: 定义作业的名称。
   - `runs-on`: 指定作业运行的操作系统环境，例如 `ubuntu-latest`、`macos-latest`、`windows-latest` 等。
   - `steps`: 定义作业中的任务步骤列表。

4. `steps`: 定义作业中的任务步骤列表，每个步骤可以是一个预定义的操作或自定义的命令。
   - `name`: 定义步骤的名称。
   - `uses`: 指定要使用的预定义操作。例如 `actions/checkout@v2` 表示使用 `GitHub` 提供的 `checkout` 操作。
   - `run`: 指定要执行的自定义命令。可以是单个命令或多行脚本。

以下是一个简单的 `GitHub Actions YAML` 文件示例：

```yaml
name: CI

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v2

      - name: Install dependencies
        run: npm install

      - name: Build project
        run: npm run build

      - name: Run tests
        run: npm test
```

在这个示例中，工作流程名为 `CI`，当代码推送到 `main` 分支时触发。工作流程包含一个名为 `build` 的作业，该作业在 `ubuntu-latest` 环境中运行。作业中包含一系列步骤，依次为检出仓库、安装依赖、构建项目和运行测试。

### 总结

通过使用 `GitHub Actions`，您可以轻松地实现自动推送 `Git Tag` 的功能，并且可以从项目的 `package.json` 文件中自动提取版本号。这样，您就可以自动化管理软件包的发布流程，提高开发效率，同时确保版本控制的一致性和可追踪性。