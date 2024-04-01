---
title: ubuntu查看和关闭端口
date: 2015-12-24 18:55:37
tag: [ubuntu, shell, blog]
---

## 一、查看端口
``` shell
netstat -anp

// result
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:27017           0.0.0.0:*               LISTEN      -
tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:81              0.0.0.0:*               LISTEN      -
tcp        0      0 0.0.0.0:82              0.0.0.0:*               LISTEN      -
tcp        0      0 192.168.222.198:50233   180.97.33.107:443       ESTABLISHED 2361/google-chrome-
...
Active UNIX domain sockets (servers and established)
Proto RefCnt Flags       Type       State         I-Node   PID/Program name    Path
unix  2      [ ACC ]     STREAM     LISTENING     1996     -                   /tmp/mongodb-27017.sock
unix  2      [ ACC ]     STREAM     LISTENING     781      -                   /tmp/.X11-unix/X0
unix  2      [ ACC ]     STREAM     LISTENING     12932    1799/xfce4-session  /tmp/.ICE-unix/1799
unix  2      [ ACC ]     STREAM     LISTENING     12931    1799/xfce4-session  @/tmp/.ICE-unix/1799
unix  2      [ ACC ]     STREAM     LISTENING     15489    1915/fcitx          /tmp/fcitx-socket-:0
unix  2      [ ACC ]     STREAM     LISTENING     16412    2068/sogou-qimpanel /tmp/sogou-qimpaneluser
unix  2      [ ACC ]     STREAM     LISTENING     15796    2361/google-chrome- /tmp/.com.google.Chrome.KwiQ8d/SingletonSocket
...

// 查看某个端口的进程
netstat -anp | grep 8081

// result
tcp        0      0 127.0.0.1:56770         127.0.0.1:8081          ESTABLISHED 2361/google-chrome-
tcp6       0      0 :::8081                 :::*                    LISTEN      5359/gulp
tcp6       0      0 127.0.0.1:8081          127.0.0.1:56770         ESTABLISHED 5359/gulp
```

## 二、关闭某个端口的进程

``` shell
kill -9 5359
```