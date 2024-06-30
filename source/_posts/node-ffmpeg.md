---
title: 使用 Node.js 和 FFmpeg 构建视频服务器
date: 2024-06-20 18:20:12
tag: [nextjs,nuxtjs,nestjs]
---

## 使用 Node.js 和 FFmpeg 构建视频服务器

构建一个视频服务器可以为视频处理、转码和流媒体提供强大的功能支持。在本篇文章中，我们将详细介绍如何使用 Node.js 和 FFmpeg 搭建一个视频服务器，涵盖从环境搭建、基本视频处理、视频上传与存储到视频流媒体播放等多个方面的内容。

### 环境搭建

在开始之前，请确保您的系统上已经安装了以下软件：

1. **Node.js**：JavaScript 运行时，用于服务器端开发。
2. **FFmpeg**：一个强大的多媒体处理工具，可以处理音视频数据。

#### 安装 Node.js

请访问 [Node.js 官网](https://nodejs.org/) 下载并安装最新版本的 Node.js。安装完成后，您可以使用以下命令验证安装：

```bash
node -v
npm -v
```

#### 安装 FFmpeg

##### macOS

可以使用 Homebrew 安装 FFmpeg：

```bash
brew install ffmpeg
```

##### Ubuntu

可以使用 apt-get 安装 FFmpeg：

```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

##### Windows

请访问 [FFmpeg 官网](https://ffmpeg.org/download.html) 下载适用于 Windows 的预编译二进制文件，并按照说明进行安装。

安装完成后，您可以使用以下命令验证安装：

```bash
ffmpeg -version
```

### 项目初始化

#### 创建项目目录

首先，创建一个新的项目目录并初始化一个新的 Node.js 项目：

```bash
mkdir video-server
cd video-server
npm init -y
```

#### 安装依赖

我们将使用以下 Node.js 包：

- **express**：Web 框架，用于处理 HTTP 请求。
- **multer**：中间件，用于处理文件上传。
- **fluent-ffmpeg**：Node.js 对 FFmpeg 的简单封装，用于处理视频文件。

安装上述依赖包：

```bash
npm install express multer fluent-ffmpeg
```

### 基本服务器设置

#### 创建服务器

在项目根目录下创建一个 `server.js` 文件，配置基本的服务器设置：

```javascript
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

const app = express();
const port = 3000;

// 设置静态文件目录
app.use(express.static('public'));

// 设置文件上传存储位置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// 视频上传处理
app.post('/upload', upload.single('video'), (req, res) => {
  const filePath = req.file.path;

  // 视频处理逻辑
  ffmpeg(filePath)
    .output('output.mp4')
    .on('end', () => {
      res.send('Video processed successfully');
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Video processing failed');
    })
    .run();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

#### 创建目录结构

为了管理上传和处理的视频文件，我们需要创建 `uploads` 目录：

```bash
mkdir uploads
```

### 视频处理

使用 FFmpeg 可以进行多种视频处理操作，包括转码、剪辑、加水印等。接下来，我们将介绍几种常见的视频处理操作。

#### 视频转码

视频转码是将视频文件从一种格式转换为另一种格式。以下示例展示了如何将上传的视频文件转码为 MP4 格式：

```javascript
app.post('/upload', upload.single('video'), (req, res) => {
  const filePath = req.file.path;
  const outputFilePath = 'uploads/' + Date.now() + '.mp4';

  ffmpeg(filePath)
    .output(outputFilePath)
    .on('end', () => {
      res.send('Video transcoded successfully: ' + outputFilePath);
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Video transcoding failed');
    })
    .run();
});
```

#### 视频剪辑

视频剪辑是从视频文件中提取特定的片段。以下示例展示了如何从上传的视频文件中剪辑出前10秒的片段：

```javascript
app.post('/upload', upload.single('video'), (req, res) => {
  const filePath = req.file.path;
  const outputFilePath = 'uploads/' + Date.now() + '_clip.mp4';

  ffmpeg(filePath)
    .setStartTime('00:00:00')
    .setDuration(10)
    .output(outputFilePath)
    .on('end', () => {
      res.send('Video clipped successfully: ' + outputFilePath);
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Video clipping failed');
    })
    .run();
});
```

#### 添加水印

添加水印是将图像或文本叠加到视频上。以下示例展示了如何在视频上添加一个水印图像：

```javascript
app.post('/upload', upload.single('video'), (req, res) => {
  const filePath = req.file.path;
  const outputFilePath = 'uploads/' + Date.now() + '_watermarked.mp4';
  const watermarkPath = 'public/watermark.png';

  ffmpeg(filePath)
    .outputOptions('-vf', `movie=${watermarkPath} [watermark]; [in][watermark] overlay=10:10 [out]`)
    .output(outputFilePath)
    .on('end', () => {
      res.send('Watermark added successfully: ' + outputFilePath);
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Adding watermark failed');
    })
    .run();
});
```

### 视频上传与存储

处理视频文件上传和存储是构建视频服务器的重要组成部分。接下来，我们将介绍如何使用 `multer` 中间件处理视频文件的上传，并将其存储在服务器上。

#### 配置文件上传中间件

我们已经在 `server.js` 中配置了 `multer`，用于处理文件上传。可以根据需要进一步配置存储设置，如限制文件大小和文件类型：

```javascript
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 限制文件大小为 100MB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mkv|avi/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});
```

#### 处理文件上传请求

我们已经在 `/upload` 路由中处理了文件上传请求，并使用 `ffmpeg` 进行视频处理。可以根据需要添加更多路由来处理不同的视频操作。

### 视频流媒体播放

为了提供流媒体播放功能，我们需要将视频文件流式传输给客户端。以下示例展示了如何实现视频流媒体播放：

#### 配置视频流路由

在 `server.js` 中添加一个新的路由，用于处理视频流请求：

```javascript
app.get('/video/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return res.status(404).send('File not found');
    }

    const { range } = req.headers;
    if (!range) {
      return res.status(416).send('Range not found');
    }

    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });

    const stream = fs.createReadStream(filePath, { start, end })
      .on('open', () => stream.pipe(res))
      .on('error', (err) => res.end(err));
  });
});
```

#### 客户端播放视频

在 `public`

目录下创建一个 `index.html` 文件，用于客户端播放视频：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Video Player</title>
</head>
<body>
  <video id="videoPlayer" controls width="600">
    <source src="/video/sample.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</body>
</html>
```

### 完整代码示例

整合上述所有代码，我们的 `server.js` 文件如下所示：

```javascript
const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// 设置静态文件目录
app.use(express.static('public'));

// 设置文件上传存储位置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 限制文件大小为 100MB
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|mkv|avi/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

// 视频上传处理
app.post('/upload', upload.single('video'), (req, res) => {
  const filePath = req.file.path;
  const outputFilePath = 'uploads/' + Date.now() + '_watermarked.mp4';
  const watermarkPath = 'public/watermark.png';

  ffmpeg(filePath)
    .outputOptions('-vf', `movie=${watermarkPath} [watermark]; [in][watermark] overlay=10:10 [out]`)
    .output(outputFilePath)
    .on('end', () => {
      res.send('Watermark added successfully: ' + outputFilePath);
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).send('Adding watermark failed');
    })
    .run();
});

// 视频流媒体播放
app.get('/video/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.params.filename);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      console.error(err);
      return res.status(404).send('File not found');
    }

    const { range } = req.headers;
    if (!range) {
      return res.status(416).send('Range not found');
    }

    const positions = range.replace(/bytes=/, '').split('-');
    const start = parseInt(positions[0], 10);
    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    const chunksize = end - start + 1;

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    });

    const stream = fs.createReadStream(filePath, { start, end })
      .on('open', () => stream.pipe(res))
      .on('error', (err) => res.end(err));
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```

#### 完整的目录结构

```
video-server/
├── node_modules/
├── public/
│   ├── index.html
│   └── watermark.png
├── uploads/
├── package.json
├── package-lock.json
└── server.js
```

### 总结

在本篇文章中，我们详细介绍了如何使用 Node.js 和 FFmpeg 搭建一个功能强大的视频服务器。从环境搭建、项目初始化、视频处理、文件上传与存储到视频流媒体播放，我们一步步实现了一个完整的解决方案。

通过学习本文，您应该对以下内容有了更深入的了解：

- Node.js 与 FFmpeg 的基本使用
- 使用 `express` 创建 Web 服务器
- 使用 `multer` 处理文件上传
- 使用 `fluent-ffmpeg` 进行视频处理
- 实现视频流媒体播放
