---
title: 使用 AbortController 实现异步操作控制
date: 2024-04-12 10:00:00
tag: [html5]
---

## 使用 AbortController 实现异步操作控制

### 背景

在 `JavaScript` 中，我们经常需要执行一些异步操作，例如发起网络请求、执行定时任务等。然而，有时候我们希望能够在某些条件下中止这些异步操作，以节省资源或提高用户体验。这时候，`AbortController` 就派上了用场。

`AbortController` 是一个可以用来控制异步操作的对象，它可以与 `Promise`、`Fetch API` 等配合使用，实现在异步操作进行中中止操作的功能。本文将介绍 `AbortController` 的基本用法，并提供详细的示例来说明其在实际场景中的应用。

### 基本用法
`AbortController` 提供了两个主要的方法：`abort()` 和 `signal` 属性。

- **abort()**: 调用该方法可以中止与 `AbortController` 相关联的异步操作。
- **signal**: 这是一个只读属性，它返回一个 `AbortSignal` 对象，用于监听异步操作的中止状态。
下面是一个基本的示例：

``` javascript

const controller = new AbortController();
const signal = controller.signal;

// 监听中止信号
signal.addEventListener('abort', () => {
  console.log('Operation aborted');
});

// 5秒后中止操作
setTimeout(() => {
  controller.abort();
}, 5000);
```

在这个示例中，我们创建了一个 `AbortController` 对象 `controller`，并从中获取了 `signal` 属性。然后，我们通过 `setTimeout()` 函数设定了一个 `5` 秒后的定时任务，当定时任务执行时，调用了 `controller.abort()` 方法来中止操作。同时，我们通过 `signal.addEventListener()` 方法监听了中止信号，并在中止时输出了一条日志。

### 结合 Fetch API

`AbortController` 最常见的用法之一是与 `Fetch API` 结合使用，实现中止网络请求的功能。下面是一个示例：

``` javascript

const controller = new AbortController();
const signal = controller.signal;

fetch('https://api.example.com/data', { signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Request aborted');
    } else {
      console.error('Error:', error);
    }
  });

// 10秒后中止请求
setTimeout(() => {
  controller.abort();
}, 10000);
```

在这个示例中，我们创建了一个 `AbortController` 对象 `controller`，并将其与 `Fetch API` 中的 `signal` 属性关联起来。然后，我们发起了一个网络请求，当请求完成时输出了返回的数据，如果请求被中止，则捕获到 `AbortError` 并输出一条相应的日志。最后，我们设置了一个 10 秒后的定时任务，当定时任务执行时，调用了 `controller.abort()` 方法来中止网络请求。

### 结合 Promise

除了与 `Fetch API` 结合使用外，`AbortController` 还可以与 `Promise` 结合使用，实现中止 `Promise` 执行的功能。下面是一个示例：

``` javascript

function fetchData(signal) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (signal.aborted) {
        reject(new DOMException('AbortError', 'AbortError'));
      } else {
        resolve('Data fetched successfully');
      }
    }, 3000);
  });
}

const controller = new AbortController();
const signal = controller.signal;

fetchData(signal)
  .then(data => console.log(data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('Operation aborted');
    } else {
      console.error('Error:', error);
    }
  });

// 5秒后中止操作
setTimeout(() => {
  controller.abort();
}, 5000);
```

在这个示例中，我们定义了一个 `fetchData()` 函数，该函数返回一个 `Promise` 对象，在一定时间后返回数据或者中止操作。然后，我们创建了一个 `AbortController` 对象 `controller`，并将其与 `Promise` 关联起来。最后，我们设置了一个 `5` 秒后的定时任务，当定时任务执行时，调用了 `controller.abort()` 方法来中止 `Promise` 执行。

### Axios 请求通过 CancelToken 来取消请求

`Axios` 自带有取消请求的借口，在 `Axios` 中通过 `CancelToken` 取消请求发送。下面是一个示例：

``` javascript
/ 引入 Axios 库
const axios = require('axios');

// 创建一个 CancelToken.source 对象
const { CancelToken, axiosInstance } = axios;
const source = CancelToken.source();

// 创建一个 Axios 请求
const request = axiosInstance.get('https://api.example.com/data', {
  cancelToken: source.token // 传递 CancelToken 对象到请求配置中
});

// 设置一个定时器，在 3 秒后取消请求
setTimeout(() => {
  source.cancel('Request canceled due to timeout');
}, 3000);

// 发起请求并处理响应
request.then(response => {
  console.log('Response:', response.data);
}).catch(error => {
  if (axios.isCancel(error)) {
    console.log('Request canceled:', error.message);
  } else {
    console.error('Error:', error);
  }
});
```

在这个示例中，我们首先引入 `Axios` 库，并创建了一个 `CancelToken.source` 对象 `source`。然后，我们发起一个 `GET` 请求，并在请求配置中传递了 `cancelToken: source.token`，以便 `Axios` 知道我们要使用哪个 `CancelToken` 来取消请求。

接着，我们设置了一个定时器，在 `3` 秒后调用 `source.cancel()` 方法取消请求，并传递了一个取消原因。最后，我们发起请求，并在 `.then()` 和 `.catch()` 方法中分别处理响应和错误。如果请求被取消，我们通过 `axios.isCancel(error)` 来检查错误类型，并输出相应的日志。

### XMLHttpRequest 通过 abort 来取消请求

在现代浏览器环境中，我们可以使用 `XMLHttpRequest（XHR）` 对象来发起网络请求，`XHR` 里面存在 `abort` 能用来取消这些请求。以下是一个使用XHR取消请求的示例：

``` javascript
// 创建一个XHR对象
const xhr = new XMLHttpRequest();

// 监听请求状态变化
xhr.onreadystatechange = function() {
  // 请求完成并且响应状态为200时，处理响应
  if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
    console.log('Response:', xhr.responseText);
  }
};

// 准备发送请求，但不发送
xhr.open('GET', 'https://api.example.com/data');

// 发送请求
xhr.send();

// 设置一个定时器，在3秒后取消请求
setTimeout(() => {
  xhr.abort();
  console.log('Request canceled');
}, 3000);
```

在这个示例中，我们首先创建了一个 `XMLHttpRequest` 对象 `xhr`，并设置了它的 `onreadystatechange` 事件处理程序来监听请求状态变化。然后，我们调用 `xhr.open()` 方法来准备发送一个 `GET` 请求到指定的 `URL`，但并不发送请求。接着，我们调用 `xhr.send()` 方法来实际发送请求。

同时，我们设置了一个定时器，在3秒后调用 `xhr.abort()` 方法来取消请求。当调用 `xhr.abort()` 方法时，`XHR` 对象将会立即终止当前的网络请求。

最后，当请求完成并且响应状态为 `200` 时，我们通过 `xhr.responseText` 属性获取响应数据，并输出到控制台。

### 结论

`AbortController` 是一个非常有用的工具，它为我们提供了在异步操作进行中中止操作的能力。通过结合 `Fetch API`、`Promise` 等，我们可以在网络请求、定时任务等场景中灵活地使用 `AbortController`，从而提高代码的可控性和可靠性。希望本文的介绍能够帮助你更好地理解和应用 `AbortController`。