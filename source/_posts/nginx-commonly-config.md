---
title: Nginx常用基础配置详解
date: 2022-04-08 12:15:26
tag: [nginx]
---

## Nginx常用基础配置详解

### 介绍

Nginx 是一个高性能的开源 Web 服务器，它不仅可以作为 HTTP 服务器使用，还可以用作反向代理服务器、负载均衡器、缓存服务器等。在实际应用中，正确配置 Nginx 是确保网站稳定性和性能的重要步骤。本文将详细介绍一些常用的 Nginx 基础配置，包括虚拟主机配置、HTTP 重定向、反向代理等内容，并提供详细的示例说明。

### 虚拟主机配置

虚拟主机是 Nginx 中非常重要的概念，它允许您在一台服务器上托管多个网站。下面是一个简单的虚拟主机配置示例：

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/example;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

- **`listen 80;`**：指定 `Nginx` 监听的端口号。
- **`server_name example.com www.example.com;`**：指定虚拟主机的域名。
- **`root /var/www/example;`**：指定网站的根目录。
- **`index index.html index.htm;`**：指定默认的索引文件。
- **`location /`**：配置请求的 `URL` 路径。
- **`try_files $uri $uri/ /index.html;`**：尝试寻找与请求 `URI` 匹配的文件，如果找不到则返回 `index.html`。

### HTTP 重定向
HTTP 重定向是将一个 URL 请求重定向到另一个 URL 的过程。下面是一个简单的 HTTP 重定向配置示例：

``` nginx
server {
    listen 80;
    server_name www.example.com;

    return 301 http://example.com$request_uri;
}
```

这个配置会将所有访问 `www.example.com` 的请求重定向到 `example.com`，保证网站的访问统一性。

### 反向代理
`Nginx` 反向代理是将客户端的请求转发给后端服务器的过程，常用于负载均衡和隐藏后端服务器。下面是一个简单的反向代理配置示例：

``` nginx
server {
  listen 80;
  server_name www.example.com;

  location / {
    proxy_pass http://backend_server;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

- **`proxy_pass http://backend_server;`**：指定后端服务器的地址。
- **`proxy_set_header`**：设置代理请求的头部信息，如 `Host`、`X-Real-IP`、`X-Forwarded-For` 等。

### SSL/TLS 配置

`SSL/TLS` 是保护网站安全的重要手段，`Nginx` 提供了丰富的 `SSL/TLS` 配置选项。下面是一个简单的 `SSL/TLS` 配置示例：

``` nginx
server {
  listen                      80;
  server_name                 www.example.com;
  # 将 http 重定向转移到 https
  return 301 https://$server_name$request_uri;
}

server {
  listen                      443 ssl;
  server_name                 www.example.com;
  ssl_certificate             /etc/nginx/ssl/www.example.com.pem;
  ssl_certificate_key         /etc/nginx/ssl/www.example.com.key;
  ssl_session_timeout         10m;
  ssl_ciphers                 ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
  ssl_protocols               TLSv1 TLSv1.1 TLSv1.2;
  ssl_prefer_server_ciphers   on;

  location / {
    root                    /var/nginx/html;
    index                   index.html index.htm index.md;
    try_files               $uri $uri/ /index.html;
  }
}

```

- **`listen 443 ssl;`**：指定监听的端口号，并开启 SSL。
- **`ssl_certificate 和 ssl_certificate_key`**：指定 SSL 证书和私钥的路径。
- **`ssl_protocols`**：指定允许的 SSL/TLS 协议版本。
- **`ssl_prefer_server_ciphers on;`**：优先使用服务器端的加密算法。
- **`ssl_ciphers`**：指定允许的加密算法。

### 隐藏 Nginx 版本信息

要隐藏 `Nginx` 版本信息，您可以通过在配置文件中进行相应的设置来实现。具体来说，您需要修改 `nginx.conf` 文件，使用 `server_tokens off;` 指令来关闭 `Nginx` 的版本号显示。以下是如何进行配置的示例：

``` nginx
http {
  server_tokens off;
}
```

将上述配置添加到 `nginx.conf` 文件的 `http` 块中即可禁用 `Nginx` 版本号显示。

### 禁止 ip 直接访问 80 端口

要禁止直接通过 `IP` 地址访问 `80` 端口，您可以通过 `Nginx` 配置文件进行相应的设置。具体来说，您可以配置一个默认的 `server` 块，用于捕获所有请求，并返回一个错误页面或者重定向到其他地址。以下是一个示例配置：

``` nginx
server {
  listen 80 default_server;
  server_name _;

  return 444;
}
```

在这个配置中：

