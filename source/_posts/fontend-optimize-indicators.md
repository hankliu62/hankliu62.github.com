---
title: Web前端最新优化指标：从FP到FPS的全面解析
date: 2024-04-14 12:12:12
tag: [optimize]
---

## Web前端最新优化指标：从FP到FPS的全面解析

### 摘要
在当今互联网时代，Web前端性能优化是网站开发中至关重要的一环。随着技术的不断发展，出现了一系列新的性能指标，如`FP`、`FCP`、`FMP`、`LCP`、`TTI`、`CLS`、`FID`、`FPS`等。本文将深入探讨这些最新的Web前端优化指标，详细介绍获取和优化的方法，并提供丰富的实例和技巧，帮助开发者全面了解和应用于实践中。

### 引言
随着Web技术的不断发展，用户对网页加载速度和性能的要求越来越高。为了提供更好的用户体验，出现了一系列新的Web前端优化指标，如`FP`、`FCP`、`FMP`、`LCP`、`TTI`、`CLS`、`FID`、`FPS`等。本文将深入探讨这些指标的含义、获取方法以及优化技巧，帮助开发者更好地理解和应用于实践中。

### DOMContentLoaded 事件

`DOMContentLoaded` 事件，当 `HTML` 文档被完全加载和解析完成之后，`DOMContentLoaded` 事件被触发，无需等待样式表、图像和子框架的完成加载。

#### 获取 DOMContentLoaded 事件的方法：

通过监听 `document` 对象上的 `DOMContentLoaded` 事件获得：

``` javascript
document.addEventListener('DOMContentLoaded', function() {}, false)
```

#### DOMContentLoaded 事件持续时间

可以通过 `Performance API` 中的相关接口来获取 `DOMContentLoaded` 事件的开始和结束时间，如`performance.timing.domContentLoadedEventEnd`和`performance.timing.domContentLoadedEventStart`，两者相差就为持续时间。

``` javascript
// 计算规则
const dclTime = performance.timing.domContentLoadedEventEnd - performance.timing.domContentLoadedEventStart
```

### load 事件

`load` 事件，当页面中依赖的所有资源：DOM、图片、CSS、Flash、javascript 等都加载完后，执行完后会在 `window` 对象上触发对应的事件，

####
`window.onload` 注册的回调就会在 `load` 事件触发时候被调用，或者通过 `window.addEventListener` 来进行监听。

```javascript
window.onload = function() {}

// or

window.addEventListener('load', function() {}, false)
```

#### load 事件持续时间

可以通过 `Performance API` 中的相关接口来获取 `load` 事件的开始和结束时间，如`performance.timing.loadEventEnd`和`performance.timing.loadEventStart`，两者相差就为持续时间。

```javascript
const loadTime = performance.timing.loadEventEnd - performance.timing.loadEventStart;
```

### FP（First Paint）
FP是指浏览器首次将像素呈现到屏幕上的时间点，即首次绘制。它标志着页面开始加载的时间，但并不表示页面内容已经完全可见。下面是获取和优化FP的方法：

#### 获取FP的方法：
可以通过 `Performance API` 中的相关接口来获取FP时间，如`performance.timing.navigationStart`和`performance.getEntriesByType('paint')`等。

```javascript
// 获取FP时间
const entries = performance.getEntriesByType('paint');
for (const entry of entries) {
  // 首次渲染
  if (entry.name === 'first-paint') {
    // FP开始时间
    const fpTime = entry.startTime;
    console.log("FP时间：", fpTime);
  }
}
```

#### FP（First Paint）持续时间
FP持续时间是指从页面开始加载到首次绘制内容到屏幕上的时间间隔。可以通过 `PerformanceObserver` 对象，通过监听 `paint` 类型来获取，还能获得 `FP（First Paint）` 所花费的时间。

``` javascript
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  for (const entry of entries) {
    // 首次渲染
    if (entry.name === 'first-paint') {
      // FP开始时间
      const fpTime = entry.startTime;
      // 持续时间
      const duration = entry.duration;
      // FP结束时间
      const fpDurationTime = fpTime + duration;
      console.log("FP持续时间：", fpDurationTime);
    }
  }
});

observer.observe({ type: "paint", buffered: true });
```

#### 优化FP的方法：

优化FP可以通过减少页面加载时间和优化渲染流程来实现。例如，通过合并和压缩CSS、JavaScript文件，减少网络请求次数和文件大小，以加快页面加载速度。

``` html
<!-- 合并和压缩CSS文件 -->
<link rel="stylesheet" href="styles.css">

<!-- 合并和压缩JavaScript文件 -->
<script src="scripts.js"></script>
```

### FCP（First Contentful Paint）

FCP是指浏览器首次绘制来自DOM的内容的时间点，即首次内容绘制。它表示页面开始显示内容的时间，但并不表示所有内容都已加载完毕。下面是获取和优化FCP的方法：

