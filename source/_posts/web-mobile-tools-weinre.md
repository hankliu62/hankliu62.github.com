---
title: 使用Weinre调试移动端Web开发
date: 2017-09-19 18:55:37
tag: [mobile, weinre, blog]
---

## 一、使用Npm全局安装weinre

``` shell
npm -g install weinre
```

## 二、引入js文件

``` javascript
<script src="http://192.168.225.198:8081/target/target-script-min.js#anonymous"></script>
```

## 三、启动 Weinre Debug 服务端

``` shell
weinre --httpPort 8081 --boundHost -all-
```