- **`listen 80 default_server;`**：指定 `Nginx` 监听默认的 `HTTP` 端口，并将此 `server` 块标记为默认服务器。
- **`server_name _;`**： 表示该 `server` 块将匹配所有请求。
- **`return 444;`**： 是一个特殊的 `Nginx` 返回指令，它会立即关闭客户端连接，相当于不做任何响应。

通过这样的配置，当有请求通过 `IP` 地址直接访问 `80` 端口时，`Nginx` 将返回一个 `444` 错误，不会提供任何内容，从而实现了禁止直接访问 `80` 端口的目的。

### 启动 web 服务 (react 项目为例)

``` nginx
server {
  # 项目启动端口
  listen            80;
  # 域名（localhost）
  server_name       _;
  # 禁止 iframe 嵌套
  add_header        X-Frame-Options SAMEORIGIN;

  # 访问地址 根路径配置
  location / {
    # 项目目录
    root            /var/nginx/html;
    # 默认读取文件
    index           index.html;
    # 配置 history 模式的刷新空白
    try_files       $uri $uri/ /index.html;
  }

  # 后缀匹配，解决静态资源找不到问题
  location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ {
    root            /var/nginx/html/static/;
  }

  # 图片防盗链
  location ~/static/.*\.(jpg|jpeg|png|gif|webp)$ {
    root              /var/nginx/html;
    valid_referers    *.example.com;
    if ($invalid_referer) {
      return          403;
    }
  }

  # 访问限制
  location /static {
    root               /var/nginx/html;
    # allow 允许
    allow              39.xxx.xxx.xxx;
    # deny  拒绝
    deny               all;
  }
}
```

在这个配置中：

- **`listen 80;`**： 指定 Nginx 监听的端口号。
- **`server_name _;`**： 表示该 `server` 块将匹配所有请求。
- **`location /`**： 配置请求的 · 路径，尝试寻找与请求 `URI` 匹配的文件，如果找不到则返回 `index.html`。
- **`add_header X-Frame-Options SAMEORIGIN;`**：设置响应的头部信息 `X-Frame-Options`，不允许我们的页面嵌套到第三方网页里面。
- **`root /var/nginx/html;`**： 指定网站的根目录，这里是 `React` 项目构建后的静态文件目录。
- **`index index.html;`**： 指定默认的索引文件。
- **`try_files $uri $uri/ /index.html;`**：尝试寻找与请求 `URI` 匹配的文件，如果找不到则返回 `index.html`。

### 一个web服务，配置多个项目 (location 匹配路由区别)

``` nginx
server {
  listen                80;
  server_name           _;

  # 主应用
  location / {
    root                /var/nginx/html/main;
    index               index.html;
    try_files           $uri $uri/ /index.html;
  }

  # 子应用一
  location ^~ /user/ {
    proxy_pass          http://localhost:8001;
    proxy_redirect      off;
    proxy_set_header    Host $host;
    proxy_set_header    X-Real-IP $remote_addr;
    proxy_set_header    X-Forwarded-For
    proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  # 子应用二
  location ^~ /product/ {
    proxy_pass          http://localhost:8002;
    proxy_redirect      off;
    proxy_set_header    Host $host;
    proxy_set_header    X-Real-IP $remote_addr;
    proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  # 静态资源读取不到问题处理
  rewrite ^/api/profile/(.*)$ /(替换成正确路径的文件的上一层目录)/$1 last;
}

# 子应用一服务
server {
  listen                8001;
  server_name           _;
  location / {
    root                /var/nginx/html/user;
    index               index.html;
    try_files           $uri $uri/ /index.html;
  }

  location ^~ /user/ {
    alias               /var/nginx/html/user/;
    index               index.html index.htm;
    try_files           $uri /user/index.html;
  }

  # 接口代理
  location  /api {
    proxy_pass          http://localhost:3001;
  }
}

# 子应用二服务
server {
  listen                8002;
  server_name           _;

  location / {
    root                /var/nginx/html/product;
    index               index.html;
    try_files           $uri $uri/ /index.html;
  }

  location ^~ /product/ {
    alias               /var/nginx/html/product/;
    index               index.html index.htm;
    try_files           $uri /product/index.html;
  }

  # 接口代理
  location  /api {
    proxy_pass          http://localhost:3002;
  }
}
```

在上述配置中

- **`location ^~ /user/`**：使用 `^~` 修饰的 `location` 块，匹配以 `/user/` 开头的 `URI`。如果请求的 `URI` 以 `/user/` 开头，则 `Nginx` 将立即停止搜索其他 `location` 块，而是使用这个 `location` 块进行处理，`location` 块里面使用反向代理，指向服务器 `http://localhost:8001` 的地址。
- **`location ^~ /product/`**：同上，匹配以 `/product/` 开头的 `URI`。

### PC端和移动端使用不同的项目文件映射

