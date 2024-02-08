# 一、安装步骤

---

## 1. git clone https://github.com/hankliu62/hankliu62.github.com.git hankliu62.github.com

克隆项目

## 2. cd hankliu62.github.com

进入项目根目录

## 3. git submodule update --init --recursive

更新`git submodule`, `git submodule`一般为博客的themes

## 4. npm install

安装相关依赖的库

## 5. hexo g

将md文件转化成html, js, css等静态文件

## 6. hexo s

启动服务

## 7. 浏览器打开 http://localhost:4000