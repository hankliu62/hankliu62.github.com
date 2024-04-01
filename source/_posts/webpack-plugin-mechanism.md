---
title: Webpack Plugin插件机制
date: 2024-03-05 20:36:12
tag: [webpack, javascript]
---

## Webpack Plugin插件机制

### plugin机制出现原因

前面我们已经知道了，loader机制让webpack拥有了处理除js类型文件以外的能力。

那如果我们需要在项目中实现`打包前自动清理上次打包生成的文件`、`将一些文件复制到打包目录中`、`自动生成html文件`、`将打包产物自动上传至服务器`、`将打包后代码进行压缩、拆分`等一系列定制化功能，此时就必须借助webpack的plugin机制去实现了。

没错，webpack的plugin机制让webpack有了定制化的能力。

### plugin原理

那具体如何通过plugin机制去实现这些定制化功能呢？

其实是webpack在打包过程中的不同阶段（配置文件读取完成后、打包开始前、打包完成后等阶段）会触发不同的钩子，我们只需要明确要实现的功能应该在哪个阶段，然后将具体实现代码注册为对应钩子的事件即可。

### webpack运行原理

我们在了解这些钩子之前，必须要知道webpack的运行原理。

这是一个简化版的webpack打包过程，当我们执行 `webpack build` 命令后，webpack会先读取配置文件，然后根据配置文件中的配置项去初始化，创建一个 `compiler` 对象，然后调用 `compiler` 对象的 `run` 方法，初始化一个 `compilation` 对象，执行 `compilation` 中的 `build` 方法进行编译，编译完成后，触发 `compiler` 对象的 `done` 钩子，完成打包。