#### 获取FCP的方法：
可以通过 `Performance API` 中的相关接口来获取FCP时间，如 `performance.timing.navigationStart` 和 `performance.timing.getEntriesByType('paint')` 等。

```javascript
// 获取FP时间
const entries = performance.getEntriesByType('paint');
for (const entry of entries) {
  // 首次渲染
  if (entry.name === 'first-contentful-paint') {
    // FCP开始时间
    const fcpTime = entry.startTime;
    console.log("FCP时间：", fcpTime);
  }
}
```

#### FCP（First Contentful Paint）持续时间
FCP持续时间是指从页面开始加载到首次绘制来自DOM的内容的时间间隔。可以通过 `PerformanceObserver` 对象，通过监听 `paint` 类型来获取，还能获得 `FCP（First Contentful Paint）` 所花费的时间。

``` javascript
// 获取FCP时间
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  for (const entry of entries) {
    // 首次渲染
    if (entry.name === 'first-contentful-paint') {
      // FCP开始时间
      const fcpTime = entry.startTime;
      // 持续时间
      const duration = entry.duration;
      // FCP持续时间
      const fcpDurationTime = fcpTime + duration;
      console.log("FCP持续时间：", fcpDurationTime);
    }
  }
});

observer.observe({ type: "paint", buffered: true });
```

#### 优化FCP的方法：

优化FCP可以通过减少关键资源的加载时间和优化关键路径资源来实现。例如，通过预加载关键资源、懒加载技术和延迟加载非关键资源等。

``` html
<!-- 预加载关键资源 -->
<link rel="preload" href="critical.css" as="style">

<!-- 懒加载非关键资源 -->
<img src="placeholder.jpg" data-src="image.jpg" loading="lazy">
```

### FMP（First Meaningful Paint）
FMP是指浏览器首次绘制页面主要内容的时间点，即首次有意义的绘制。它表示用户认为页面已经有用的时间点。下面是获取和优化FMP的方法：

#### 获取FMP的方法：
可以通过 `Performance API` 中的相关接口来获取FMP时间，如 `PerformanceObserver` 接口监听 `paint` 事件，判断首次有意义的绘制。

``` javascript
// FMP计算比较复杂，lighthouse的计算的大体思路是，将页面中最大布局变化后的第一次渲染事件作为FMP事件，并且计算中考虑到了可视区的因素。

// FMP计算过于复杂，没有现成的performance API，如果希望在监控中上报这个指标，可以自己使用MutationObserver计算。
```

#### FMP（First Meaningful Paint）持续时间
FMP持续时间是指从页面开始加载到首次绘制页面主要内容的时间间隔。可以通过监测FMP事件和页面开始加载之间的时间差来计算。

``` javascript
// FMP计算过于复杂，没有现成的performance API，如果希望在监控中上报这个指标，可以自己使用MutationObserver计算。
```

#### 优化FMP的方法：
优化FMP可以通过减少关键资源的加载时间和提高关键路径资源加载速度来实现。例如，使用HTTP/2多路复用和服务器推送技术，以及使用CDN加速关键资源加载。

``` html
<!-- 使用CDN加速关键资源 -->
<script src="https://cdn.example.com/scripts.js"></script>
```

### LCP（Largest Contentful Paint）

LCP是指浏览器在视觉上渲染的最大内容元素的时间点，即最大内容渲染时间点。它衡量的是页面主要内容加载完成的时间点。下面是获取和优化LCP的方法：

#### 获取LCP的方法：
可以通过 `Performance API` 中的相关接口来获取 `LCP` 时间，如 `PerformanceObserver` 接口监听 `largest-contentful-paint` 事件。

``` javascript
// 监听LCP事件
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const lcpTime = entries[0].startTime;
  console.log("LCP时间：", lcpTime);
});
observer.observe({ type: "largest-contentful-paint", buffered: true });
```

#### LCP（Largest Contentful Paint）持续时间
LCP持续时间是指从页面开始加载到最大内容元素被渲染完成的时间间隔。可以通过监测LCP事件和页面开始加载之间的时间差来计算。

``` javascript
const observer = new PerformanceObserver((list) => {
  // 计算最大的内容
  const entries = list.getEntries().sort((pre, next) => next.size - pre.size);
  // LCP开始事件
  const lcpTime = entries[0].startTime;
  // 持续时间
  const duration = entries[0].duration;
  // FCP持续时间
  const lcpDuration = lcpTime + duration;
  console.log('LCP持续时间：', lcpDuration);
});
observer.observe({ type: 'largest-contentful-paint', buffered: true });
```

#### 优化LCP的方法：
优化LCP可以通过优化关键路径资源的加载顺序和减少页面主要内容的渲染时间来实现。例如，使用懒加载技术延迟加载非关键内容，以及减少渲染阻塞资源的加载。

``` html
<!-- 使用懒加载延迟加载非关键内容 -->
<img src="placeholder.jpg" data-src="image.jpg" loading="lazy">
```

