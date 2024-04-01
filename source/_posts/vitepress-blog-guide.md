---
title: 使用VitePress搭建个人博客
date: 2024-03-29 12:20:26
tag: [vitepress, vue, blog]
---

## 使用 VitePress 搭建个人博客

随着互联网的迅猛发展，内容创作与分享已成为人们日常生活的重要组成部分。博客网站作为内容分享的重要平台，其构建工具的选择对于内容创作者来说至关重要。以前构建 `github pages` 内容博客站点，我们一般使用 `Hexo` 框架，但其构建速度相对较慢，博客风格依赖于 `hexo-theme`，大多数 `hexo-theme` 的开发都使用 `ejs` 模板引擎，不熟悉而且使用起来相对麻烦。而随着 `VitePress` 的出现，其构建速度也得到了优化，而且以 `Vite` 为基础，构建速度更快，更适合于构建博客站点，支持使用 `Vue` 进行定制化开发，很方便的创建自定义风格的博客站点。

### 简介

`VitePress` 是由 `Vue.js` 驱动的静态网站生成器，专为技术文档和博客设计。它结合了 `Vite` 的快速冷启动和 `Vue.js` 的组件化开发优势，为用户提供了一个快速、简单且优雅的博客搭建方案。使用 `VitePress` ，您可以轻松创建、发布和管理博客内容，同时还能够享受到 `Vue.js` 带来的丰富交互体验。

### 特点

1. **高效构建：** `VitePress` 利用 `Vite` 的高速构建特性，实现了快速的页面加载和实时预览功能，大大提高了内容创作的效率。
2. **Markdown支持：** `VitePress` 原生支持 `Markdown` 语法，让您能够轻松编写格式化的文章内容，无需担心排版问题。
3. **Vue.js集成：** 作为 `Vue.js` 驱动的生成器， `VitePress` 允许您在博客中嵌入 `Vue` 组件，实现丰富的交互效果和动态内容。
4. **主题定制：** `VitePress` 提供了丰富的主题选项，您可以根据自己的喜好和需求定制博客的外观风格。
5. **部署简便：** 生成的静态网站可以方便地部署到各种平台，如 `GitHub Pages` 、 `Netlify` 等，无需额外的服务器配置。

### 安装

#### 安装 `Homebrew`

`Homebrew` 是一种开源包管理器，主要用于 `macOS` 和 `Linux` 系统，可以理解为一个命令行版本的应用商店

`Homebrew` 是基于Ruby的，所以安装过程也是很简单的，把下面的代码粘贴到 `Terminal` 中执行

``` sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

查看安装是否成功:

``` sh
brew --version
```

如下图所示表示安装成功

![image](https://user-images.githubusercontent.com/8088864/30236069-ba7e712e-9544-11e7-910a-7ec04c1d5579.png)

#### 通过 `nvm` 安装指定版本的 `Node`

1. 安装 `nvm`

``` sh
brew install nvm
```

2. 配置 `nvm`

配置 `nvm` 在 `shell` 中可以使用 `nvm` 命令，修改`~/.bash_profile`文件，如果不存在，新建` .bash_profile`文件

``` sh
cd ~
vim .bash_profile
```

在文件中添加如下命令:

``` .bash_profile
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```

重新 `source`

``` sh
source .bash_profile
```

3. 安装 `Node`

``` sh
nvm ls-remote
# 安装node 18
nvm install 18
```

其他的 `nvm` 命令

``` sh
nvm ls-remote 查看 所有的node可用版本

nvm install xxx 下载你想要的版本

nvm use xxx 使用指定版本的node

nvm alias default xxx 每次启动终端都使用该版本的node
```

#### 通过 `npm` 全局安装 `VitePress`

``` sh
npm install -g vitepress
```

### 使用VitePress制作博客网站

#### 创建项目

1. 初始化个人博客项目

``` sh
mkdir my-blog
cd my-blog
npm init -y
yarn add vitepress --dev
```

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/dc34ca12-aaf2-443b-a73e-d93f217e8be7)

2. 使用 `VitePress` 命令初始化配置

设置配置文件的名称和路径，标题，描述，主题和基本配置相关信息

``` sh
vitepress init

yarn add vue --dev
```

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/d425e214-8add-4f0f-aae1-2229a47a0430)

#### 编写文章

在项目的根目录下找到一个名为docs的文件夹，这将作为你的博客内容的根目录。然后，在docs文件夹中修改以下文件：

- index.md：作为博客的主页。
- _sidebar.md：定义侧边栏的导航菜单。
- 其他以.md结尾的Markdown文件：作为博客的具体文章。

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/d3be51ea-7da3-4731-9030-523173399276)

#### 配置VitePress

在项目的根目录下找到一个名为docs的文件夹，里面存在 `.vitepress/config.mts` 的文件，用于配置 `VitePress` 的行为。以下是一个基本的配置示例：

``` js
// vitepress.config.js
module.exports = {
  title: 'HankLiu的博客小屋', // 博客的标题
  description: '努力去听风的声音，不必在意风的方向。', // 博客的描述
  themeConfig: {
    nav: [ // 导航栏配置
      { text: '主页', link: '/' },
      // 其他导航项...
    ],

    sidebar: { // 侧边栏配置
      '/': [ // 主页侧边栏
        '', // 主页链接
        // 其他文章链接...
      ],
      // 其他页面的侧边栏配置...
    },

    socialLinks: [ // 社交链接配置
      { icon: 'github', link: 'https://github.com/xxx' }
    ]
  }
  // 其他配置...
};
```

#### 启动预览

运行 `VitePress` 命令，本地启动博客预览。

``` sh
yarn docs:dev
```

这将启动一个本地开发服务器，你可以在浏览器中访问 `http://localhost:5173/` 来查看你的博客网站。

##### 报错 `getaddrinfo ENOTFOUND localhost`

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/c8d10f7c-0cc3-4e30-bea1-ab9e9f5770f0)

`getaddrinfo ENOTFOUND localhost` 错误表明 `Node.js` 在尝试解析主机名 `localhost` 对应的 `IP` 地址时失败了。这通常意味着 `localhost` 无法被解析，可能是因为 `DNS` 解析问题或者本地 `DNS` 缓存出现问题。

检查 `/etc/hosts` 文件（在 Unix-like 系统中）或 `C:\Windows\System32\drivers\etc\hosts`（在 Windows 中），确保 `localhost` 正确地指向 `127.0.0.1`

解决方法：

``` sh
sudo vim /etc/hosts
# 添加一行：127.0.0.1 localhost
sudo killall -HUP mDNSResponder
```

![image](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/805bf9c4-2e98-4333-9a2d-2faab5002d33)


#### 生成静态网站

当你的博客网站开发完成后，可以使用以下命令来构建生产版本的网站：

``` sh
yarn docs:build
```

构建完成后，`VitePress` 将在 `docs/.vitepress/dist` 文件夹中生成静态文件。你可以将这些文件部署到你选择的任何Web服务器上，或者将它们上传到诸如 `GitHub Pages` 之类的服务上。

### 结语

`VitePress` 作为一款专为内容创作者设计的博客构建工具，凭借其高效、便捷的特性，为内容创作者提供了一个理想的博客搭建方案。无论是个人博客还是企业技术文档， `VitePress` 都能够帮助您快速搭建起一个美观、实用的博客网站，让您的内容更好地传播和分享。
