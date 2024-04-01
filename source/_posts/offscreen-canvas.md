---
title: OffscreenCanvas 离屏Canvas — 使用Web Worker提高你的Canvas运行速度
date: 2022-08-08 12:12:26
tag: [html, canvas, webworker, yuv]
---

## OffscreenCanvas 离屏Canvas — 使用Web Worker提高你的Canvas运行速度

OffscreenCanvas提供了一个可以脱离屏幕渲染的canvas对象。

有了离屏Canvas，你可以不用在你的主线程中绘制图像了！

Canvas 是一个非常受欢迎的表现方式，同时也是WebGL的入口。它能绘制图形，图片，展示动画，甚至是处理视频内容。它经常被用来在富媒体web应用中创建炫酷的用户界面或者是制作在线（web）游戏。

它是非常灵活的，这意味着绘制在Canvas的内容可以被编程。JavaScript就提供了Canvas的系列API。这些给了Canvas非常好的灵活度。

但同时，在一些现代化的web站点，脚本解析运行是实现流畅用户反馈的最大的问题之一。因为Canvas计算和渲染和用户操作响应都发生在同一个线程中，在动画中（有时候很耗时）的计算操作将会导致App卡顿，降低用户体验。

幸运的是, [OffscreenCanvas](https://developer.mozilla.org/zh-CN/docs/Web/API/OffscreenCanvas) 离屏Canvas可以非常棒的解决这个麻烦！

到目前为止，Canvas的绘制功能都与`<canvas>`标签绑定在一起，这意味着Canvas API和DOM是耦合的。而OffscreenCanvas，正如它的名字一样，通过将Canvas移出屏幕来解耦了DOM和Canvas API。

由于这种解耦，OffscreenCanvas的渲染与DOM完全分离了开来，并且比普通Canvas速度提升了一些，而这只是因为两者（Canvas和DOM）之间没有同步。但更重要的是，将两者分离后，Canvas将可以在Web Worker中使用，即使在Web Worker中没有DOM。这给Canvas提供了更多的可能性。

### 兼容性

这是一个实验中的功能
此功能某些浏览器尚在开发中，请参考浏览器兼容性表格以得到在不同浏览器中适合使用的前缀。由于该功能对应的标准文档可能被重新修订，所以在未来版本的浏览器中该功能的语法和行为可能随之改变。

支持浏览器如下图所示：

![OffscreenCanvas兼容性](https://user-images.githubusercontent.com/8088864/126027990-d476b78e-e6c9-4438-998d-7ccc4ae79f8b.png)

### 在Worker中使用OffscreenCanvas

它在窗口环境和web worker环境均有效。

[Workers](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API) 是一个Web版的线程——它允许你在幕后运行你的代码。将你的一部分代码放到Worker中可以给你的主线程更多的空闲时间，这可以提高你的用户体验度。就像其没有DOM一样，直到现在，在Worker中都没有Canvas API。

而OffscreenCanvas并不依赖DOM，所以在Worker中Canvas API可以被某种方法来代替。下面是我在Worker中用OffscreenCanvas来计算渐变颜色的：

``` js
// file: worker.js

function getGradientColor(percent) {
    const canvas = new OffscreenCanvas(100, 1);
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'blue');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, 1);
    const imgd = ctx.getImageData(0, 0, ctx.canvas.width, 1);
    const colors = imgd.data.slice(percent * 4, percent * 4 + 4);
    return `rgba(${colors[0]}, ${colors[1]}, ${colors[2]}, ${colors[3]})`;
}

getGradientColor(40);  // rgba(152, 0, 104, 255)
```

### 不要阻塞主线程

当我们将大量的计算移到Worker中运行时，可以释放主线程上的资源，这很有意思。我们可以使用transferControlToOffscreen 方法将常规的Canvas映射到OffscreenCanvas实例上。之后所有应用于OffscreenCanvas的操作将自动呈现在在源Canvas上。

``` html
<!DOCTYPE html>
<html>
<body>
<canvas id="myCanvas" width="600" height="500" style="border:1px solid #d3d3d3;">
  Your browser does not support the HTML5 canvas tag.
</canvas>
<script>
var canvas = document.getElementById("myCanvas");
// var context = canvas.getContext("2d");

// // 画线
// context.moveTo(100, 100);
// context.lineTo(300, 100);
// context.lineTo(300, 200);

// // 画第二条线
// // 画第二条线
// context.moveTo(100, 300);
// context.lineTo(300, 300);

// // 最后要描边才会出效果
// context.stroke();

// // 创建一张新的玻璃纸
// context.beginPath();
// // 画第三条线
// context.moveTo(400, 100);
// context.lineTo(400, 300);
// context.lineTo(500, 300);
// context.lineTo(500, 200);

// // 只要执行stroke，都会玻璃纸上的图形重复印刷一次
// context.stroke();

// // 填充
// context.fill();
// context.fillStyle = "gray";

// // 设置描边色
// context.strokeStyle = "red"; // 颜色的写法和css写法是一样的
// context.stroke();

// //填充
// //设置填充色
// context.fillStyle = "yellowgreen";
// context.fill();

// //把路径闭合
// context.closePath();

// //设置线条的粗细， 不需要加px
// context.lineWidth = 15;
// //线条的头部的设置
// context.lineCap = "round"; //默认是butt， 记住round

// 注: 如果将canvas转化成离屏canvas时，就不能使用原canvas的cantext来绘制图案，否则会报错，已经绘制了的canvas不同通过transferControlToOffscreen转换成OffscreenCanvas
// Uncaught DOMException: Failed to execute 'transferControlToOffscreen' on 'HTMLCanvasElement': Cannot transfer control from a canvas that has a rendering context.
const offscreen = canvas.transferControlToOffscreen();
const worker = new Worker('worker.js');
worker.postMessage({ canvas: offscreen }, [offscreen]);
</script>
</body>
</html>
```

OffscreenCanvas 是可转移的，除了将其指定为传递信息中的字段之一以外，还需要将其作为postMessage（传递信息给Worker的方法）中的第二个参数传递出去，以便可以在Worker线程的context（上下文）中使用它。

``` js
// worker.js

self.onmessage = function (event) {
  // 获取传送过来的离屏Canvas(OffscreenCanvas)
  var canvas = event.data.canvas;
  var context = canvas.getContext('2d');

  // 画一个曲径球体
  var c1 = {x: 240, y: 160, r: 0};
  var c2 = {x: 300, y: 200, r: 120};

  var gradient = context.createRadialGradient(c1.x, c1.y, c1.r, c2.x, c2.y, c2.r);
  gradient.addColorStop(1, "gray");
  gradient.addColorStop(0, "lightgray");

  //2. 将渐变对象设为填充色
  context.fillStyle = gradient;

  //3. 画圆并填充
  context.arc(c2.x, c2.y, c2.r, 0, 2*Math.PI);
  context.fill();
}
```

效果如下所示:

![WebWorker中OffscreenCanvas绘制径向渐变画球](https://user-images.githubusercontent.com/8088864/126027866-d78a65fc-8f0f-4a7e-9adf-7eb09a03b956.png)

任务繁忙的主线程也不会影响在Worker上运行的动画。所以即使主线程非常繁忙，你也可以通过此功能来避免掉帧并保证流畅的动画

### WebRTC的YUV媒体流数据的离屏渲染

从 WebRTC 中拿到的是 YUV 的原始视频流，将原始的 YUV 视频帧直接转发过来，通过第三方库直接在 Cavans 上渲染。

可以使用[yuv-canvas](https://github.com/brion/yuv-canvas)和[yuv-buffer](https://github.com/brion/yuv-buffer)第三方库来渲染YUV的原始视频流。

#### 主进程render.js

``` js
"use strict";
exports.__esModule = true;
var isEqual = require('lodash.isequal');
var YUVBuffer = require('yuv-buffer');
var YUVCanvas = require('yuv-canvas');
var Renderer = /** @class */ (function () {
    function Renderer(workSource) {
        var _this = this;
        this._sendCanvas = function () {
            _this.canvasSent = true;
            _this.worker && _this.worker.postMessage({
                type: 'constructor',
                data: {
                    canvas: _this.offCanvas,
                    id: (_this.element && _this.element.id) || (Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2))
                }
            }, [_this.offCanvas]);
        };
        /**
         * 判断使用渲染的方式
         */
        this._checkRendererWay = function () {
            if (_this.workerReady && _this.worker && _this.offCanvas && _this.enableWorker) {
                return 'worker';
            }
            else {
                return 'software';
            }
        };
        // workerCanvas渲染
        this._workDrawFrame = function (width, height, yUint8Array, uUint8Array, vUint8Array) {
            if (_this.canvasWrapper && _this.canvasWrapper.style.display !== 'none') {
                _this.canvasWrapper.style.display = 'none';
            }
            if (_this.workerCanvasWrapper && _this.workerCanvasWrapper.style.display === 'none') {
                _this.workerCanvasWrapper.style.display = 'flex';
            }
            _this.worker && _this.worker.postMessage({
                type: 'drawFrame',
                data: {
                    width: width,
                    height: height,
                    yUint8Array: yUint8Array,
                    uUint8Array: uUint8Array,
                    vUint8Array: vUint8Array
                }
            }, [yUint8Array, uUint8Array, vUint8Array]);
        };
        // 实际渲染Canvas
        this._softwareDrawFrame = function (width, height, yUint8Array, uUint8Array, vUint8Array) {
            if (_this.workerCanvasWrapper && _this.workerCanvasWrapper.style.display !== 'none') {
                _this.workerCanvasWrapper.style.display = 'none';
            }
            if (_this.canvasWrapper && _this.canvasWrapper.style.display === 'none') {
                _this.canvasWrapper.style.display = 'flex';
            }
            var format = YUVBuffer.format({
                width: width,
                height: height,
                chromaWidth: width / 2,
                chromaHeight: height / 2
            });
            var y = YUVBuffer.lumaPlane(format, yUint8Array);
            var u = YUVBuffer.chromaPlane(format, uUint8Array);
            var v = YUVBuffer.chromaPlane(format, vUint8Array);
            var frame = YUVBuffer.frame(format, y, u, v);
            _this.yuv.drawFrame(frame);
        };
        this.cacheCanvasOpts = {};
        this.yuv = {};
        this.ready = false;
        this.contentMode = 0;
        this.container = {};
        this.canvasWrapper;
        this.canvas = {};
        this.element = {};
        this.offCanvas = {};
        this.enableWorker = !!workSource;
        if (this.enableWorker) {
            this.worker = new Worker(workSource);
            this.workerReady = false;
            this.canvasSent = false;
            this.worker.onerror = function (evt) {
                console.error('[WorkerRenderer]: the renderer worker catch error: ', evt);
                _this.workerReady = false;
                _this.enableWorker = false;
            };
            this.worker.onmessage = function (evt) {
                var data = evt.data;
                switch (data.type) {
                    case 'ready': {
                        console.log('[WorkerRenderer]: the renderer worker was ready');
                        _this.workerReady = true;
                        if (_this.offCanvas) {
                            _this._sendCanvas();
                        }
                        break;
                    }
                    case 'exited': {
                        console.log('[WorkerRenderer]: the renderer worker was exited');
                        _this.workerReady = false;
                        _this.enableWorker = false;
                        break;
                    }
                }
            };
        }
    }
    Renderer.prototype._calcZoom = function (vertical, contentMode, width, height, clientWidth, clientHeight) {
        if (vertical === void 0) { vertical = false; }
        if (contentMode === void 0) { contentMode = 0; }
        var localRatio = clientWidth / clientHeight;
        var tempRatio = width / height;
        if (isNaN(localRatio) || isNaN(tempRatio)) {
            return 1;
        }
        if (!contentMode) {
            if (vertical) {
                return localRatio > tempRatio ?
                    clientHeight / height : clientWidth / width;
            }
            else {
                return localRatio < tempRatio ?
                    clientHeight / height : clientWidth / width;
            }
        }
        else {
            if (vertical) {
                return localRatio < tempRatio ?
                    clientHeight / height : clientWidth / width;
            }
            else {
                return localRatio > tempRatio ?
                    clientHeight / height : clientWidth / width;
            }
        }
    };
    Renderer.prototype.getBindingElement = function () {
        return this.element;
    };
    Renderer.prototype.bind = function (element) {
        // record element
        this.element = element;
        // create container
        var container = document.createElement('div');
        container.className += ' video-canvas-container';
        Object.assign(container.style, {
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
        });
        this.container = container;
        element && element.appendChild(this.container);
        // 创建两个canvas，一个在主线程中渲染，如果web worker中的离屏canvas渲染进程出错了，还可以切换到主进程的canvas进行渲染
        var canvasWrapper = document.createElement('div');
        canvasWrapper.className += ' video-canvas-wrapper canvas-renderer';
        Object.assign(canvasWrapper.style, {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '0px',
            right: '0px',
            display: 'none'
        });
        this.canvasWrapper = canvasWrapper;
        this.container.appendChild(this.canvasWrapper);
        var workerCanvasWrapper = document.createElement('div');
        workerCanvasWrapper.className += ' video-canvas-wrapper webworker-renderer';
        Object.assign(workerCanvasWrapper.style, {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            left: '0px',
            right: '0px',
            display: 'none'
        });
        this.workerCanvasWrapper = workerCanvasWrapper;
        this.container.appendChild(this.workerCanvasWrapper);
        // create canvas
        this.canvas = document.createElement('canvas');
        this.workerCanvas = document.createElement('canvas');
        this.canvasWrapper.appendChild(this.canvas);
        this.workerCanvasWrapper.appendChild(this.workerCanvas);
        // 创建 OffscreenCanvas 对象
        this.offCanvas = this.workerCanvas.transferControlToOffscreen();
        if (!this.canvasSent && this.offCanvas && this.worker && this.workerReady) {
            this._sendCanvas();
        }
        this.yuv = YUVCanvas.attach(this.canvas, { webGL: false });
    };
    Renderer.prototype.unbind = function () {
        this.canvasWrapper && this.canvasWrapper.removeChild(this.canvas);
        this.workerCanvasWrapper && this.workerCanvasWrapper.removeChild(this.workerCanvas);
        this.container && this.container.removeChild(this.canvasWrapper);
        this.container && this.container.removeChild(this.workerCanvasWrapper);
        this.element && this.element.removeChild(this.container);
        this.worker && this.worker.terminate();
        this.workerReady = false;
        this.canvasSent = false;
        this.yuv = null;
        this.container = null;
        this.workerCanvasWrapper = null;
        this.canvasWrapper = null;
        this.element = null;
        this.canvas = null;
        this.workerCanvas = null;
        this.offCanvas = null;
        this.worker = null;
    };
    Renderer.prototype.refreshCanvas = function () {
        // Not implemented for software renderer
    };
    Renderer.prototype.updateCanvas = function (options) {
        if (options === void 0) { options = {
            width: 0,
            height: 0,
            rotation: 0,
            mirrorView: false,
            contentMode: 0,
            clientWidth: 0,
            clientHeight: 0
        }; }
        // check if display options changed
        if (isEqual(this.cacheCanvasOpts, options)) {
            return;
        }
        this.cacheCanvasOpts = Object.assign({}, options);
        // check for rotation
        if (options.rotation === 0 || options.rotation === 180) {
            this.canvas.width = options.width;
            this.canvas.height = options.height;
            // canvas 调用 transferControlToOffscreen 方法后无法修改canvas的宽度和高度，只允许修改canvas的style属性
            this.workerCanvas.style.width = options.width + "px";
            this.workerCanvas.style.height = options.height + "px";
        }
        else if (options.rotation === 90 || options.rotation === 270) {
            this.canvas.height = options.width;
            this.canvas.width = options.height;
            this.workerCanvas.style.height = options.width + "px";
            this.workerCanvas.style.width = options.height + "px";
        }
        else {
            throw new Error('Invalid value for rotation. Only support 0, 90, 180, 270');
        }
        var transformItems = [];
        transformItems.push("rotateZ(" + options.rotation + "deg)");
        var scale = this._calcZoom(options.rotation === 90 || options.rotation === 270, options.contentMode, options.width, options.height, options.clientWidth, options.clientHeight);
        // transformItems.push(`scale(${scale})`)
        this.canvas.style.zoom = scale;
        this.workerCanvas.style.zoom = scale;
        // check for mirror
        if (options.mirrorView) {
            // this.canvas.style.transform = 'rotateY(180deg)';
            transformItems.push('rotateY(180deg)');
        }
        if (transformItems.length > 0) {
            var transform = "" + transformItems.join(' ');
            this.canvas.style.transform = transform;
            this.workerCanvas.style.transform = transform;
        }
    };
    Renderer.prototype.drawFrame = function (imageData) {
        if (!this.ready) {
            this.ready = true;
        }
        var dv = new DataView(imageData.header);
        // let format = dv.getUint8(0);
        var mirror = dv.getUint8(1);
        var contentWidth = dv.getUint16(2);
        var contentHeight = dv.getUint16(4);
        var left = dv.getUint16(6);
        var top = dv.getUint16(8);
        var right = dv.getUint16(10);
        var bottom = dv.getUint16(12);
        var rotation = dv.getUint16(14);
        // let ts = dv.getUint32(16);
        var width = contentWidth + left + right;
        var height = contentHeight + top + bottom;
        this.updateCanvas({
            width: width, height: height, rotation: rotation,
            mirrorView: !!mirror,
            contentMode: this.contentMode,
            clientWidth: this.container && this.container.clientWidth,
            clientHeight: this.container && this.container.clientHeight
        });
        if (this._checkRendererWay() === 'software') {
            // 实际渲染canvas
            this._softwareDrawFrame(width, height, imageData.yUint8Array, imageData.uUint8Array, imageData.vUint8Array);
        }
        else {
            this._workDrawFrame(width, height, imageData.yUint8Array, imageData.uUint8Array, imageData.vUint8Array);
        }
    };
    /**
     * 清空整个Canvas面板
     *
     * @memberof Renderer
     */
    Renderer.prototype.clearFrame = function () {
        if (this._checkRendererWay() === 'software') {
            this.yuv && this.yuv.clear();
        }
        else {
            this.worker && this.worker.postMessage({
                type: 'clearFrame'
            });
        }
    };
    Renderer.prototype.setContentMode = function (mode) {
        if (mode === void 0) { mode = 0; }
        this.contentMode = mode;
    };
    return Renderer;
}());

exports["default"] = Renderer;
```

#### 渲染 WebWorker

具体代码如下所示:

``` js
// render worker

(function() {
  const dateFormat = function(date, formatter = 'YYYY-MM-DD hh:mm:ss SSS') {
    if (!date) {
      return date;
    }

    let time;

    try {
      time = new Date(date);
    } catch (e) {
      return date;
    }

    const oDate = {
      Y: time.getFullYear(),
      M: time.getMonth() + 1,
      D: time.getDate(),
      h: time.getHours(),
      m: time.getMinutes(),
      s: time.getSeconds(),
      S: time.getMilliseconds()
    };

    return formatter.replace(/(Y|M|D|h|m|s|S)+/g, (res, key) => {
      let len = 2;

      switch (res.length) {
        case 1:
          len = res.slice(1, 0) === 'Y' ? 4 : 2;
          break;
        case 2:
          len = 2;
          break;
        case 3:
          len = 3;
          break;
        case 4:
          len = 4;
          break;
        default:
          len = 2;
      }
      return (`0${oDate[key]}`).slice(-len);
    });
  }

  let yuv;

  try {
    importScripts('./yuv-buffer/yuv-buffer.js');
    importScripts('./yuv-canvas/shaders.js');
    importScripts('./yuv-canvas/depower.js');
    importScripts('./yuv-canvas/YCbCr.js');
    importScripts('./yuv-canvas/FrameSink.js');
    importScripts('./yuv-canvas/SoftwareFrameSink.js');
    importScripts('./yuv-canvas/WebGLFrameSink.js');
    importScripts('./yuv-canvas/yuv-canvas.js');

    self.addEventListener('message', function (e) {
      const data = e.data;
      switch (data.type) {
        case 'constructor':
          console.log(`${dateFormat(new Date())} RENDER_WORKER [INFO]: received canvas: `, data.data.canvas, data.data.id);
          yuv = YUVCanvas.attach(data.data.canvas, { webGL: false });
          break;
        case 'drawFrame':
          // 考虑是否使用requestAnimationFrame进行渲染，控制每一帧显示的频率
          const width = data.data.width;
          const height = data.data.height;
          const yUint8Array = data.data.yUint8Array;
          const uUint8Array = data.data.uUint8Array;
          const vUint8Array = data.data.vUint8Array;
          const format = YUVBuffer.format({
            width: width,
            height: height,
            chromaWidth: width / 2,
            chromaHeight: height / 2
          });
          const y = YUVBuffer.lumaPlane(format, yUint8Array);
          const u = YUVBuffer.chromaPlane(format, uUint8Array);
          const v = YUVBuffer.chromaPlane(format, vUint8Array);
          const frame = YUVBuffer.frame(format, y, u, v);
          yuv && yuv.drawFrame(frame);
          break;
        case 'clearFrame': {
          yuv && yuv.clear(frame);
          break;
        }
        default:
          console.log(`${dateFormat(new Date())} RENDER_WORKER [INFO]: [RendererWorker]: Unknown message: `, data);
      };
    }, false);

    self.postMessage({
      type: 'ready',
    });
  } catch (error) {
    self.postMessage({
      type: 'exited',
    });

    console.log(`${dateFormat(new Date())} RENDER_WORKER [INFO]: [RendererWorker]: catch error`, error);
  }
})();

```

### 总结

如果你对图像绘画使用得非常多，OffscreenCanvas可以有效的提高你APP的性能。它使得Worker可以处理canvas的渲染绘制，让你的APP更好地利用了多核系统。

OffscreenCanvas在Chrome 69中已经不需要开启flag（实验性功能）就可以使用了。它也正在被 Firefox 实现。由于其API与普通canvas元素非常相似，所以你可以轻松地对其进行特征检测并循序渐进地使用它，而不会破坏现有的APP或库的运行逻辑。OffscreenCanvas在任何涉及到图形计算以及动画表现且与DOM关系并不密切（即依赖DOM API不多）的情况下，它都具有性能优势。
