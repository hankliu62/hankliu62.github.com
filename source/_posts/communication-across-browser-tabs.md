---
title: 跨浏览器标签页进行通讯的方式简介
date: 2024-04-20 20:20:20
tag: [html, html5]
---

## 跨浏览器标签页进行通讯的方式简介

在现代 `Web` 应用程序中，跨浏览器标签页之间进行通讯是一项重要的功能。无论是在多标签页应用程序中同步状态，还是在不同浏览器窗口之间共享数据，实现跨标签页通讯都是必不可少的。在本文中，我们将探讨跨浏览器标签页进行通讯的各种方式，并详细介绍每种方式的 `API` 和使用场景。

### 所有方法

1. 使用 `Web Storage API`
2. 使用 `Broadcast Channel API`
3. 使用 `SharedWorker`
4. 使用 `Service Worker`
5. 使用 `WebSocket`
6. 使用 `PostMessage API`
7. 使用 `IndexedDB`

### Web Storage API

#### 简介

- **简介**：`Web Storage API` 提供了一种在客户端存储数据的方法，包括 `localStorage` 和 `sessionStorage` 两种方式。它们可以在不同的浏览器标签页之间共享数据，而不受页面刷新或关闭的影响。
- **优点**：简单易用，支持持久化存储。
- **缺点**：只能存储字符串类型的数据，且容量有限。
- **适用场景**：适合存储小型数据，如用户偏好设置或临时状态。

#### API

- **localStorage**: 保存的数据没有过期时间，可以一直存在于浏览器中。
- **sessionStorage**: 保存的数据在浏览器会话结束时被清除，适合临时存储数据。

#### 使用场景

- 在同一浏览器的不同标签页中共享数据。
- 存储用户首选项或状态信息。

``` html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Storage Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="saveData()">Save Data</button>
    <button onclick="getData()">Get Data</button>

    <script>
        function saveData() {
            const input = document.getElementById('input').value;
            localStorage.setItem('data', input);
        }

        function getData() {
            const data = localStorage.getItem('data');
            alert(data);
        }

        window.addEventListener('storage', event => {
            alert('Data changed in another tab: ' + event.newValue);
        });
    </script>
</body>
</html>

<!-- another-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Another Page</title>
</head>
<body>
    <button onclick="getData()">Get Data from Main Page</button>

    <script>
        function getData() {
            const data = localStorage.getItem('data');
            alert(data);
        }

        window.addEventListener('storage', event => {
            alert('Data changed in another tab: ' + event.newValue);
        });
    </script>
</body>
</html>
```

在一个页面中输入数据并保存，然后在另一个页面中点击按钮获取数据。同时，当一个标签页修改了 localStorage 的值，另一个标签页也会收到通知。

### Broadcast Channel API

#### 简介

- **简介**：`Broadcast Channel API` 允许在不同的浏览器标签页之间进行实时通信，通过创建一个共享的消息通道来传递数据。
- **优点**：支持实时通信，消息发送和接收都非常简单。
- **缺点**：不支持 `IE` 浏览器。
- **适用场景**：适合需要实时通讯的场景，如多标签页间的数据同步。

#### API
- **BroadcastChannel**: 创建一个用于跨文档通信的通道。

#### 使用场景
- 在不同的浏览器标签页之间传递消息。

``` html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Broadcast Channel Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="sendMessage()">Send Message</button>

    <script>
        const channel = new BroadcastChannel('channel');

        function sendMessage() {
            const input = document.getElementById('input').value;
            channel.postMessage(input);
        }
    </script>
</body>
</html>

<!-- another-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Another Page</title>
</head>
<body>
    <p id="message"></p>

    <script>
        const channel = new BroadcastChannel('channel');

        channel.onmessage = event => {
            document.getElementById('message').textContent = event.data;
        };
    </script>
</body>
</html>
```

在一个页面中输入消息并发送，在另一个页面中接收并显示消息。

### SharedWorker

#### 简介

- **简介**：`SharedWorker` 允许在多个浏览器上下文之间共享同一个 `Worker` 实例，提供了一种全局范围的通讯机制。
- **优点**：支持多标签页之间的实时通信，可以与所有标签页共享相同的数据。
- **缺点**：不支持 `IE` 浏览器。
- **适用场景**：适合需要共享状态或实现实时通讯的场景。

#### API
- **SharedWorker**: 创建一个共享的 `Web Worker` 实例，可以被多个浏览上下文共享。

#### 使用场景

- 在不同浏览器标签页之间共享数据或进行通讯。

``` html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SharedWorker Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="sendMessage()">Send Message</button>

    <script>
        const worker = new SharedWorker('worker.js');

        function sendMessage() {
            const input = document.getElementById('input').value;
            worker.port.postMessage(input);
        }

        worker.port.onmessage = event => {
            alert(event.data);
        };
    </script>
</body>
</html>
```

``` javascript
// worker.js
const ports = [];

onconnect = event => {
    const port = event.ports[0];
    ports.push(port);
    port.onmessage = event => {
        const message = event.data;
        ports.forEach(port => port.postMessage(message));
    };
};
```

在一个页面中输入消息并发送，在另一个页面中接收并显示消息。

### Service Worker

#### 简介
- **简介**：`Service Worker` 是一种在浏览器后台运行的脚本，可以拦截和处理网络请求，并实现离线缓存和推送通知等功能。
- **优点**：支持后台运行，可以拦截网络请求，实现离线缓存和推送通知。
- **缺点**：只能用于现代浏览器，且需要 `HTTPS` 支持。
- **适用场景**：适合需要离线访问或推送通知的场景，如聊天应用或离线应用。

