---
title: NextJs 获取 Github Action 部署的环境变量
date: 2024-01-12 21:51:20
tag: [git, github, blog]
---

## NextJs 获取 Github Action 部署的环境变量

### 设置变量

项目中需要某些私有密钥，不能直接暴露在仓库中，在编译`Next.js`的时候，需要将该密钥通过环境变量的形式注入到`Next.js`项目中，所以第一步，我们需要将这个密钥储存到当前仓库的`Settings/Secrets`里面，具体操作如下图所示：

![image](https://github.com/hankliu62/interview/assets/8088864/887a0ad5-6b4a-4977-a2cb-8c7adc5b63b6)

### 配置变量

在`Next.js`中获取`GitHub Actions`环境变量，你可以使用`process.env`对象来访问在`GitHub Actions`中设置的环境变量。以下是一个如何在`Next.js`中获取`GitHub Actions`环境变量的例子：

首先，在GitHub Actions的工作流文件中设置环境变量，例如在 `.github/workflows/ci.yml`中：

``` yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 14
      - name: Install Dependencies
        run: npm install
      - name: Build Next.js App
        env:
          MY_ENV_VAR: ${{ secrets.MY_SECRET_ENV_VAR }}
        run: npm run build
```

在这个例子中，`MY_ENV_VAR`是一个环境变量，它可以是一个秘密值，通过`GitHub Actions`的秘密（secrets）功能来安全地设置。

然后，需要将环境变量添加到 `Next` 项目的配置文件中，在 `next.config.js` 中：

``` js
module.exports = {
  env: {
    MY_ENV_VAR: process.env.MY_ENV_VAR,
  }
}
```

### 获取变量

然后，在Next.js的应用代码中，你可以这样获取这个环境变量：

``` js
// pages/index.js
export default function Home() {
  const myEnvVar = process.env.MY_ENV_VAR;
  return (
    <div>
      <p>The environment variable is: {myEnvVar || 'undefined'}</p>
    </div>
  );
}
```

在这段代码中，`process.env.MY_ENV_VAR` 将会获取在 `GitHub Actions` 中设置的环境变量`MY_ENV_VAR`的值。如果环境变量存在，它将被显示在页面上；如果不存在，则会显示`'undefined'`。