---
title: MAC搭建个人博客hexo+github详细完整步骤
date: 2017-09-09 12:20:26
tag: [hexo, blog]
---

自己也算是摸爬滚打搭建成功，然后自己再重新安装部署一遍，把完整步骤分享给大家，同时最后有一些连接，如果我的步骤不行，大家可以参考其他人的.

## 一、安装Homebrew
Homebrew是基于Ruby的，所以安装过程也是很简单的，把下面的代码粘贴到Terminal中执行

``` sh
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

查看安装是否成功:

``` sh
brew --version
```

如下图所示表示安装成功

![image](https://user-images.githubusercontent.com/8088864/30236069-ba7e712e-9544-11e7-910a-7ec04c1d5579.png)

更多的brew命令

``` sh
//查看brew的帮助
brew –help

//安装软件
brew install git

//卸载软件
brew uninstall git

//搜索软件
brew search git

//显示已经安装软件列表
brew list

//更新软件，把所有的Formula目录更新，并且会对本机已经安装并有更新的软件用*标明。
brew update

//更新某具体软件
brew upgrade git

//查看软件信息
brew [info | home] [FORMULA...]

//删除程序，和upgrade一样，单个软件删除和所有程序老版删除。
brew cleanup git
brew cleanup

//查看那些已安装的程序需要更新
brew outdated


//其它Homebrew指令:
brew list   //—列出已安装的软件

brew update   //—更新Homebrew

brew home *   //—用浏览器打开

brew info *   //—显示软件内容信息

brew deps *    //—显示包依赖

brew server *  //—启动web服务器，可以通过浏览器访问
                 //http://localhost:4567/ 来同网页来管理包

brew -h brew   //—帮助
```

## 二、安装Git

### 1、使用brew安装Git

``` sh
brew install git
```

### 2、完成安装
查看是否安装成功

``` sh
git --version
```

![Git安装成功](https://user-images.githubusercontent.com/8088864/30236377-b5343392-954a-11e7-9566-927e43ec4983.png)


## 三、通过nvm安装指定版本的node

### 1、安装nvm

``` sh
brew install nvm
```

### 2、配置nvm
配置nvm在shell中可以使用nvm命令，修改`~/.bash_profile`文件，如果不存在，新建` .bash_profile`文件

``` sh
cd ~
vim .bash_profile
```

在文件中添加如下命令:

``` .bash_profile
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```

重新source

``` sh
source .bash_profile
```

### 3、安装node

``` sh
nvm ls-remote 查看 所有的node可用版本

nvm install xxx 下载你想要的版本

nvm use xxx 使用指定版本的node

nvm alias default xxx 每次启动终端都使用该版本的node
```

### 4、完成安装
查看是否安装成功

``` sh
node -v
npm -v
```

![Node安装成功](https://user-images.githubusercontent.com/8088864/30236355-4d1f8f18-954a-11e7-8da7-54d3f9ae1c91.png)

<!-- more -->

## 四、安装hexo

### 1、利用npm命令即可安装
全局安装

``` sh
npm install -g hexo
```

## 五、初始化Hexo

### 1、创建Blog所在的文件夹

``` sh
cd /Users/**/Workspace/github
mdkir hankliu62.github.com
```

### 2、hexo初始化

``` sh
hexo init
```

初始化成功后会生成如下文件

![Hexo初始化成功](https://user-images.githubusercontent.com/8088864/30236442-e26003fe-954b-11e7-9313-89dca90d1984.png)

### 3、在_config.yml进行基础配置
配置*title*, *author*, *description*等基本信息

![基础配置](https://user-images.githubusercontent.com/8088864/30236472-81f5d998-954c-11e7-9512-4e9fa6aa14fe.png)

### 4、设置主题
可以[Hexo主题](https://hexo.io/themes/)页面中选择与自己相匹配的主题，使用Git clone到themes目录下，配置成自己博客的主题, 这些主题都是安装作者的喜好来开发的，我们可以Fork这个project，根据自己的喜好来进行二次开发和设置

``` sh
cd themes

https://github.com/hankliu62/hexo-theme-paperbox.git
```

### 5、添加博客文章
源文件一般为markdown文件，所以在写博客之前我们需要先了解[markdown的基本语法](http://www.appinn.com/markdown/), 将完成的文章放到`source/_posts`路径下。

![文章](https://user-images.githubusercontent.com/8088864/30236636-63a2de56-9550-11e7-9ff4-3efba9c58b14.png)

### 6、启动本地服务，浏览本地博客
``` sh
hexo g

hexo s
```

更多[hexo命令](https://segmentfault.com/a/1190000002632530)
``` sh
# 启动服务
hexo server # Hexo 会监视文件变动并自动更新，您无须重启服务器。
hexo s # 简写
hexo server
hexo server -s # 静态模式
hexo server -p 5000 # 更改端口
hexo server -i 192.168.1.1 # 自定义 IP

# INFO Hexo is running at http://0.0.0.0:4000/. Press Ctrl+C to stop.


#清除缓存
hexo clean #网页正常情况下可以忽略此条命令