![image](https://github.com/hankliu62/interview/assets/8088864/297c753f-6432-4ecc-90f3-474459b5fd82)

``` js
//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数
function webpack(webpackOptions) {
  //第二步：用配置参数对象初始化 `Compiler` 对象
  const compiler = new Compiler(webpackOptions);
  //第三步：挂载配置文件中的插件
 const { plugins } = webpackOptions;
 for (let plugin of plugins) {
   plugin.apply(compiler);
 }
  return compiler;
}
```

``` js
//Compiler其实是一个类，它是整个编译过程的大管家，而且是单例模式
class Compiler {
  constructor(webpackOptions) {
   //省略
  }

  // 第五步：创建compilation对象
  compile(callback){
    //虽然webpack只有一个Compiler，但是每次编译都会产出一个新的Compilation，
    //这里主要是为了考虑到watch模式，它会在启动时先编译一次，然后监听文件变化，如果发生变化会重新开始编译
    //每次编译都会产出一个新的Compilation，代表每次的编译结果
    let compilation = new Compilation(this.options);
    compilation.build(callback); //执行compilation的build方法进行编译，编译成功之后执行回调
  }

  //第四步：执行`Compiler`对象的`run`方法开始执行编译
  run(callback) {
    this.hooks.run.call(); //在编译前触发run钩子执行，表示开始启动编译了
    const onCompiled = () => {
      // 第七步：当编译成功后会触发done这个钩子执行
      this.hooks.done.call();
    };
    this.compile(onCompiled); //开始编译，成功之后调用onCompiled
  }
}


class Compilation {
  constructor(webpackOptions) {
    this.options = webpackOptions;
    this.modules = []; //本次编译所有生成出来的模块
    this.chunks = []; //本次编译产出的所有代码块，入口模块和依赖的模块打包在一起为代码块
    this.assets = {}; //本次编译产出的资源文件
    this.fileDependencies = []; //本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译
  }

  //第六步：执行compilation的build方法进行编译
  build(callback) {
  //这里开始做编译工作，编译成功执行callback

  // ... 编译过程代码省略

  // 编译完成后，触发callback回调
  callback()
  }
}
```

<!-- more -->

### compiler 与 compilation

那上面提到的 `compiler` 对象和 `compilation` 对象到底是什么呢？又有什么区别与联系？

- `compiler` 对象包含了webpack的所有配置信息，包括`entry`、`output`、`module`、`plugins`等，`compiler` 对象会在启动webpack时，一次性地初始化创建，它是全局唯一的，可以简单理解为webpack的实例。
- `compilation` 对象代表一次资源的构建，通过一系列API可以访问/修改本次模块资源、编译生成的资源、变化的文件、以及被跟踪依赖的状态信息等，当我们以开发模式运行webpack时，每当检测到一个文件变化，就会创建一个新的 `compilation` 对象，所以 `compilation` 对象也是一次性的，只能用于当前的编译。

**他有以下主要属性：**

- `compilation.modules` 解析后的所有模块
- `compilation.chunks` 所有的代码分块chunk
- `compilation.assets` 本次打包生成的所有文件
- `compilation.hooks` compilation所有的钩子

所以说呢，`compiler` 代表的是整个 webpack 从启动到关闭的生命周期（终端结束，该生命周期结束）， 而 `compilation` 只是代表了一次性的编译过程，如果是watch模式，每次监听到文件变化，都会产生一个新的 `compilation`，所以 `compilation` 代表一次资源的构建，会多次被创建，而 `compiler` 只会被创建一次。

**我们了解了`compiler`和`compilation`对象后，就可以来看一下到底有哪些钩子。**

### compiler钩子
compiler有很多钩子[官方地址](https://webpack.js.org/api/compiler-hooks/#root)、[中文地址](https://webpack.docschina.org/api/compiler-hooks/)，介绍几个常用的：

- `environment` SyncHook类型，在编译器准备环境时调用，时机就在配置文件中初始化插件之后。
- `afterEnvironment` SyncHook类型，当编译器环境设置完成后，在 `environment hook` 后直接调用。
- `entryOption` SyncBailHook类型，在 `webpack` 选项中的 `entry` 被处理过之后调用。
- `afterPlugins` SyncHook类型，在插件初始化之后。
- `afterResolvers` SyncHook类型，`resolver` 设置完成之后触发。
- `beforeRun` AsyncSeriesHook类型，在开始执行一次构建之前调用，`compiler.run` 方法开始执行后立刻进行调用。
- `run` AsyncSeriesHook类型，在开始读取 `records` 之前调用。
- `watchRun` AsyncSeriesHook类型，在监听模式下，一个新的 `compilation` 触发之后，但在 `compilation` 实际开始之前触发。
- `beforeCompile` AsyncSeriesHook类型，在创建 `compilation` 参数之后执行。
- `compile` SyncHook类型，`beforeCompile` 之后立即调用，但在一个新的 `compilation` 创建之前。
- `thisCompilation` SyncHook类型，初始化 `compilation` 时调用，在触发 `compilation` 事件之前调用。
- `compilation` SyncHook类型，一次新的编译 `compilation` 创建之后触发。
- `make` AsyncParallelHook类型，`compilation` 结束之前执行，`seal` 之前执行。
- `afterCompile` AsyncSeriesHook类型，`compilation` 结束和封印之后执行。
- `shouldEmit` SyncBailHook类型，在输出 `asset` 之前调用。返回一个布尔值，告知是否输出。
- `emit` AsyncSeriesHook类型，生成资源到 `output` 目录之前触发。
- `afterEmit` AsyncSeriesHook类型，输出 `asset` 到 `output` 目录之后执行。
- `done` AsyncSeriesHook类型，`compilation` 编译完成后触发。
- `failed` SyncHook类型，`compilation` 编译失败后触发。

### compilation钩子

compilation对象也有很多钩子[官方地址](https://webpack.js.org/api/compilation-hooks/#root)、[中文地址](https://webpack.docschina.org/api/compilation-hooks/)，介绍几个常用的：

- `buildModule` SyncHook类型，模块开始编译前，执行该钩子，可以用于修改模块内容。
- `succeedModule` SyncHook类型，模块编译成功后，执行该钩子。
- `finishModules` AsyncSeriesHook类型，所有模块编译完成后，执行该钩子。
- `moduleAsset` SyncHook类型，一个模块中的一个 asset 被添加到 compilation 时调用。
- `chunkAsset` SyncHook类型，一个 chunk 中的 asset 被添加到 compilation 时调用。
- `seal` SyncHook类型，在构建过程封存前触发，允许在最终资源生成之前进行一些操作。
- `optimize` SyncHook类型，优化阶段开始时触发，可以用于自定义资源优化逻辑。
- `optimizeAssets` AsyncSeriesHook类型，优化存储在 compilation.assets 中的所有 asset，可以监听和修改资源的优化过程。
- `afterOptimizeAssets` SyncHook类型，asset 已经优化。
- `optimizeTree` AsyncSeriesHook类型，在优化依赖树之前触发，允许修改资源树的优化逻辑。
- `afterOptimizeTree` SyncHook类型，在优化依赖树之后触发，可用于处理优化完成后的资源树。
- `optimizeChunkAssets` AsyncSeriesHook类型，优化所有 chunk asset，弃用，可使用 processAssets 来代替，可用于自定义块资源的优化逻辑。
- `processAssets` AsyncSeriesHook类型，asset 处理时触发，可以监听和修改资源的生成。
- `beforeHash` SyncHook类型，在 compilation 添加哈希（hash）之前。
- `afterHash` SyncHook类型，在 compilation 添加哈希（hash）之后。
- `beforeModuleAssets` SyncHook类型，在创建模块 asset 之前执行，可用于在模块资源生成前执行一些操作。

每个钩子都有对应的类型，那这些类型有什么区别呢？

## Tapable

[Tapable](https://github.com/webpack/tapable)是一个提供**事件发布订阅**的工具，通过其提供的一系列钩子，我们可以注册事件，然后在不同的阶段去触发这些注册的事件。 webpack的plugin机制正是基于 Tapable 实现的，在不同编译阶段触发不同的钩子。

Tapable 官方文档提供了这九种钩子，也就是我们上面提到的钩子类型：

``` js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```

可以看到，这些钩子有两种开头，分别是 `Sync` 和 `Async` ，这两种钩子的区别是： `Sync` 开头的为同步钩子，表示注册的事件函数会同步进行执行；`Async` 开头的为异步钩子，表示注册的事件函数会异步进行执行

同时呢，这些钩子还有三种结尾，分别是`Hook`、`BailHook`、`WaterfallHook`、`LoopHook`，

这三种结尾的区别是如下所示

- `Hook`结尾的为普通钩子，只会按顺序挨个执行注册的事件，不会去管事件函数的返回值是什么。

![image](https://github.com/hankliu62/interview/assets/8088864/dec8ff7b-7561-4d15-b96f-54c6bde1a4ab)

- `BailHook`结尾的为保险钩子，只要注册的事件函数有一个返回值不为`undefined`，就会停止执行后面的事件函数。

![image](https://github.com/hankliu62/interview/assets/8088864/ae6043a5-e389-4c3c-beb7-d56e30bdf1f5)

- `WaterfallHook`结尾的为瀑布钩子，注册的事件函数会按顺序执行，每个事件函数的返回值会作为下一个事件函数的参数，只会影响下一个事件函数的第一个参数。

![image](https://github.com/hankliu62/interview/assets/8088864/8e03fb89-5b75-4100-aeb9-bd35fa261143)

- `LoopHook`结尾的为循环钩子，注册的事件函数会按顺序执行，只要执行的事件返回值非`undefined`，就会立即重头开始执行，直到所有的事件函数都返回`undefined`，这个钩子才会结束。

![image](https://github.com/hankliu62/interview/assets/8088864/c4944703-5add-4ca1-8cb8-34e867b1f2b7)

接下来，我们又发现，异步钩子又是以`AsyncParallel`、`AsyncSeries`开头，这又有什么区别呢？

- `AsyncSeries` 为异步串行钩子，注册的事件函数会按顺序挨个执行，每个事件函数执行完后，会调用回调函数，然后再执行下一个事件函数。
- `AsyncParallel` 为异步并行钩子，注册的事件函数会同时执行，不会等待上一个事件函数执行完毕后再执行下一个事件函数。

下面我们就来讲一下这些钩子如何去使用。

### Tapable同步钩子

同步钩子只需要调用 `tap` 方法注册事件，然后调用 `call` 方法触发事件即可。

#### 1. SyncHook

SyncHook 是一个同步的、普通类型的 Hook，注册的事件函数会按顺序挨个执行，不会去管事件函数的返回值是什么。

``` js
const { SyncHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new SyncHook(['name', 'age']);

// 注册事件1
hook.tap('事件1', (name, age) => {
  console.log('事件1执行:', name, age);
});

// 注册事件2
hook.tap('事件2', (name, age) => {
  console.log('事件2执行:', name, age);
});

// 触发事件，传入实参
hook.call('前端', 18);

// 执行结果
// 事件1执行: 前端 18
// 事件2执行: 前端 18
```

#### 2. SyncBailHook

SyncBailHook 是一个同步的、保险类型的 Hook，意思是只要其中一个有返回了，后面的就不执行了。

``` js
const { SyncBailHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new SyncBailHook(['name', 'age']);

// 注册事件1
hook.tap('事件1', (name, age) => {
  console.log('事件1执行:', name, age);
});

// 注册事件2
hook.tap('事件2', (name, age) => {
  console.log('事件2执行:', name, age);
  return 'abc'
});

// 注册事件3
hook.tap('事件3', (name, age) => {
  console.log('事件3执行:', name, age);
});

// 触发事件，传入实参
hook.call('前端', 18);

// 执行结果
// 事件1执行: 前端 18
// 事件2执行: 前端 18
```

#### 3. SyncWaterfallHook

SyncWaterfallHook 是一个同步的、瀑布类型的 Hook，上一个的返回值会作为下一个的参数,只会影响下一个事件函数的第一个参数。

``` js
const { SyncWaterfallHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new SyncWaterfallHook(['name', 'age']);

// 注册事件1
hook.tap('事件1', (name, age) => {
  console.log('事件1执行:', name, age);
  return '驿站'
});

// 注册事件2
hook.tap('事件2', (name, age) => {
  console.log('事件2执行:', name, age);
});

// 注册事件3
hook.tap('事件3', (name, age) => {
  console.log('事件3执行:', name, age);
});

// 触发事件，传入实参
hook.call('前端', 18);

// 执行结果
// 事件1执行: 前端 18
// 事件2执行: 驿站 18
// 事件3执行: 驿站 18
```

#### 4. SyncLoopHook

SyncLoopHook 是一个同步的、循环类型的 Hook，只要执行的事件函数返回值非undefeind，就会立即重头开始执行，直到所有的事件函数都返回undefined，这个钩子才会结束。

``` js
const { SyncLoopHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new SyncLoopHook();

let count = 5;

// 注册事件1
hook.tap('事件1', () => {
  count--;
  console.log('事件1执行,count为',count);
  if (count > 3) {
    return true;
  }
});

// 注册事件2
hook.tap('事件2', () => {
  count--;
  console.log('事件2执行,count为',count);
  if (count > 1) {
    return true;
  }
});

// 注册事件3
hook.tap('事件3', () => {
  console.log('事件3执行,count为',count);
});

// 触发事件
hook.call();

// 执行结果
// 事件1执行,count为 4
// 事件1执行,count为 3
// 事件2执行,count为 2
// 事件1执行,count为 1
// 事件2执行,count为 0
// 事件3执行,count为 0
```

### Tapable异步钩子

异步钩子提供三种注册的方法：

- `tap`：以同步方式注册钩子，用 `call` 来触发，跟同步钩子一样，只不过加持了异步的能力，不过多讲解。
- `tapAsync`: 以异步方式注册钩子，用 `callAsync` 触发，同时也会多一个callback参数，执行callback告诉hook该注册事件已经执行完成，下面有使用示例。
- `tapPromise`: 以异步方式注册钩子，用 `promise` 的方式触发,下面有使用示例。

#### 1. AsyncParallelHook

AsyncParallelHook 是一个异步的、并行类型的 Hook，注册的事件函数会同时执行，不会等待上一个事件函数执行完毕后再执行下一个事件函数。

``` js
const { AsyncParallelHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new AsyncParallelHook(['name', 'age']);

// 注册事件1
hook.tapAsync('事件1', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件1执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback();
  }, 2000);
});

// 注册事件2
hook.tapAsync('事件2', (name, age, callback) => {
  console.log('事件2执行:', name, age);
  // 调用callback，表示该事件执行完毕
  callback();
});

// 注册事件3
hook.tapAsync('事件3', (name, age, callback) => {
  console.log('事件3执行:', name, age);
  // 调用callback，表示该事件执行完毕
  callback();
});

// 触发事件，传入实参
hook.callAsync('前端', 18, () => {
  // 该钩子注册的所有事件执行完毕后，会执行该回调
  console.log('该钩子所有事件执行完毕');
});

// 执行结果
// 事件2执行: 前端 18
// 事件3执行: 前端 18
// 2秒后输出：事件1执行: 前端 18
// 该钩子所有事件执行完毕
```

#### 2. AsyncParallelBailHook

AsyncParallelBailHook 是一个异步、并行的、保险类型的 Hook，只要其中一个有返回了，后面的就不执行了。

``` js
const { AsyncParallelBailHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new AsyncParallelBailHook(['name', 'age']);

// 注册事件1
hook.tapPromise('事件1', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('事件1执行:', name, age);
      resolve('123');
    }, 2000);
  })
});

// 注册事件2
hook.tapPromise('事件2', (name, age) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('事件2执行:', name, age);
      resolve();
    }, 3000);
  })
});

// 注册事件3
hook.tapPromise('事件3', (name, age, callback) => {
  return new Promise((resolve) => {
    console.log('事件3执行:', name, age);
    resolve();
  })
});

// 触发事件，传入实参
hook.promise('前端', 18).then((res) => {
  // 该钩子注册的所有事件执行完毕后，会执行该回调
  console.log('该钩子所有事件执行完毕',res);
})

// 执行结果
// 事件3执行: 前端 18
// 2秒后输出：事件1执行: 前端 18
// 该钩子所有事件执行完毕123
```

#### 3. AsyncSeriesHook

AsyncSeriesHook 是一个异步的、串行类型的 Hook，注册的事件函数会按顺序挨个执行，每个事件函数执行完后，会调用回调函数，然后再执行下一个事件函数。

``` js
const { AsyncSeriesHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new AsyncSeriesHook(['name', 'age']);

// 注册事件1
hook.tapAsync('事件1', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件1执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback(null, '123');
  }, 4000);
});

// 注册事件2
hook.tapAsync('事件2', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件2执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback();
  }, 3000);
});

// 注册事件3
hook.tapAsync('事件3', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件3执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback();
  }, 2000);
});

// 触发事件，传入实参
hook.callAsync('前端', 18, (err, result) => {
  // 最后结束的事件调用的callback会传入两个参数，第一个参数为错误信息，第二个参数为返回值
  console.log('该钩子所有事件执行完毕',result);
});

// 执行结果
// 事件3执行: 前端 18
// 事件2执行: 前端 18
// 事件1执行: 前端 18
// 该钩子所有事件执行完毕123
```

#### 4. AsyncSeriesBailHook

AsyncSeriesBailHook 是一个异步的、串行的、保险类型的 Hook，只要其中一个有返回了，后面的就不执行了。

``` js
const { AsyncSeriesBailHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new AsyncSeriesBailHook(['name', 'age']);

// 注册事件1
hook.tapAsync('事件1', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件1执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback();
  }, 4000);
});

// 注册事件2
hook.tapAsync('事件2', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件2执行:', name, age);
    callback(null, "88717");
  }, 3000);
});

// 注册事件3
hook.tapAsync('事件3', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件3执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback();
  }, 2000);
});

// 触发事件，传入实参
hook.callAsync('前端', 18, (err, result) => {
  // 最后结束的事件调用的callback会传入两个参数，第一个参数为错误信息，第二个参数为返回值
  console.log('该钩子所有事件执行完毕',result);
});

// 执行结果
// 事件3执行: 前端 18
// 事件2执行: 前端 18
// 该钩子所有事件执行完毕88717
```

#### 5. AsyncSeriesWaterfallHook

AsyncSeriesWaterfallHook 是一个异步的、串行的、瀑布类型的 Hook，上一个的返回值会作为下一个的参数,只会影响下一个事件函数的第一个参数。

``` js
const { AsyncSeriesWaterfallHook } = require('tapable');

// 初始化钩子，定义形参
const hook = new AsyncSeriesWaterfallHook(['name', 'age']);

// 注册事件1
hook.tapAsync('事件1', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件1执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback(null,3);
  }, 4000);
});

// 注册事件2
hook.tapAsync('事件2', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件2执行:', name, age);
    callback(null, 2);
  }, 3000);
});

// 注册事件3
hook.tapAsync('事件3', (name, age, callback) => {
  setTimeout(() => {
    console.log('事件3执行:', name, age);
    // 调用callback，表示该事件执行完毕
    callback(null, 1);
  }, 2000);
});

// 触发事件，传入实参
hook.callAsync('前端', 18, (err, result) => {
  // 最后结束的事件调用的callback会传入两个参数，第一个参数为错误信息，第二个参数为返回值
  console.log('该钩子所有事件执行完毕',result);
});

// 执行结果
// 事件3执行: 前端 18
// 事件2执行: 1 18
// 事件1执行: 2 18
// 该钩子所有事件执行完毕3
```

### 如何自定义plugin

了解Tapable之后，我们就可以学习如何自定义plugin了。

webpack 插件由以下几部分组成：

- 一个 `JavaScript` 类 一个构造方法，可以接受一个 `options` 对象参数
- 一个 `apply` 方法，该方法在 `webpack` 装载这个插件的时候被调用，并且会传入 `compiler` 对象
根据我们的需求，确定要在哪个阶段挂载到哪个钩子上，根据钩子的类型（同步/异步），选择合适的事件注册方式，将需求实现代码注册为事件。

事件回调中具体有哪些参数，需要根据钩子的类型去官网查看[官方地址](https://webpack.js.org/api/compiler-hooks/#root)、[中文地址](https://webpack.docschina.org/api/compiler-hooks/)，这里就不一一列举了。

> 注意 ： webpack4 可以用 plugin方法来注册插件，webpack5之后被取消了。
> compiler.plugin('emit', function (compilation, cb) {})

``` js
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置项
  constructor(options){
    this.options = options;
  }

  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler) {
    // 注册第1个事件, 这个事件名叫什么都无所谓，只是个标示而已
    compiler.hooks.run.tapAsync('BasicPlugin', (compiler, callback) => {
      console.log('以异步方式触及 run 钩子。')
      callback()
    })

    // 注册第2个事件
    // 在compiler的compilation钩子上注册一个事件BasicPlugin
    compiler.hooks.compilation.tap('BasicPlugin', (compilation) => {
      // 测试compilation对象在模块构建之前能得到什么
      compilation.hooks.buildModule.tap('BasicPlugin', (data) => {
          console.log(data);
      })
    })

    // 注册第3个事件
    compiler.hooks.emit.tap('BasicPlugin', (compilation) => {
      // 业务逻辑代码
    });
  }
}

module.exports = BasicPlugin;
```

``` js
// webpack.config.js
const path = require('path');
const BasicPlugin = require('./BasicPlugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new BasicPlugin(),
  ]
}
```


### 自定义plugin实战

为了更好的实践，给大家提供3个自定义插件来参考。

#### 1. FileListPlugin

需求：在打包完成后，生成一个`fileList.md`文件，文件内容为打包生成的所有文件名。

```
# 一共有2个文件

- main.bundle.js
- index.html
```

代码实现

``` js
function FileListPlugin (options) {
  this.options = options || {};
  this.filename = this.options.filename || 'fileList.md'
}

FileListPlugin.prototype.apply = function (compiler) {
  // 1.通过compiler.hooks.emit.tapAsync()来触发生成资源到output目录之前的钩子，且回调函数会有两个参数，一个是compilation，一个是cb回调函数
  compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
    // 2.要生成的markdown文件的名称
    const fileListName = this.filename;
    // 3.通过compilation.assets获取到所有待生成的文件，这里是获取它的长度
    let len = Object.keys(compilation.assets).length;
    // 4.定义markdown文件的内容，也就是先定义一个一级标题，\n表示的是换行符
    let content = `# 一共有${len}个文件\n\n`;
    // 5.将每一项文件的名称写入markdown文件内
    for (let filename in compilation.assets) {
      content += `- ${filename}\n`
    }
    // 6.给我们即将生成的dist文件夹里添加一个新的资源，资源的名称就是fileListName变量
    compilation.assets[fileListName] = {
      // 7.写入资源的内容
      source: function () {
        return content;
      },
      // 8.指定新资源的大小，用于webpack展示
      size: function () {
        return content.length;
      }
    }
    // 9.由于我们使用的是tapAsync异步调用，所以必须执行一个回调函数cb，否则打包后就只会创建一个空的dist文件夹。
    cb();
  })
}
module.exports = FileListPlugin;
module.exports = {
  new FileListPlugin({
    filename: 'fileList.md'
  })
}
```

#### 2. CompressAssetsPlugin

需求：每次打包完成后，将打包生成的文件生成一个压缩包。

``` js
const JSZip = require('jszip');
const { RawSource } = require('webpack-sources');
/*
  将本次打包的资源都打包成为一个压缩包
  需求:获取所有打包后的资源
*/

const pluginName = 'CompressAssetsPlugin';

class CompressAssetsPlugin {
  constructor({ output }) {
    this.output = output;
  }

  apply(compiler) {
    // AsyncSeriesHook 将 assets 输出到 output 目录之前调用该钩子
    compiler.hooks.emit.tapAsync(pluginName, (compilation, callback) => {
      // 创建zip对象
      const zip = new JSZip();
      // 获取本次打包生成所有的assets资源
      const assets = compilation.getAssets();
      // 循环每一个资源
      assets.forEach(({ name, source }) => {
        // 调用source()方法获得对应的源代码 这是一个源代码的字符串
        const sourceCode = source.source();
        // 往 zip 对象中添加资源名称和源代码内容
        zip.file(name, sourceCode);
      });
      // 调用 zip.generateAsync 生成 zip 压缩包
      zip.generateAsync({ type: 'nodebuffer' }).then((result) => {
        // 通过 new RawSource 创建压缩包
        // 并且同时通过 compilation.emitAsset 方法将生成的 Zip 压缩包输出到 this.output
        compilation.emitAsset(this.output, new RawSource(result));
        // 调用 callback 表示本次事件函数结束
        callback();
      });
    });
  }
}

module.exports = CompressAssetsPlugin;
```

#### 3. BundleSizeWebpackPlugin

需求：文件超过一定大小时给出警告

``` js
const { resolve } = require('path')
const fs = require('fs')

class BundleSizeWebpackPlugin {
  constructor(options) {
    this.options = options
  }
  apply(compiler) {
    const { sizeLimit } = this.options
    console.log('bundle size plugin')
    // 在编译完成后，执行回调，拿到打包后文件路径，然后读取文件信息获取文件大小，然后定义一些逻辑
    compiler.hooks.done.tap('BundleSizePlugin', stats => {
      const { path, filename } = stats.compilation.outputOptions
      const bundlePath = resolve(path, filename)
      const { size } = fs.statSync(bundlePath)
      const bundleSize = size / 1024
      if (bundleSize < sizeLimit) {
        console.log(
          'safe: bundle-size',
          bundleSize,
          '\n size limit: ',
          sizeLimit
        )
      } else {
        console.warn(
          'unsafe: bundle-size',
          bundleSize,
          '\n size limit: ',
          sizeLimit
        )
      }
    })
  }
}

module.exports = BundleSizeWebpackPlugin
```

### 常用插件

目前，webpack社区已经有很多成熟的插件了，如果非特殊需求，不用自定义插件。下面介绍几个常用的插件。

#### 1. html-webpack-plugin

`html-webpack-plugin`可以在打包结束后，自动生成一个html文件，并把打包生成的js自动引入到这个html文件中。

``` js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '/index.html'),
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true, // 压缩内联css
      },
      inject: true,
    }),
  ]
}
```

**inject 有四个选项值**

- `true`：默认值，*script* 标签位于 *html* 文件的 *body* 底部
- `body`：*script* 标签位于 *html* 文件的 *body* 底部（同 *true*）
- `head`：*script* 标签位于 *head* 标签内
- `false`：不插入生成的 *js* 文件，只是单纯的生成一个 *html* 文件

#### 2. clean-webpack-plugin

`clean-webpack-plugin` 用于在打包前清理上一次项目生成的 `bundle` 文件，它会根据 `output.path` 自动清理文件夹。

``` js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '/index.html'),
    }),
    new CleanWebpackPlugin(), // 所要清理的文件夹名称
  ]
}
```

#### 3. extract-text-webpack-plugin

将css样式从js文件中提取出来最终合成一个css文件，该插件只支持webpack4之前的版本，如果你当前是webpack4及以上版本那么就会报错。

``` js
const extractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      }
    ]
  },
  plugins: [
    new extractTextPlugin({
      filename: "[name].css",
      allChunks: true
    })
  ]
}
```

#### 4. mini-css-extract-plugin

该插件与上面的`extract-text-webpack-plugin`的一样，都是将css样式提取出来, 唯一就是用法不同，本插件的webpack4版本之后推荐使用。

``` js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader"
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[name].css"
    })
  ]
}
```

#### 5. purifycss-webpack

有时候我们 css 写得多了或者重复了，这就造成了多余的代码，我们希望在生产环境进行去除。

``` js
const path = require('path')
const PurifyCssWebpack = require('purifycss-webpack') // 引入PurifyCssWebpack插件
const glob = require('glob') // 引入glob模块,用于扫描全部html文件中所引用的css