#### API

- **Service Worker**: 在后台运行的脚本，可以拦截和处理网络请求，并进行推送通知等功能。

#### 使用场景

- 在不同标签页之间共享数据或进行通讯。
- 实现离线缓存和推送通知。

``` html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Service Worker Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="sendMessage()">Send Message</button>

    <script>
        // 注册 Service Worker
        navigator.serviceWorker.register('sw.js');

        // 发送消息
        function sendMessage() {
            const input = document.getElementById('input').value;
            navigator.serviceWorker.controller.postMessage(input);
        }

        // 监听消息
        navigator.serviceWorker.addEventListener('message', event => {
            alert(event.data);
        });
    </script>
</body>
</html>
```

``` javascript
// sw.js
self.addEventListener('message', event => {
    const message = event.data;
    clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage(message));
    });
});
```

在一个页面中输入消息并发送，在另一个页面中接收并显示消息。

### WebSocket

#### 简介

- **简介**：`WebSocket` 提供了一种在客户端和服务器之间建立持久连接的方式，实现了双向通信。
- **优点**：支持双向通信，可以实现实时通讯。
- **缺点**：需要在服务器端实现 `WebSocket` 服务，且不支持跨域请求。
- **适用场景**：适合实时通讯场景，如聊天应用或在线游戏。

#### API
- **WebSocket**: 在客户端和服务器之间建立持久连接，实现双向通信。

#### 使用场景

在不同浏览器标签页之间进行实时通讯。

```javascript
// server.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', ws => {
    ws.on('message', message => {
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});
```

``` html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WebSocket Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="sendMessage()">Send Message</button>

    <script>
        const socket = new WebSocket('ws://localhost:8080');

        function sendMessage() {
            const input = document.getElementById('input').value;
            socket.send(input);
        }

        socket.onmessage = event => {
            alert(event.data);
        };
    </script>
</body>
</html>
```

在一个页面中输入消息并发送，在另一个页面中接收并显示消息。

### PostMessage API

#### 简介

- **简介**：`PostMessage API` 允许跨文档之间安全地传递消息，可以实现跨域通信。
- **优点**：支持跨域通信，使用简单。
- **缺点**：需要对接收消息的文档进行信任验证，存在安全风险。
- **适用场景**：适合不同域名之间的数据交换或通信。

#### API
- **window.postMessage()**: 向其他窗口发送消息。

#### 使用场景

- 在不同窗口之间进行跨域通信。

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PostMessage Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="sendMessage()">Send Message</button>

    <script>
        const popup = window.open('another-page.html');

        function sendMessage() {
            const input = document.getElementById('input').value;
            popup.postMessage(input, '*');
        }
    </script>
</body>
</html>

<!-- another-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Another Page</title>
</head>
<body>
    <p id="message"></p>

    <script>
        window.addEventListener('message', event => {
            document.getElementById('message').textContent = event.data;
        });
    </script>
</body>
</html>
```

在一个页面中输入数据并保存，然后在另一个页面中点击按钮获取数据。

### IndexedDB

#### 简介

- **简介**：`IndexedDB` 提供了一个异步的、事务型的数据库，适用于存储大量结构化数据。
- **优点**：支持存储大量结构化数据，数据存储在客户端本地。
- **缺点**：使用复杂，需要学习 `IndexedDB` 的 `API`。
- **适用场景**：适合需要存储大量结构化数据的场景，如离线应用或数据分析应用。

#### API

- **IndexedDB**: 提供了一个异步的、事务型的数据库。

#### 使用场景

- 存储大量结构化数据，如离线应用程序的数据。

``` html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IndexedDB Example</title>
</head>
<body>
    <input type="text" id="input">
    <button onclick="saveData()">Save Data</button>
    <button onclick="getData()">Get Data</button>

    <script>
        const request = indexedDB.open('myDatabase');

        request.onupgradeneeded = event => {
            const db = event.target.result;
            const objectStore = db.createObjectStore('data', { keyPath: 'id' });
        };

        function saveData() {
            const input = document.getElementById('input').value;
            const db = request.result;
            const transaction = db.transaction('data', 'readwrite');
            const objectStore = transaction.objectStore('data');
            objectStore.add({ id: 1, data: input });
        }

        function getData() {
            const db = request.result;
            const transaction = db.transaction('data', 'readonly');
            const objectStore = transaction.objectStore('data');
            const request = objectStore.get(1);
            request.onsuccess = event => {
                const data = event.target.result;
                alert(data.data);
            };
        }
    </script>
</body>
</html>

<!-- another-page.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Another Page</title>
</head>
<body>
    <button onclick="getData()">Get Data from Main Page</button>

    <script>
        function getData() {
            const request = indexedDB.open('myDatabase');
            request.onsuccess = event => {
                const db = event.target.result;
                const transaction = db.transaction('data', 'readonly');
                const objectStore = transaction.objectStore('data');
                const request = objectStore.get(1);
                request.onsuccess = event => {
                    const data = event.target.result;
                    alert(data.data);
                };
            };
        }
    </script>
</body>
</html>
```

在一个页面中输入数据并保存，然后在另一个页面中点击按钮获取数据。

### 总结

在本文中，我们介绍了跨浏览器标签页进行通讯的多种方式，并提供了详细的 `API` 和使用场景。根据您的具体需求和项目要求