# INFO  Deleted database.
# INFO  Deleted public folder.


# 新建文件夹（自动在文件夹下新建index.md）
hexo new page "file"

# INFO Created: D:...\blog\source\file\index.md


# 新建文章
hexo n fileName
hexo new "fileName"
hexo new post fileName
hexo new post "fileName"

# INFO Created: D:...\blog\source\_posts\fileName.md


# 生成/编译/发布(生成静态网页)
hexo generate
hexo g
hexo generate --watch # 监视文件变动

# INFO Files loaded in 2.03 s
# INFO Deleted: ......
# INFO Generated: ......
# INFO 108 files generatd in 8.44 s


# 部署
hexo deploy
hexo d

# INFO  Deploying: git
# INFO  Clearing .deploy_git folder...
# INFO  Copying files from public folder...
# INFO  Copying files from extend dirs...
# [master 29d5f2d] feat(blog): add old blogs
#  7 files changed, 10 insertions(+), 9 deletions(-)
# To https://github.com/hankliu62/hankliu62.github.com.git
#    8a51b69..29d5f2d  HEAD -> master
# Branch master set up to track remote branch master from https://github.com/hankliu62/hankliu62.github.com.git.
# INFO  Deploy done: git


# 完成后部署(两个命令的作用是相同的)
hexo generate --deploy
hexo deploy --generate
hexo deploy -g
hexo server -g

# INFO  Start processing
# INFO  Files loaded in 148 ms
# INFO  Generated: 2015/12/24/ubuntu-netstat/index.html
# INFO  Generated: archives/index.html
# INFO  Generated: archives/2015/index.html
# INFO  Generated: archives/2017/09/index.html
# INFO  Generated: tags/javascript/index.html
# INFO  Generated: tags/Javascript/index.html
# INFO  Generated: archives/2017/index.html
# INFO  Generated: tags/ubuntu/index.html
# INFO  Generated: tags/PID/index.html
# INFO  Generated: 2017/09/09/hexo-github-blog-guide/index.html
# INFO  Generated: 2015/12/24/javascript-common-function/index.html
# INFO  Generated: tags/模块化/index.html
# INFO  Generated: archives/2015/12/index.html
# INFO  Generated: 2015/12/24/javascript-module/index.html
# INFO  Generated: index.html
# INFO  15 files generated in 240 ms
# INFO  Deploying: git
# INFO  Clearing .deploy_git folder...
# INFO  Copying files from public folder...
# INFO  Copying files from extend dirs...
# [master 29d5f2d] feat(blog): add old blogs
#  7 files changed, 10 insertions(+), 9 deletions(-)
# To https://github.com/hankliu62/hankliu62.github.com.git
#    8a51b69..29d5f2d  HEAD -> master
# Branch master set up to track remote branch master from https://github.com/hankliu62/hankliu62.github.com.git.
# INFO  Deploy done: git
```

### 7、浏览器输入`http://localhost:4000`进行访问

![博客](https://user-images.githubusercontent.com/8088864/30236643-a79dff46-9550-11e7-888e-2dbfe2cf3773.png)

## 六、部署到Github

### 1、申请Github账号

### 2、New repository
![New repository](https://user-images.githubusercontent.com/8088864/30236675-5734e9ec-9551-11e7-8ecc-e38b4e0d98e8.png)

注意: 输入`Repository name`时，最好与前面的`username`保持一致(上图不一致是因为我已经使用`hankliu62.github.com`创建了一个github仓库了)

### 3、选择`hankliu62/hankliu62.github.com` >> `Settings` >> `GitHub Pages` >> `Choose a theme`

![选择主题](https://user-images.githubusercontent.com/8088864/30236715-7a372e04-9552-11e7-8bb7-48a5d8722059.png)

![选择主题](https://user-images.githubusercontent.com/8088864/30236720-9eed71d6-9552-11e7-9187-c3fac4052b28.png)

![选择主题](https://user-images.githubusercontent.com/8088864/30236724-aedbb9d6-9552-11e7-9a8c-2398388b9321.png)

随便选择一个主题，最终会使用hexo中选择的主题样式，这里就无所谓了

### 4、设置index.md, 访问github博客

![设置index.md](https://user-images.githubusercontent.com/8088864/30236738-37332f94-9553-11e7-8714-e47de3fdecd6.png)

### 5、结合hexo，发布到github
进入第三步创建的`hankliu62.github.com`文件夹，在`_config.yml`配置对于的github仓库, 以及本次提交的信息
``` sh
cd hankliu62.github.com

vim _config.yml
```

配置信息和提交信息如下:

``` _config.yml
# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  message: "feat(blog): add hexo-github-blog-guide article"
  branch: master
  repo: https://github.com/hankliu62/hankliu62.github.com.git
```

生成静态文件，再部署

``` sh
hexo g
hexo d
```

![生成静态文件部署](https://user-images.githubusercontent.com/8088864/30236778-97f84e1c-9554-11e7-9b34-20cb95a9cc77.png)


## 七、浏览器中输入`https://hankliu62.github.io/`进行查看

