title: 使用 git 克隆 github 上的项目失败
date: 2018-11-09 10:00:20
tag: [git, github]
---

## 现象
今天在使用 git clone nextjs demo project 源代码的时， git clone https://github.com/Weibozzz/next-blog.git 下载速度很慢，然后下载一段时间后，总是提示下面的错误信息

``` shell
nCloning into 'next-blog'...
remote: Enumerating objects: 111, done.
remote: Counting objects: 100% (111/111), done.
remote: Compressing objects: 100% (83/83), done.
error: RPC failed; curl 18 transfer closed with outstanding read data remaining
fatal: The remote end hung up unexpectedly
fatal: early EOF
fatal: index-pack failed
```

## 原因
由于Http协议错误，当 pull 或者 clone 的时候，或者是 github 某个CDN被伟大的墙屏蔽所致。

## 解决办法

### 协议错误
 1. 先执行下列命令
  ``` shell
  git config --global http.postBuffer 524288000
  ```

 2. 再执行git pull 或者 git clone命令

### 墙屏蔽
 1. 访问 http://github.global.ssl.fastly.net.ipaddress.com/#ipinfo
    获取cdn域名以及IP地址

 2. 访问 http://github.com.ipaddress.com/#ipinfo 获取cdn域名以及IP地址        ![cdn域名以及IP地址](https://user-images.githubusercontent.com/8088864/48385665-42ca5880-e72a-11e8-9281-d825b6f66fe8.png)

 3. 将上述获取的IP地址添加到`/etc/hosts`中
  ``` shell
  sudo vim /etc/hosts
  ```
  ![添加IP地址到hosts](https://user-images.githubusercontent.com/8088864/48385763-bcfadd00-e72a-11e8-96ff-4f14ed1ba521.png)

 4. 刷新dns缓存
  ``` shell
  sudo killall -HUP mDNSResponder
  sudo dscacheutil -flushcache
  ```

## 结果
再执行 git clone 操作的时候，速度飕飕飕的上去了，一下子达到几百Kb啦~
