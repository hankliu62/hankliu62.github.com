---
title: TypeScript 配置详解
date: 2024-05-12 08:12:06
tag: [typescript]
---

## TypeScript 配置详解

TypeScript 是一种由微软开发的开源编程语言，它是 JavaScript 的一个超集，添加了可选的静态类型和基于类的面向对象编程。

在 TypeScript 项目中，`tsconfig.json` 是一个用于配置 TypeScript 编译器的配置文件。通过配置 `tsconfig.json` 文件，我们可以指定编译器如何处理 TypeScript 代码，并设置一些编译选项来满足项目的需求。

以下是一个典型的 `tsconfig.json` 配置示例，我们将逐个字段进行详细解释：

```json
{
  /* 通用编译选项 */
  "compilerOptions": {
    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', 'react' or 'react-jsx'等
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件作为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any 类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  },
  /* 其他配置选项 */
  "include": ["src/**/*.ts"],                // 需要编译的文件路径
  "exclude": ["node_modules", "dist"],        // 不需要编译的文件路径
  "extends": "./base.tsconfig.json",          // 继承另一个配置文件
  "references": [{ "path": "./packages/core" }]  // 引用其他 TypeScript 项目
}
```

现在，让我们详细了解每个配置选项的含义和可选值。

### compilerOptions 字段

- `target`: 编译后的 JavaScript 目标版本。可选值包括 `"es3"`, `"es5"`, `"es6"/"es2015"`, `"es2016"`, `"es2017"`, `"es2018"`, `"es2019"`, `"es2020"`, `"esnext"`。

- `module`: 生成模块代码的模块系统。可选值包括 `"commonjs"`, `"amd"`, `"system"`, `"umd"`, `"es2015"`。

- `lib`: 编译时需要引入的库文件。例如，`["es5", "dom", "es2015.promise"]` 表示编译时将引入 ES5、DOM 和 Promise 相关的库文件。

- `allowJs`: 允许编译 JavaScript 文件。设置为 `true` 表示允许编译 JavaScript 文件。

- `checkJs`: 对 JavaScript 文件进行类型检查。设置为 `true` 表示在编译 JavaScript 文件时进行类型检查。

- `jsx`: 支持 JSX 语法，并指定 JSX 转换方式。可选值包括  `"preserve"`, `"react"`, `"react-native"`, `"react-jsx"`, `"react-jsxdev"`, `"react-native"`, `"react-native-svg"`等。

- `declaration`: 生成对外部使用者的声明文件。设置为 `true` 表示生成 `.d.ts` 文件。

- `sourceMap`: 生成源映射文件。设置为 `true` 表示生成 `.map` 文件。

- `outDir`: 编译输出目录。指定编译后的 JavaScript 文件的输出目录。

- `rootDir`: 源代码根目录。用来控制输出目录结构。

- `removeComments`: 删除生成文件中的注释。设置为 `true` 表示删除编译后的所有注释。

- `noEmit`: 不生成编译结果。设置为 `true` 表示不生成输出文件。

- `strict`: 启用所有严格类型检查选项。设置为 `true` 表示启用所有严格类型检查选项。

### 2. include 和 exclude 字段

include 和 exclude 字段用于指定要包含和排除的文件或目录。它们可以是字符串或字符串数组。例如：

```json
"include": ["src/**/*"],
"exclude": ["node_modules", "**/*.spec.ts"]
```

### 3. extends 字段

extends 字段用于继承另一个配置文件的设置。例如：

```json
"extends": "./baseConfig.json"
```

### 4. files 和 references 字段

files 字段用于显式地指定要编译的文件列表。references 字段用于指定项目之间的引用关系。例如：

```json
"files": ["src/main.ts"],
"references": [{ "path": "../otherProject" }]
```

以上是 TypeScript 中 `tsconfig.json` 配置文件的详细解释和说明。根据项目的需要，可以灵活配置编译选项，以满足项目的需求。

### TypeScript 编译

好的 `IDE` 支持对 `TypeScript` 的即时编译。但是，如果你想在使用 `tsconfig.json` 时从命令行手动运行 `TypeScript` 编译器，你可以通过以下方式：

- 运行 `tsc`，它会在当前目录或者是父级目录寻找 `tsconfig.json` 文件。
- 运行 `tsc -p ./path-to-project-directory`。当然，这个路径可以是绝对路径，也可以是相对于当前目录的相对路径。

你甚至可以使用 `tsc -w` 来启用 `TypeScript` 编译器的观测模式，在检测到文件改动之后，它将重新编译。

### 总结

通过对 tsconfig.json 配置文件的详细解释，我们可以更好地理解和配置 TypeScript 项目。合理地配置 tsconfig.json 可以提高项目的开发效率和代码质量，使得 TypeScript 的强大功能得以充分发挥。希望本文能够帮助读者更加深入地了解 TypeScript 的配置选项和使用方法。