要在 `Nginx` 中根据用户设备类型（例如PC端和移动端）使用不同的项目文件映射，您可以使用 `map` 指令创建一个变量，根据用户的 `User-Agent` 头部信息来判断设备类型，并使用if语句根据变量的值来选择不同的文件映射。以下是一个示例配置：

``` nginx
map $http_user_agent $is_mobile {
  default 0;
  ~*iphone 1;
  ~*android 1;
  ~*mobile 1;
}

server {
  listen 80;
  server_name example.com;

  root /var/www;

  location / {
    if ($is_mobile) {
      alias /var/www/mobile/;
    }
    alias /var/www/desktop/;
    try_files $uri $uri/ /index.html;
  }
}
```

或者

``` nginx
server {
  location / {
    root /var/www/desktop;
    if ($http_user_agent ~* '(mobile|android|iphone|ipad|phone)') {
      root /var/www/mobile;
    }
    index index.html;
  }
}
```

在这个配置中：

- **`map $http_user_agent $is_mobile`**：创建一个变量 `$is_mobile`，根据 `$http_user_agent` 中的 `User-Agent` 头部信息判断设备类型。如果 `User-Agent` 中包含 `iphone`、`android`、`mobile` 等关键词，则将 `$is_mobile` 设置为 `1`，否则设置为 `0`。
- **`location /`**：对所有请求进行匹配。
- **`if ($is_mobile)`**：使用 `if` 语句根据 `$is_mobile` 的值判断设备类型。如果是移动设备，则将请求映射到 `/var/www/mobile/` 目录；否则映射到 `/var/www/desktop/` 目录。
- **`try_files $uri $uri/ /index.html;`**：尝试寻找与请求 `URI` 匹配的文件，如果找不到则返回 `/index.html`。

需要注意的是，尽管 `if` 语句在 `Nginx` 中是有效的，但它可能会导致性能问题，并且在某些情况下可能不起作用。如果您担心性能问题，可以考虑使用更高效的方法，如根据不同的 `User-Agent` 头部信息设置不同的变量，并使用 `map` 指令匹配。

### 配置负载均衡

要在 `Nginx` 中配置负载均衡，您可以使用 `upstream` 块定义一组后端服务器，并在 `server` 块中使用 `proxy_pass` 指令将请求代理到这组后端服务器。以下是一个示例配置：

``` nginx
http {
  upstream backend {
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
  }

  server {
    listen 80;
    server_name example.com;

    location / {
      proxy_pass          http://backend;
      proxy_set_header    Host $proxy_host;
      proxy_set_header    X-Real-IP $remote_addr;
      proxy_set_header    X-Forwarded-For $proxy_add_x_forwarded_for;
    }
  }
}
```

在这个配置中：

- **`upstream backend`**：定义了一个名为 `backend` 的负载均衡组，其中包含了三个后端服务器：`backend1.example.com`、`backend2.example.com` 和 `backend3.example.com`。
- **`server块中的location /`**：匹配所有请求。
- **`proxy_pass http://backend;`**：将请求代理到名为 `backend` 的负载均衡组中的服务器。`Nginx` 会自动根据默认的负载均衡算法（轮询）将请求分发到这组后端服务器中的一个。
- **`proxy_set_header`**：设置代理请求的头部信息，如真实 `IP` 地址、转发者 `IP` 地址和主机地址。


您还可以根据需要添加其他负载均衡配置选项，例如设置负载均衡算法、调整权重等。以下是一个更复杂的负载均衡配置示例：

``` nginx
http {
  upstream backend {
    least_conn; # 使用最少连接数算法
    server backend1.example.com weight=3;
    server backend2.example.com;
    server backend3.example.com;
  }

  server {
    listen 80;
    server_name example.com;

    location / {
      proxy_pass http://backend;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;
    }
  }
}
```

在这个配置中：

- **`least_conn`**：使用最少连接数算法进行负载均衡。
- **`server backend1.example.com weight=3;`**：设置 `backend1.example.com` 的权重为 `3`，比其他后端服务器更具优先级。
- **`proxy_set_header`**：设置代理请求的头部信息，如真实 `IP` 地址、转发者 `IP` 地址和主机地址。


### 总结

本文介绍了一些常用的 `Nginx` 基础配置，包括虚拟主机配置、`HTTP` 重定向、反向代理、`SSL/TLS` 配置等内容，并提供了详细的示例说明。正确配置 `Nginx` 不仅可以提高网站的性能和安全性，还能提升用户体验和搜索引擎排名。希望本文能够帮助您更好地理解和应用 `Nginx`，在实际项目中发挥其作用。

**注意：**

配置完成后，保存并关闭文件，然后重新加载Nginx以使配置生效：

``` bash
sudo systemctl reload nginx
```


