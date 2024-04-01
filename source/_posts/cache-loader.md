---
title: cache-loader
date: 2023-01-10 10:10:20
tag: [webpack, loader, translate]
---

## cache-loader

`cache-loader` 允许在磁盘（默认）或数据库中缓存后续加载器的结果。

### 开始使用

要开始使用，您需要安装 `cache-loader`：

``` console
npm install --save-dev cache-loader
```

将此加载器添加到其他（耗时的）加载器前面，以便在磁盘上缓存结果。

webpack.config.js

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```

> ⚠️ 请注意，保存和读取缓存文件会有一定的开销，因此只将此加载器用于缓存耗时的加载器。


### 选项

|         名称          |                       类型                       |                        n 默认值                        | 描述                                                                                                                                                            |
| :-------------------: | :----------------------------------------------: | :-----------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **`cacheContext`**   |                    `{String}`                    |                       `undefined`                       | 允许您覆盖默认的缓存上下文，以便相对于某个路径生成缓存。默认情况下，它将使用绝对路径。                            |
|    **`cacheKey`**     |    `{Function(options, request) -> {String}}`    |                       `undefined`                       | 允许您覆盖默认的缓存键生成器。                                                                                                                     |
| **`cacheDirectory`**  |                    `{String}`                    | `findCacheDir({ name: 'cache-loader' }) or os.tmpdir()` | 提供一个缓存目录，其中应存储缓存项（用于默认的读写实现）。                                                              |
| **`cacheIdentifier`** |                    `{String}`                    |     `cache-loader:{version} {process.env.NODE_ENV}`     | 提供一个无效标识符，用于生成哈希值。您可以将其用于加载器的额外依赖项（用于默认的读写实现） |
|     **`compare`**     |      `{Function(stats, dep) -> {Boolean}}`       |                       `undefined`                       | 允许您覆盖缓存的依赖项与正在读取的依赖项之间的默认比较函数。返回 `true` 以使用缓存的资源。                   |
|    **`precision`**    |                    `{Number}`                    |                           `0`                           | 在将这些参数传递给比较函数之前，使用此毫秒数对`stats`和`dep`的`mtime`进行四舍五入。                                          |
|      **`read`**       |    `{Function(cacheKey, callback) -> {void}}`    |                       `undefined`                       | 允许您覆盖从文件中读取默认缓存数据的函数。                                                                                                               |
|    **`readOnly`**     |                   `{Boolean}`                    |                         `false`                         | 允许您覆盖默认值，并使缓存只读（在某些环境中很有用，您不希望更新缓存，而只是从中读取）。       |
|      **`write`**      | `{Function(cacheKey, data, callback) -> {void}}` |                       `undefined`                       | 允许您覆盖将默认缓存数据写入文件（例如Redis，memcached）的函数。                                                                                        |

### 示例

#### 基础

**webpack.config.js**

``` js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['cache-loader', 'babel-loader'],
        include: path.resolve('src'),
      },
    ],
  },
};
```

在基础示例中，`cache-loader` 被用于缓存对 `.js` 文件的处理结果。当文件内容发生变化时，缓存将被无效化，并且会重新处理文件。这种缓存机制可以显著提高构建速度，特别是当处理大量未更改的文件时。

#### 数据库集成

**webpack.config.js**

``` js
// 或者使用其他数据库客户端 - memcached, mongodb, ...
const redis = require('redis');
const crypto = require('crypto');

// ...
// 连接到客户端
// ...

const BUILD_CACHE_TIMEOUT = 24 * 3600; // 1天

function digest(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

// 生成自定义缓存键
function cacheKey(options, request) {
  return `build:cache:${digest(request)}`;
}

// 从数据库读取数据并解析
function read(key, callback) {
  client.get(key, (err, result) => {
    if (err) {
      return callback(err);
    }

    if (!result) {
      return callback(new Error(`Key ${key} not found`));
    }

    try {
      let data = JSON.parse(result);
      callback(null, data);
    } catch (e) {
      callback(e);
    }
  });
}

// 在cacheKey下将数据写入数据库
function write(key, data, callback) {
  client.set(key, JSON.stringify(data), 'EX', BUILD_CACHE_TIMEOUT, callback);
}

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheKey,
              read,
              write,
            },
          },
          'babel-loader',
        ],
        include: path.resolve('src'),
      },
    ],
  },
};
```

`ache-loader` 被配置为使用自定义的读取和写入函数，这些函数将数据存储在 `Redis` 数据库中。通过 `cacheKey` 函数，可以为每个请求生成一个唯一的缓存键。`read` 函数从数据库中读取缓存数据，并将其解析为 `JavaScript` 对象。`write` 函数将处理后的数据写入数据库，并设置了一个过期时间（在这种情况下为 `1` 天）。

通过这种方式，缓存数据可以在构建过程中跨多个运行实例共享，并且可以持久化存储，即使 `webpack` 构建进程重启也不会丢失。这可以进一步提高构建速度，特别是在大型项目中，并且可以在多个构建任务之间共享缓存数据。

翻译: [cache-loader](https://www.npmjs.com/package/cache-loader)