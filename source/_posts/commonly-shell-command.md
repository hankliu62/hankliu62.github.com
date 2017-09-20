---
title: 常用的shell命令
date: 2017-09-14 13:10:16
tag: [shell]
---
## 一、SSH到服务器上再执行shell命令

``` shell
  ssh -t root@192.168.111.111 \
    "sudo cp -rf ${REMOTE_DESTS[$key]#*:}/${NGINX_CONF_FILENAME} /etc/nginx/sites-available/ &&
    sudo rm -rf ${REMOTE_DESTS[$key]#*:}/${NGINX_CONF_FILENAME} &&
    sudo ln -sf /etc/nginx/sites-available/${NGINX_CONF_FILENAME} /etc/nginx/sites-enabled/${NGINX_CONF_FILENAME} &&
    sudo service nginx reload"
```

## 二、查看或修改监控文件系统(Inotify)的watch数目

``` shell
# 设置
sudo sysctl fs.inotify.max_user_watches=524288

# 查看
sysctl -a | grep inotify
```

## 三、查看Ubuntu操作系统位数及版本
``` shell
# 查看Ubuntu操作系统位数
# 方法一: getconf
getconf LONG_BIT 
# 64 or 32

# 方法二: uname -a
uname -a
# Linux user-3020 3.13.0-48-generic #80-Ubuntu SMP Thu Mar 12 11:16:15 UTC 2015 x86_64 x86_64 x86_64 GNU/Linux
# i686表示32位, x86_64表示64位

# 查看Ubuntu操作系统版本
lsb_release -a
# Distributor ID:	Ubuntu
# Description:	Ubuntu 14.04.2 LTS
# Release:	14.04
# Codename:	trusty
```

## 四、动态查看一个文件
``` shell
tail -f filename
```

## 五、sudo操作手动输入密码
``` shell
echo "abc123_" | sudo -S sh -c "cp /home/user/hosts /etc/hosts"
```

## 六、替换变量中字符
### 第一种方式

``` shell
COMMIT_MSG=$(COMMIT_MSG//feat/build) # 将COMMIT_MSG中所有的feat替换成build
```

### 第二种方式: sed

``` shell
COMMIT_MSG=$(echo $COMMIT_MSG | sed 's/^ //g') #去除COMMIT_MSG变量中所有左边的空格
```

### 第三种方式： tr命令
*tr命令*可以对来自标准输入的字符进行替换、压缩和删除。它可以将一组字符变成另一组字符，经常用来编写优美的单行命令，作用很强大。

#### 语法

``` shell
tr(选项)(参数)
```

#### 选项
* -c或——complerment：取代所有不属于第一字符集的字符； 
* -d或——delete：删除所有属于第一字符集的字符； 
* -s或--squeeze-repeats：把连续重复的字符以单独一个字符表示； 
* -t或--truncate-set1：先删除第一字符集较第二字符集多出的字符。

#### 参数
* 字符集1：指定要转换或删除的原字符集。当执行转换操作时，必须使用参数“字符集2”指定转换的目标字符集。但执行删除操作时，不需要参数“字符集2”； 

*字符集2：指定要转换成的目标字符集。

#### 实例
将输入字符由大写转换为小写： 

``` shell
echo "HELLO WORLD" | tr 'A-Z' 'a-z' 
hello world 
```

'A-Z' 和 'a-z'都是集合，集合是可以自己制定的，例如：'ABD-}'、'bB.,'、'a-de-h'、'a-c0-9'都属于集合，集合里可以使用'\n'、'\t'，可以可以使用其他ASCII字符。

