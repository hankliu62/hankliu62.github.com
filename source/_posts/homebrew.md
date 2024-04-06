---
title: MacOS 和 Linux 的 Homebrew 安装与卸载
date: 2024-04-04 13:56:26
tag: [homebrew]
---

## MacOS 和 Linux 的 Homebrew 安装与卸载

### Homebrew

macOS（或 Linux）缺失的软件包的管理器

#### 安装 Homebrew

``` bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

脚本会在执行前暂停，并说明它将做什么。高级安装选项在 [这里](https://docs.brew.sh/Installation)。

#### Homebrew 能干什么?

1. 使用 `Homebrew` 安装 `Mac`（或您的 `Linux` 系统）没有预装但 [你需要的东西](https://formulae.brew.sh/formula/)。

``` bash
brew install wget
```

2. `Homebrew` 会将软件包安装到独立目录，并将其文件软链接至 `/opt/homebrew` 。

``` bash
cd /opt/homebrew
find Cellar

# Cellar/wget/1.16.1
# Cellar/wget/1.16.1/bin/wget
# Cellar/wget/1.16.1/share/man/man1/wget.1

ls -l bin
# bin/wget -> ../Cellar/wget/1.16.1/bin/wget
```

3. `Homebrew` 不会将文件安装到它本身目录之外，所以您可将 `Homebrew` 安装到任意位置。

4. 轻松创建你自己的 `Homebrew` 包。

``` bash
brew create https://foo.com/foo-1.0.tgz
# Created /opt/homebrew/Library/Taps/homebrew/homebrew-core/Formula/foo.rb
```

5. 完全基于 `Git` 和 `Ruby`，所以自由修改的同时你仍可以轻松撤销你的变更或与上游更新合并。

``` bash
brew edit wget # 使用 $EDITOR 编辑!
```

6. `Homebrew` 的配方都是简单的 `Ruby` 脚本：

``` ruby
class Wget < Formula
  homepage "https://www.gnu.org/software/wget/"
  url "https://ftp.gnu.org/gnu/wget/wget-1.15.tar.gz"
  sha256 "52126be8cf1bddd7536886e74c053ad7d0ed2aa89b4b630f76785bac21695fcd"

  def install
    system "./configure", "--prefix=#{prefix}"
    system "make", "install"
  end
end
```

7. `Homebrew` 使 `macOS`（或您的 `Linux` 系统）更完整。使用 `gem` 来安装 `RubyGems`、用 `brew` 来安装那些依赖包。

8. “要安装，请拖动此图标……”不会再出现了。使用 `Homebrew Cask` 安装 `macOS` 应用程序、字体和插件以及其他非开源软件。

``` bash
brew install --cask firefox
```

9. 制作一个 `cask` 就像创建一个配方一样简单。

``` bash
brew create --cask https://foo.com/foo-1.0.dmg
# Editing /opt/homebrew/Library/Taps/homebrew/homebrew-cask/Casks/foo.rb
```

### 国内源安装

国内安装 `Homebrew` 可能很慢，所以我们推荐使用国内的源来进行安装

#### macOS

- 常规安装（推荐）：

``` base
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

- 极速安装（精简版）：

``` base
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)" speed
```

- 卸载

``` base
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh)"
```

### Linux

- 安装
``` base
rm Homebrew.sh; wget https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh; bash Homebrew.sh
```

- 卸载

``` base
rm HomebrewUninstall.sh; wget https://gitee.com/cunkai/HomebrewCN/raw/master/HomebrewUninstall.sh; bash HomebrewUninstall.sh
```

### macOS 常见错误说明

> [官方表示只支持最新的三个Mac os版本](https://brew.sh/blog/),老的Mac系统可以试试MacPorts。

> 首先确保运行的`/bin/zsh -c "$(curl -fsSL https://gitee.com/ **cunkai** /HomebrewCN/raw/master/Homebrew.sh)"` 中间那个 **cunkai** 不是别的。

**1.** 如果遇到安装软件报错 **404** ，切换网络如果还不行：

查看下官方更新记录` https://brew.sh/blog/ ` 如果近期有更新，可以发我邮箱cunkai.wang@foxmail.com。我看看是否官方修改了某些代码。

**2.** 不小心改动了brew文件夹里面的内容，如何重置，运行：
```
brew update-reset
```

**3.** 报错提示中如果有  **git -c xxxxxxx xxx xxx**  等类似语句。

  如果有这种提示，把报错中提供的解决语句（git -C ....）逐句运行一般就可以解决。

**4.** 如果遇到报错中含有errno  **54**  /  **443**  / 的问题：

  这种一般切换源以后没有问题，因为都是公益服务器，不稳定性很大。

**5.** 检测到你不是最新系统，需要自动升级 Ruby 后失败的：


```
HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles

rm -rf /Users/$(whoami)/Library/Caches/Homebrew/

brew update
```

**6.** 如果报错  **command not found : brew**

先运行此命令`/usr/local/Homebrew/bin/brew -v` ，如果是ARM架构的芯片运行`/opt/homebrew/bin/brew -v` 看是否能出来Homebrew的版本号。

如果能用就是电脑PATH配置问题，重启终端运行 `echo $PATH` 打印出来自己分析一下。

**7.** Error: Running Homebrew as root is extremely dangerous and no longer supported.
As Homebrew does not drop privileges on installation you would be giving all
 **build scripts full access to your system.**

此报错原因是执行过su命令，把账户切换到了root权限，退出root权限即可。一般关闭终端重新打开即可，或者输入命令exit回车 或者su - 用户名

**8.** /usr/local/bin/brew:  **bad interpreter: /bin/bash^M: no such file or directory**

`git config --global core.autocrlf`

如果显示true那就运行下面这句话可以解决：

`git config --global core.autocrlf input`

运行完成后，需要重新运行安装脚本。

**9.** from /usr/local/Homebrew/Library/Homebrew/ **brew.rb:23:in `<main>'**

`brew update-reset`

**10.** M1芯片电脑运行which brew如果显示/usr/local/Homebrew/bin/brew

解决方法，手动删除/usr/local目录，重新安装：

```
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"

```

**11.** The x86_64 architecture is required
这句话意思是，这个软件不支持M1芯片，只支持x86_64架构的CPU。

**12.** Warning: No remote 'origin' in /usr/local/Homebrew/Library/Taps/homebrew/homebrew-cask, skipping update!

看评论区说解决方法（我未测试）：https://gitee.com/cunkai/HomebrewCN/issues/I5A7RV

**13.** fatal: not in a git directory   Error: Command failed with exit 128: git

```
git config --global http.sslVerify false
```

**14.** /usr/local/Homebrew/Library/Homebrew/cmd/vendor-install.sh:1ine245:./3.1.4/bin/ruby:BadCPUtype inexecutable

如果你是苹果的M芯片有这种报错，说明你电脑有两个brew，简单粗暴的方法是删除`/usr/local/Homebrew`目录，保留`/opt/homebrew`即可。
（提示：如何去指定访达，屏幕左上角找到前往->前往文件夹然后输入`/usr/local`回车把Homebrew删除即可。反之如果你是英特尔处理器就保留`/usr/local`下的去opt目录删除）
温和的方法是分别运行下面三句话，看看是否包含`/usr/local/Homebrew`的字符串，删掉整行保存。

```
open ${HOME}/.zprofile
open $HOME/.bash_profile
open ${HOME}/.profile
```