### TTI（Time to Interactive）
TTI是指页面变得可交互的时间点，即用户可以与页面进行交互的时间点。它是衡量页面可用性的重要指标。下面是获取和优化TTI的方法：

#### 获取TTI的方法：
可以通过 `Performance API` 中的相关接口来获取TTI时间，通过 `performance.timing.domInteractive` 和 `performance.timing.fetchStart` 的时间差来获得。

``` javascript
// 监听TTI事件
const timeToInteractive = performance.timing.domInteractive - performance.timing.fetchStart;
```

#### 优化TTI的方法：

优化TTI可以通过减少主线程阻塞时间和延迟加载非关键资源来实现。例如，通过减少JavaScript执行时间、使用服务端渲染技术和懒加载技术等。

``` javascript
// 使用懒加载延迟加载非关键资源
const image = document.createElement("img");
image.src = "image.jpg";
image.loading = "lazy";
document.body.appendChild(image);
```

### CLS（Cumulative Layout Shift）

CLS是指页面在加载过程中发生的所有不良布局变化的总和，即累积布局偏移。它衡量的是页面的视觉稳定性。发生的每次布局变化中的最大幅度的布局变化得分的指标。为了提供良好的用户体验，站点应该努力使 CLS 分数达到 **0.1** 或更低。下面是获取和优化CLS的方法：

#### 获取CLS的方法：
可以通过 `Performance API` 中的相关接口来获取CLS值，如 `PerformanceObserver` 接口监听 `layout-shift` 事件。

``` javascript
// 监听CLS事件
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const clsValue = entries.reduce((acc, entry) => acc + entry.value, 0);
  console.log("CLS值：", clsValue);
});
observer.observe({ type: "layout-shift" });
```

#### 优化CLS的方法：

优化CLS可以通过避免页面元素的不稳定布局和动态元素的尺寸变化来实现。例如，指定图片和媒体元素的尺寸、避免动态插入内容导致页面布局变化等。

``` css
/* 指定图片和媒体元素的尺寸 */
img, video {
  width: 100%;
  height: auto;
}
```

### FID（First Input Delay）
FID是指用户首次与页面交互到浏览器响应交互的时间间隔，即首次输入延迟。它衡量的是页面的交互性能。

第一次输入延迟，用于测量可交互性。FID 衡量的是从用户第一次与页面交互（例如，当他们点击链接，点击按钮，或使用自定义的 JavaScript 驱动的控件）到浏览器实际能够开始响应该交互的时间，为了提供良好的用户体验，站点应该努力使 FID 保持在 **100** 毫秒以内。

下面是获取和优化FID的方法：

#### 获取FID的方法：
可以通过 `Performance API` 中的相关接口来获取FID值，如 `PerformanceObserver` 接口监听 `first-input` 事件。

``` javascript
// 监听FID事件
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  const fidTime = entries[0].startTime;
  console.log("FID值：", fidTime);
});
observer.observe({ type: "first-input", buffered: true });
```

#### 优化FID的方法：
优化FID可以通过减少主线程阻塞时间和优化JavaScript执行时间来实现。例如，减少长任务的执行时间、优化事件处理程序的性能等。

``` javascript
// 优化事件处理程序的性能
document.getElementById("button").addEventListener("click", () => {
  // 执行优化后的代码
}, { passive: true });
```

### FPS（Frames per Second）
FPS是指页面在每秒钟内渲染的帧数，即每秒钟刷新的次数。它衡量的是页面的流畅度和动画效果。下面是获取和优化FPS的方法：

#### 获取FPS的方法：
可以通过浏览器的性能监控工具或第三方工具来获取页面的FPS值，如 `Chrome DevTools` 或 `WebPageTest` 等。

#### FPS（Frames per Second）持续时间
FPS持续时间是指页面在每秒内渲染的帧数。可以通过监测页面的渲染性能并计算平均帧率来获取。

``` javascript
// 使用requestAnimationFrame来监测FPS
let fps = 0;
let lastTime = performance.now();
function loop() {
  const currentTime = performance.now();
  const elapsedTime = currentTime - lastTime;
  fps = 1000 / elapsedTime;
  lastTime = currentTime;
  requestAnimationFrame(loop);
}
loop();
```

#### 优化FPS的方法：
优化FPS可以通过减少页面渲染的复杂度和优化动画效果来实现。例如，使用CSS3动画代替JavaScript动画、避免频繁的重绘和重排等。

``` css
/* 使用CSS3动画 */
.element {
  animation: slide-in 1s ease-in-out infinite;
}

@keyframes slide-in {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
```

## 总结

本文详细介绍了Web前端最新优化指标，包括`FP`、`FCP`、`FMP`、`LCP`、`TTI`、`CLS`、`FID`、`FPS`等，并提供了获取和优化的方法和实例。这些指标不仅帮助开发者更好地评估和优化网页性能，也有助于提升用户体验和网站竞争力。我们可以参考这些指标对网站的性能进行相关的优化。优化是一把双刃剑，有好的一面也有坏的一面，请谨慎优化。