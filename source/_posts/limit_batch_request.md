---
title: JavaScript 批量请求管理
date: 2024-05-20 15:20:12
tag: [javascript]
---

## JavaScript 批量请求管理

在现代前端开发中，高效地管理多个并发请求至关重要。无论是从 API 获取数据、处理用户交互，还是处理文件，管理和限制同时进行的请求数量都能显著影响应用的性能和可靠性。在这篇博客文章中，我们将深入探讨使用 JavaScript 管理并发请求的细节，重点介绍如何实现限制并发请求数量的实用方案。

### 为什么要限制并发请求？

在深入代码之前，让我们讨论一下为什么限制并发请求很重要：

1. **服务器负载管理**：限制并发请求数量可以防止服务器过载，从而更好地利用资源并保持服务器稳定。
2. **浏览器限制**：浏览器对单个域名的同时连接数有限制，超过这个限制会导致请求排队，进而降低性能。
3. **速率限制**：许多 API 强制执行速率限制，控制并发请求数量有助于遵守这些限制，避免被限速或禁止。
4. **用户体验**：管理并发请求可以提高用户体验，确保应用保持响应，不会因为过多的后台活动而卡顿。

### 实现请求队列

让我们在 JavaScript 中实现一个请求队列，以限制并发请求的数量。首先，定义一个模拟异步请求的 `fetch` 函数：

```javascript
function fetch(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(url);
    }, 3000);
  });
}
```

这个 `fetch` 函数接受一个 URL，返回一个在 3 秒后解决的 promise，模拟网络请求。

接下来，我们实现一个创建请求函数 `createRequest`，它能够限制并发请求的数量：

```javascript
const createRequest = (limit) => {
  const queue = [];
  let working = 0;

  return function request(url) {
    return new Promise((resolve, reject) => {
      if (working < limit) {
        fetch(url)
          .then(resolve, reject)
          .finally(() => {
            working--;
            if (queue.length > 0) {
              const cur = queue.shift();
              request(cur.url).then(cur.resolve, cur.reject);
            }
          });
        working++;
      } else {
        queue.push({ url, resolve, reject });
      }
    });
  };
};
```

这个 `createRequest` 函数接受一个限制数 `limit` 作为参数，返回一个请求函数 `request`。在 `request` 函数内部：
- 如果当前正在进行的请求数量 `working` 小于 `limit`，则直接发起请求。
- 否则，将请求添加到队列 `queue` 中。

在每个请求完成后，减少正在进行的请求数量 `working`，并检查队列中是否有待处理的请求，如果有，继续处理队列中的请求。

下面，我们来看看如何使用这个请求函数：

```javascript
 // 等前五个任意一个请求结束后，真正发送请求
const request = createRequest(5);

request('url1').then((a) => console.log('1', a));
request('url2').then((a) => console.log('2', a));
request('url3').then((a) => console.log('3', a));
request('url4').then((a) => console.log('4', a));
request('url5').then((a) => console.log('5', a));
request('url6').then((a) => console.log('6', a));
request('url7').then((a) => console.log('7', a));
```

在上面的代码中，我们创建了一个限制并发请求数为 5 的 `request` 函数，并依次发起了 7 个请求。只有在前 5 个请求中的任意一个完成后，才会开始处理后续的请求。

### 实践案例

假设我们有一个需要批量请求 API 的应用，比如一个展示用户数据的界面。我们希望同时发起的请求数不超过 5 个，以确保服务器稳定并优化用户体验。

首先，我们定义一个模拟 API 请求的 `fetchUserData` 函数：

```javascript
function fetchUserData(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`UserData for user ${userId}`);
    }, Math.random() * 2000 + 1000); // 随机延迟 1 到 3 秒
  });
}
```

然后，我们使用 `createRequest` 函数创建一个限制并发请求数为 5 的 `requestUserData` 函数：

```javascript
const requestUserData = createRequest(5);
```

接下来，我们批量请求用户数据，并将结果打印到控制台：

```javascript
for (let i = 1; i <= 10; i++) {
  requestUserData(`user${i}`).then((data) => {
    console.log(data);
  });
}
```

在这个例子中，我们模拟了 10 个用户数据请求，每次最多只有 5 个请求并发进行。每个请求完成后，立即处理队列中的下一个请求。

### 总结

在这篇文章中，我们探讨了为什么限制并发请求很重要，并通过一个实用的例子演示了如何在 JavaScript 中实现一个请求队列。这个方法可以帮助我们更好地管理服务器负载、遵守 API 速率限制、优化浏览器性能，并提供更好的用户体验。

通过合理地管理并发请求，我们可以确保应用的稳定性和响应性，从而提升整体性能。如果你在开发中遇到需要批量处理请求的情况，希望本文的方法能对你有所帮助。