更详细的[tr实例](http://man.linuxde.net/tr)

## 七、if指令详解(TODO)
### 判断文件夹是否存在

``` shell
# 如果文件夹不存在，创建文件夹
if [ ! -d "/myfolder" ]; then
  mkdir /myfolder
fi

# shell判断文件,目录是否存在或者具有权限

folder="/var/www/"
file="/var/www/log"

# -x 参数判断 $folder 是否存在并且是否具有可执行权限
if [ ! -x "$folder"]; then
  mkdir "$folder"
fi

# -d 参数判断 $folder 是否存在
if [ ! -d "$folder"]; then
  mkdir "$folder"
fi

# -f 参数判断 $file 是否存在
if [ ! -f "$file" ]; then
  touch "$file"
fi

# -n 判断一个变量是否有值
if [ ! -n "$var" ]; then
  echo "$var is empty"
  exit 0
fi

# 判断两个变量是否相等
if [ "$var1" = "$var2" ]; then
  echo '$var1 eq $var2'
else
  echo '$var1 not eq $var2'
fi
```
## 八、开始行和结束行的内容
``` shell
# 文件最后100行
tail -n 100 file 

# 文件开头100行
head -n 100 file

# 文件指定开始行和结束行的内容(包头不包尾)
sed '1,100p' file

# 文件有多少行
wc -l file
```

## 九、用来从文件或者变量中提取字段(awk)
awk 用来从文本文件中提取字段。缺省地，字段分割符是空格，可以使用-F指定其他分割符。
``` shell
echo "Adam Bor, 34, IndiaKerry Miller, 22, USA" | awk -F, '{print $1 "," $3 }'
# Adam Bor, IndiaKerry Miller, USA
```
这里我们使用，作为字段分割符，同时打印第一个和第三个字段

## 十、输出不换行(echo)

echo的参数中, -e表示开启转义, /c表示不换行,脚本如下:

``` shel
#!/bin/sh
#filename: 1
echo -e "please input a value:\c"
read value
# echo "what you input is:" $valuel
```

脚本2:

``` shell
#!/bin/sh
#filename: 1
echo -n "please input a value:"
read value
echo "what you input is:" $value
```

## 十一、字符串大小写不敏感的比较
通用的方法是将字符串先转换成小写后再比较

``` shell
#!/bin/bash

xxx="Temp" 
yyy="temp"

x_tmp=$(echo $xxx | tr [A-Z] [a-z]) 
y_tmp=$(echo $yyy | tr [A-Z] [a-z])

if [ "$x_tmp " = "$y_tmp " ]; then
  echo   "PASS"
else
  echo   "FAIL"
fi
```

## 十二、**&&** 运算符

语法格式：
``` sh
command1 && command2 [&& command3 ...]
```
 
&&左边的命令（命令1）返回真(即返回0，成功被执行）后，&&右边的命令（命令2）才能够被执行；换句话说，“如果这个命令执行成功&&那么执行这个命令”。 

1 命令之间使用 && 连接，实现逻辑与的功能。
2 只有在 && 左边的命令返回真（命令返回值 $? == 0），&& 右边的命令才会被执行。
3 只要有一个命令返回假（命令返回值 $? == 1），后面的命令就不会被执行。

## 十三、**||** 运算符

语法格式:

``` sh
command1 || command2 [|| command3 ...]
 ```

||则与&&相反。如果||左边的命令（命令1）未执行成功，那么就执行||右边的命令（命令2）；或者换句话说，“如果这个命令执行失败了||那么就执行这个命令。

1 命令之间使用 || 连接，实现逻辑或的功能。
2 只有在 || 左边的命令返回假（命令返回值 $? == 1），|| 右边的命令才会被执行。这和 c 语言中的逻辑或语法功能相同，即实现短路逻辑或操作。
3 只要有一个命令返回真（命令返回值 $? == 0），后面的命令就不会被执行。

## 十四、判断变量中是否包含某个字符串

3 只要有一个命令返回真（命令返回值 $? == 0），后面的命令就不会被执行。
``` shell
str="this is a string"  
[[ $str =~ "this" ]] && echo "$str contains this"   
[[ $str =~ "that" ]] || echo "$str does NOT contain that"
```

结果为：
this is a string contains this
this is a string does NOT contains that
"[[" 判断命令和 "=~"正则式匹配符号

## 十五、shell中 **[ ]** 和 **[[ ]]** 的区别
http://blog.csdn.net/ysdaniel/article/details/7905818

## 十六、shell中 **''** , **""** 和 **``** 的区别
http://www.cnblogs.com/Skyar/p/5914942.html

## 参考地址：
[基础语法](http://www.cnblogs.com/xuejie/archive/2013/01/31/2886552.html)
[echo指令](http://man.linuxde.net/echo)