module.exports = merge(common, {
  plugins: [
    new PurifyCssWebpack({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    }),
  ],
})
```

#### 6. optimize-css-assets-webpack-plugin

`optimize-css-assets-webpack-plugin` 用于优化和最小化 css 的插件，它会压缩 css，但是不会像 cssnano 那样移除或合并样式。

``` js
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") // 压缩css代码

module.exports = {
  optimization: {
    minimizer: [
      // 压缩css
      new OptimizeCSSAssetsPlugin({})
    ]
  }
}
```

#### 7. DefinePlugin

用于注入全局变量，一般用在环境变量上。无需安装，webpack内置

``` js
const Webpack = require("webpack")
module.exports = {
  plugins: [
    new Webpack.DefinePlugin({
      STR: JSON.stringify("蛙人"),
      "process.env": JSON.stringify("dev"),
      name: "蛙人"
    })
  ]
}
```

#### 8. copy-webpack-plugin

`copy-webpack-plugin` 用于在 webpack 中拷贝文件和文件夹，比如我们需要把一些静态文件拷贝到打包目录，这时候就可以使用这个插件。

``` js
const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/js/*.js',
          to: path.resolve(__dirname, 'dist', 'js'),
          flatten: true,
        },
      ],
    }),
  ],
}
```

#### 9. imagemin-webpack-plugin

用于压缩图片。

``` js
const ImageminPlugin =  require('imagemin-webpack-plugin').default
module.exports = {
  plugins: [
    new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i
    })
  ]
}
```


来源：https://zhuanlan.zhihu.com/p/661670534
