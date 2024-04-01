---
title: thread-loader
date: 2023-02-23 10:10:20
tag: [webpack, loader, translate]
---

## thread-loader

`thread-loader` 是一种在 `worker` 池中运行以下 `loader` 的工具。

### 开始使用

通过 npm、yarn 或 pnpm 安装：

``` bash
npm install --save-dev thread-loader
```

或者

``` bash
yarn add -D thread-loader
```

或者

``` bash
pnpm add -D thread-loader
```

将其放在其他 `loader` 的前面，以下 `loader` 将在 `worker` 池中运行。

在 `worker` 池中运行的 `loader` 有一些限制。例如：

- `loader` 不能发射文件。
- `loader` 不能使用自定义 `loader API`（即插件）。
- `loader` 不能访问 `webpack` 配置项。

每个 `worker` 是一个单独的 `node.js` 进程，启动一个 `worker` 大约需要 600ms 的时间。此外，进程间通信也存在一定的开销。

因此，仅将此 `loader` 用于计算密集型操作！

### 示例

#### webpack.config.js

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve('src'),
        use: [
          'thread-loader',
          // 你的计算密集型 loader（例如 babel-loader）
        ],
      },
    ],
  },
};
```

#### 带有选项

``` js
use: [
  {
    loader: 'thread-loader',
    // 选项相同的 loader 将共享 worker 池
    options: {
      // 生成的 worker 数量，默认为（CPU 核心数 - 1）或当 require('os').cpus() 未定义时回退到 1
      workers: 2,

      // 一个 worker 并行处理的 job 数量
      // 默认为 20
      workerParallelJobs: 50,

      // 额外的 node.js 参数
      workerNodeArgs: ['--max-old-space-size=1024'],

      // 允许重新生成已死亡的 worker 池
      // 重新生成会减慢整个编译速度
      // 在开发环境中应将其设置为 false
      poolRespawn: false,

      // 当空闲时杀死 worker 进程的超时时间
      // 默认为 500 (ms)
      // 对于保持 worker 存活的监视构建，可以设置为 Infinity
      poolTimeout: 2000,

      // 池分配给 worker 的工作数量
      // 默认为 200
      // 降低这个数值会降低总体的效率，但是会提升工作分布更均一
      poolParallelJobs: 50,

      // 池的名称
      // 可以修改名称来创建其余选项都一样的池
      name: "my-pool"
    },
  },
  // 耗时的 loader（例如 babel-loader）
];
```

### 预热

为了防止在启动 `worker` 时出现高延迟，可以预热 `worker` 池。

这将启动池中的最大 `worker` 数量，并将指定的模块加载到 `node.js` 模块缓存中。

``` js
const threadLoader = require('thread-loader');

threadLoader.warmup(
  {
    // 池选项，像传递给 loader 选项那样
    // 必须匹配 loader 选项以启动正确的池
  },
  [
    // 要加载的模块
    // 可以是任何模块，例如
    'babel-loader',
    'babel-preset-es2015',
    'sass-loader',
  ]
);
```

翻译: [thread-loader](https://www.npmjs.com/package/thread-loader)