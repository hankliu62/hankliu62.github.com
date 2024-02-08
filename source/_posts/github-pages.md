---
title: 使用 Github Pages 和 Issues 搭建博客
---

## Github Pages 简介

自己维护博客服务器，需要购买服务器，配置域名等一些列操作，比较繁琐，索性直接找个现成的稳定的博客平台，github pages成为首选，这里有几个思路

- 使用github pages，编写静态网页
- 使用github pages 与静态网页生成工具，需要本地电脑编写文章
- 使用github pages 与自建后端服务器，需要另外维护一个后端服务器
- 使用issues 写文章，issues页面就是一个博客网站
- 使用github pages 与 github api，使用issues写文章

### 使用github pages，编写静态网页
有很多文档网站是使用这种方式搭建，一般是作为demo页面或者单页文档页面，否则页面稍微一复杂，就变得非常难以维护

### 使用github pages 与 静态网页生成工具

有很多博客网站与文档网站都是使用这种方式，这是一种最简单最方便的方式，现在流行的工具有 `hexo` 和 `Jekyll` 等，这种方式还要在本地维护一个仓库，生成静态页面后再上传，操作过于繁琐，而且每个页面之间切换都需要重新载入所有资源，网页数据传输量较大

具体工具如下所示:

- [hexo](https://github.com/hexojs/hexo)
- [Jekyll](https://github.com/jekyll/jekyll)

### 使用github pages 与 自建后端服务器
在github pages编写一个单页面应用，数据通过跨域请求来自于自建的服务器，这种方式有三大难点：前端、后端、服务器

**前端**

需要编写一个单页面应用，这对技术需要一定的水平，基本很少有开源工具

**后端**

需要后端服务，这可以使用现成工具提供api，比如wordpress、drupal、ghost等

### 使用issues 写文章

这种方式简单粗暴，直接在issues写文章，评论、标签、提醒神马的都有了，现在其实很流行这种方式，看看这几个博客，都几千个star了

- https://github.com/tmallfe/tmallfe.github.io
- https://github.com/xufei/blog
- https://github.com/fouber/blog

要说它的缺点嘛，就是人人都可以往你博客提交文章，界面千篇一律，而且也不怎么好看

**服务器**

这个问题很严重，问题来了，你都有自建的服务器了，还要用github pages干嘛呢，哪天自建服务器挂了，博客照样挂。

这种方式可以使用域名来提升逼格。

### 使用github pages 与 github api

这种方案与上一种对比起来其实没多大区别，唯一的区别就是自建服务换成了github的另一个服务，就是说，github帮我们建好了。
github api：https://developer.github.com/v3/

#### github pages
github Pages可以被认为是用户编写的、托管在github上的静态网页，如下方式可开启：

当仓库名称为`{username}.github.io`时自动生成github page首页，页面地址为 `http://{username}.github.io`
当仓库中有 `gh-pages`分支时会自动生成github pages，访问地址为：`http://{username}.github.io/{reponame}`

#### github api
github 提供了一系列api可让用户操作数据，详细内容可到[api官网](https://docs.github.com/zh/rest)查看

#### github pages + github api搭建博客
现在讲解实现github pages + github api的思路，首先我们需要一个单页面应用，应用托管于`{username}.github.io`仓库。然后我们需要知道如何通过api 获取 issues 内容

最近开始在github上，利用issue写blog，最开始是看到一篇github的文章，发现issue竟然还能用来写blog，觉得实在是很有趣，不知不觉自己就开始，发现什么问题就往issue上写，生怕过阵子就忘记。然后觉得越发有趣，就打算折腾一下，就issue作为自己的数据库，将issue展示在自己的blog上

github提供了很多的api，其中就有关于issue的api，现在我也是仅仅会用那么一点点，多点都不会，看github的api文档我也是看的不是很懂，最后也就通过各种的google，找到了窍门，下面来说一下，怎么获取目标项目的issue列表。

**单页面**

这个单页面很简单，大概只需要两个页面：列表与详情，应用必须有路由系统，而且应当只使用 hash 路由。

**issues api**

官方文档： https://developer.github.com/v3/issues/

列出了操作issues接口，我们暂时只用到 查看 功能。

**列出issues**

```
// 基本使用api
https://api.github.com/repos/:username/:repository/issues

// 我的
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/issues
```

每条issues都有详细信息，包括标题、内容、标签、用户，时间等等信息。

可以使用查询过滤或排序issues，比如以最近评论时间排序

```
// 基本使用api
https://api.github.com/repos/:username/:repository/issues?filter=updated

// 我的
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/issues?filter=updated
```

[直接浏览器访问](https://api.github.com/repos/hankliu62/hankliu62.github.com/issues)，会返回一串很长很长的json，默认会返回30条issue，每条issue都包含了很多的内容，都是一目了然，一看就知道是什么数据，然后，再说一下怎么按需的地返回需要的json，关于参数，我暂时也不知道在哪里可以看到文档，看官网的api文档，并没有说到一下的几个参数。这个几个参数是我研究别人的代码看到的，实践过确实有效，附上我研究的代码github项目

```
page: [int], // 当前页
per_page: [int] // 获取的条数
```

这两个参数可以用get的方式带上

```
// api
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/issues?page=1&per_page=10
```

**列出issues，增加获取访问上限**
据说，使用匿名的方式请求api，每天只能访问60次，假如你觉得你访问的频数会比较大（你就继续骗自己吧）你可以通过access_token来请求issue的api，上限是多少？
首先是获取access_token，你需要进入[传送门](https://github.com/settings/tokens)添加access_token

![Access Token](https://github.com/hankliu62/hankliu62.github.com/assets/8088864/39482beb-4ba1-42ce-b490-55206b0fcc3d)

填描述，基本勾选repo就够，点击生产Token按钮。

```
// api
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/issues?access_token=<access_token>&page=1&per_page=10
```

注：
在Github pages里面设置了 access_token 报错 Bad credentials。是 Github 限制了 access_token 访问。如果是一个完整的 token 字符串，Github 是不允许的。需将其拆分开。可以将 access_token 写成数组，用到时再拼接成字符串。

**获取单条issues**

```
// 基本使用api
https://api.github.com/repos/:username/:repository/issues/1

// 我的
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/issues/1
```
注意：这里的1是指的是issues对象中的number而不是id

**获取评论**

```
// 基本使用api
https://api.github.com/repos/:username/:repository/issues/1/comments

// 我的
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/issues/1/comments
```

**获取labels**

labels可用作与 分类 或 标签 功能

```
// 基本使用api
https://api.github.com/repos/:username/:repository/labels

// 我的
GET https://api.github.com/repos/hankliu62/hankliu62.github.com/labels
```

## 域名解析
生成github pages 后有一个二级域名：`username.github.io`，我们也可以使用自己的域名，方法：

在仓库根目录新建文件，命名为 `CNAME`
文件内容第一行写上域名(不要包含 http:// 和 https:// )，保存并上传至仓库
在域名解析后台添加cname记录，值为 `username.github.io`
过两分钟可生效。

经过测试，能绑定多个域名，在`CNAME`文件中，一行一个域名