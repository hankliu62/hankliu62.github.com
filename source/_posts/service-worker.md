---
title: Service Worker：提升网页性能与用户体验的关键技术
date: 2019-10-12 18:20:12
tag: [service worker]
---

## Service Worker：提升网页性能与用户体验的关键技术

随着互联网的快速发展，网页应用的复杂性不断提高，对性能和用户体验的要求也日益增强。为了应对这些挑战，浏览器技术也在不断进步，其中 `Service Worker` 作为一种在浏览器后台独立运行的脚本，成为了优化网页性能、提升用户体验的关键技术。

### 基本概念

`Service Worker` 是一种运行在浏览器后台的脚本，它独立于网页内容，不会阻塞页面的渲染。它允许开发人员在浏览器和网络之间设置一个代理服务器，拦截和处理网络请求，实现缓存、推送通知、消息传递等功能。`Service Worker` 使得网页能够在离线状态下运行，提高页面加载速度，优化用户体验。

![caniuse_service_worker](https://github.com/hankliu62/interview/assets/8088864/38008e09-c6ed-4931-9647-dd6a44ffa651)

### 生命周期

`Service Worker` 的生命周期完全独立于网页。

当 `Service Worker` 被注册成功后，它将开始它的生命周期，我们对 `Service Worker` 的操作一般都是在其生命周期里面进行的。`Service Worker` 的生命周期分为下面几个状态：`installing` -> `installed` -> `activating` -> `activated` -> `redundant。`

![f54bdb55c775be0498c6efcd55a73020](https://github.com/hankliu62/interview/assets/8088864/74471829-ccdc-49fe-b0ec-babd87488e44)

1. **installing(安装)：**这个状态发生在 `Service Worker` 注册之后，表示开始安装，这个状态会触发 `install` 事件，一般会在 `install` 事件的回调里面进行静态资源的离线缓存， 如果这些静态资源缓存失败了，那 `Service Worker` 安装就会失败，生命周期终止。

2. **installed(安装后)：**当成功捕获缓存到的资源时，`Service Worker` 会变为这个状态，当此时没有其他的 `Service Worker` 线程在工作时，会立即进入激活状态，如果此时有正在工作的 `Service Worker` 工作线程，则会等待其他的 `Service Worker` 线程被关闭后才会被激活。可以使用 `self.skipWaiting()` 方法强制正在等待的 `Service Worker` 工作线程进入激活状态。

3. **activating(激活)：**在这个状态下会触发 `activate` 事件，在 `activate` 事件的回调中去清理旧版缓存。

4. **activated(激活后)：**在这个状态下，`Service Worker` 会取得对整个页面的控制

5. **redundant(废弃状态)：**这个状态表示一个 `Service Worker` 的生命周期结束。新版本的 `Service Worker` 替换了旧版本的 `Service Worker` 会出现这个状态

### 常用接口

- [Cache](https://developer.mozilla.org/zh-CN/docs/Web/API/Cache)
表示用于 [Request](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) / [Response](https://developer.mozilla.org/zh-CN/docs/Web/API/Response) 对象对的存储，作为 `Service Worker` 生命周期的一部分被缓存。

- [CacheStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/CacheStorage)
表示 `Cache` 对象的存储。提供一个所有命名缓存的主目录，`Service Worker` 可以访问并维护名字字符串到 `Cache` 对象的映射。

- [Client](https://developer.mozilla.org/zh-CN/docs/Web/API/Client)
表示 `service worker client` 的作用域。一个 `service worker client` 可以是浏览器上下文的一个文档，也可以是一个由 `active worker` 控制的 `Shared Worker`。

- [Clients](https://developer.mozilla.org/zh-CN/docs/Web/API/Clients)
表示一个 `Client` 对象容器；是访问当前源的活动的 `service worker client` 的主要途径。

- [ExtendableEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/ExtendableEvent)
扩展被分发到 `ServiceWorkerGlobalScope` 的 `install` 和 `activate` 事件时序，作为` service worker` 生命周期的一部分。这会确保任何功能型事件（如 `FetchEvent`）不被分发到 `Service Worker`，直到它更新了数据库架构、删除过期缓存项等等以后。

- [ExtendableMessageEvent](https://developer.mozilla.org/en-US/docs/Web/API/ExtendableMessageEvent)
向 `Service Worker` 触发的 `message`  事件的时间对象（当 `ServiceWorkerGlobalScope` 从另一个上下文收到通道消息），延长了此类事件的生命周期。

- [FetchEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/FetchEvent)
传递给 `ServiceWorkerGlobalScope.onfetch` 处理函数的参数，`FetchEvent` 代表一个在 `Service Worker` 的 `ServiceWorkerGlobalScope` 中分发的请求动作。它包含关于请求和响应的结果信息，并且提供 `FetchEvent.respondWith()` 方法，这个方法允许我们提供任意的响应返回到控制页面。

- [NavigationPreloadManager](https://developer.mozilla.org/en-US/docs/Web/API/NavigationPreloadManager)
提供与 `Service Worker` 一起管理资源预加载的方法。

- [Navigator.serviceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/serviceWorker)
返回一个 `ServiceWorkerContainer` 对象，该对象提供对相关 `document` 的注册、删除、更新以及与 `Service Worker` 对象通信的访问。

- [NotificationEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/NotificationEvent)
传递给 `onnotificationclick` 处理函数的参数，`NotificationEvent` 接口代表在 `Service Worker` 的 `ServiceWorkerGlobalScope` 中分发的单击事件通知。

- [ServiceWorker](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorker)
表示一个 `Service Worker`。多个浏览的上下文 (例如 `page`、`worker` 等等) 都能通过相同的 `Service Worker` 对象相关联。

- [ServiceWorkerContainer](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorkerContainer)
提供一个在网络生态中把 `service worker` 作为一个整体的对象，包括辅助注册，反注册以及更新 `service worker`，并且访问 `service worker` 的状态以及他们的注册信息。

- [ServiceWorkerGlobalScope](https://developer.mozilla.org/zh-CN/docs/Web/API/ServiceWorkerGlobalScope)
表示 `service worker` 的全局执行上下文。

- [MessageEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/MessageEvent)
表示发送到 `ServiceWorkerGlobalScope` 的信息。

- [ServiceWorkerRegistration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration)
表示 `service worker` 的注册。

- [WindowClient](https://developer.mozilla.org/en-US/docs/Web/API/WindowClient)
表示在浏览器上下文中记录的 `service worker` 客户端的作用域，被活动的工作者控制。是 `Client` 对象的特殊类型，包含一些附加的方法和可用的属性。


### 使用场景

#### 缓存管理

`Service Worker` 可以拦截和处理网络请求，将资源缓存在本地，实现离线访问和快速加载。开发人员可以根据需求自定义缓存策略，提高网页的加载速度和性能。

下面是一个简单的 Service Worker 缓存管理的例子，用于缓存和提供静态资源。

首先，你需要注册一个 Service Worker：

``` js
// 在你的主 JavaScript 文件中，例如 main.js
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(() => console.log('Service Worker 已注册'))
    .catch(err => console.error('Service Worker 注册失败:', err));
}
```

然后，创建一个 service-worker.js 文件，用于定义缓存策略：

``` js
// service-worker.js

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      // 打开一个名为 'my-cache' 的缓存
      return cache.addAll([
        '/',
        '/styles/main.css',
        '/script/main.js'
        // 你可以添加更多需要缓存的资源
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          (res) => {
            // Check if we received a valid response
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return response;
            }
            // Important: Clone the response. A response is a stream and
            // can only be consumed once.
            const responseToCache = res.clone();
            caches.open('my-cache').then((cache) => {
              // Take the response from the network,
              // and put a copy in the cache.
              cache.put(event.request, responseToCache);
            });
            return res;
          }
        );
      })
  );
});
```

这个例子中，当 `Service Worker` 安装时，它会打开一个名为 `'my-cache'` 的缓存，并添加一些资源到缓存中。当浏览器请求这些资源时，`Service Worker` 会首先检查缓存中是否有这些资源。如果有，它会直接从缓存中提供这些资源，而不是从网络上获取。如果缓存中没有这些资源，`Service Worker` 会从网络上获取它们，然后将它们添加到缓存中，以便下次可以直接从缓存中提供。

> 注意，为了简化示例，这里并没有处理所有可能的错误情况，也没有考虑缓存的更新和失效策略。在实际应用中，你可能需要根据你的具体需求来定制你的缓存策略。

#### 推送通知

`Service Worker` 可以接收来自服务器的推送消息，即使网页未打开或处于休眠状态，也能向用户发送通知。这一功能使得开发者能够及时向用户传达重要信息，提高应用的活跃度和用户粘性。

下面是一个使用 `Service Worker` 和 `Push API` 发送推送通知的基本例子。

首先，你需要注册 `Service Worker` 并订阅推送消息：

``` js
// main.js

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker 注册成功:', registration.scope);

      // 检查浏览器是否支持显示通知
      if (!('Notification' in window)) {
        alert('此浏览器不支持桌面通知');
      }

      // 检查是否已授予权限
      else if (Notification.permission === 'granted') {
        // 如果用户已授予权限，我们可以立即注册推送
        subscribeUser();
      }

      // 否则，我们需要询问用户
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (permission) {
          if (permission === 'granted') {
            subscribeUser();
          }
        });
      }

      // 订阅推送通知
      function subscribeUser() {
        return registration.pushManager.subscribe({
          userVisibleOnly: true
        })
        .then(function(subscription) {
          console.log('用户已订阅推送通知:', subscription);

          // 将订阅信息发送到服务器
          sendSubscriptionToServer(subscription);
        })
        .catch(function(err) {
          console.error('无法订阅推送通知:', err);
        });
      }

      // 将订阅信息发送到服务器
      function sendSubscriptionToServer(subscription) {
        // TODO: 将 subscription 发送到你的服务器
        console.log('将订阅信息发送到服务器:', subscription);
      }
    })
    .catch(function(err) {
      console.error('Service Worker 注册失败:', err);
    });
}
```

然后，你需要一个 `Service Worker` 脚本 (`service-worker.js`) 来接收和显示推送通知：

``` js
// service-worker.js

self.addEventListener('push', function(event) {
  console.log('收到推送消息:', event);

  // 你可能需要从服务器获取一些数据来显示通知
  // 这里只是一个简单的示例
  var title = '推送通知';
  var body = '你收到了一条新消息！';
  var icon = '/images/icon.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  console.log('用户点击了通知:', event);

  // 用户点击通知后，你可以执行一些操作，例如打开一个新的页面
  event.notification.close();

  // 例如，打开一个特定的 URL
  event.waitUntil(
    clients.openWindow('https://example.com/notification-clicked')
  );
});
```

> 请注意，为了实际使用推送通知，你还需要一个服务器端的组件来发送推送消息。这通常涉及到使用 `Web Push Protocol (Web Push)` 与用户的浏览器进行通信。此外，你可能需要配置你的服务器以接收订阅信息，并在需要时发送推送消息。

> 此外，由于推送通知和 `Service Worker` 的复杂性，这里提供的代码只是一个起点。在生产环境中，你可能需要处理更多细节，如错误处理、用户权限管理、通知内容的动态生成等。

#### 消息传递

`Service Worker` 可以与其他浏览器环境（如页面、扩展程序等）进行双向通信，实现消息传递和共享数据。这使得开发者能够在不同环境之间传递信息，实现更复杂的功能和更好的用户体验。

下面是一个简单的 `Service Worker` 消息传递的例子。

首先，注册并启动 `Service Worker`：

``` javascript
// main.js

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log('Service Worker 注册成功:', registration.scope);

      // 向 Service Worker 发送消息
      registration.active.postMessage({ action: 'hello' });

      // 监听来自 Service Worker 的消息
      navigator.serviceWorker.addEventListener('message', event => {
        console.log('收到来自 Service Worker 的消息:', event.data);
        if (event.data.action === 'response') {
          alert('Service Worker 回应了: ' + event.data.message);
        }
      });
    })
    .catch(err => {
      console.error('Service Worker 注册失败:', err);
    });
}
```

然后，在 `service-worker.js` 中处理接收到的消息，并发送响应：

``` javascript
// service-worker.js

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      // 缓存逻辑
    })
  );
});

self.addEventListener('activate', (event) => {
  // 激活逻辑
});

self.addEventListener('fetch', (event) => {
  // 拦截请求和响应的逻辑
});

self.addEventListener('message', (event) => {
  console.log('收到来自页面的消息:', event.data);
  if (event.data.action === 'hello') {
    // 向页面发送回应
    event.ports[0].postMessage({ action: 'response', message: '你好，页面！' });
  }
});
```

在这个例子中，当页面加载并成功注册 `Service Worker` 后，它会向 `Service Worker` 发送一个包含 `action: 'hello'` 的消息。`Service Worker` 监听到这个消息后，会打印出收到的消息内容，并通过 `event.ports[0].postMessage` 向页面发送一个回应消息，其中包含了 `action: 'response'` 和一条消息字符串。

页面通过监听 `message` 事件来接收来自 `Service Worker` 的回应，并在控制台中打印出消息内容。如果回应消息中的 `action` 是 `'response'`，页面会弹出一个警告框显示收到的消息。

> 请注意，`postMessage API` 允许在 `Service Worker` 和页面之间传递结构化数据，如对象、数组、字符串等。但是，出于安全考虑，不能直接传递函数、DOM 对象或其他某些类型的数据。此外，`event.ports` 提供了一个双向通信的通道，允许 `Service Worker` 和页面之间进行更复杂的交互。

### 优缺点

#### 优点：

1. **提高网页性能：**通过缓存管理，`Service Worker` 可以减少网络请求，降低带宽消耗，提高网页加载速度。
2. **提升用户体验：**`Service Worker` 可以实现离线访问、推送通知等功能，提高用户的满意度和粘性。
3. **拓展性强：**`Service Worker` 可以与其他浏览器环境进行通信，为开发者提供更多可能性。

#### 缺点：

1. **兼容性问题：**虽然主流浏览器都支持 `Service Worker` ，但在一些旧版本或非主流浏览器中可能无法使用。
2. **学习成本高：**使用 `Service Worker` 需要一定的技术储备和学习成本，对于初学者来说可能有一定的难度。

### 总结

`Service Worker` 作为一种在浏览器后台运行的脚本技术，为优化网页性能和提升用户体验提供了有力支持。通过缓存管理、推送通知和消息传递等功能，`Service Worker` 使得网页能够在离线状态下运行，提高加载速度，及时向用户传达重要信息，实现更复杂的功能和更好的用户体验。虽然存在一些兼容性和学习成本的问题，但随着技术的不断发展和普及，相信 `Service Worker` 将在未来的网页开发中发挥越来越重要的作用。