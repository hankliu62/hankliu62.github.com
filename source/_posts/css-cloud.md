---
title: 使用 CSS 创建逼真的云效果
date: 2024-05-16 16:20:12
tag: [css,html]
---

## 使用 CSS 创建逼真的云效果

在现代网页设计中，精美的视觉效果可以极大地提升用户体验。今天我们将学习如何使用 CSS 创建一个动态且逼真的云效果。本文将详细讲解实现这一效果的每一步，让你能够在自己的项目中轻松复用。

### 代码结构

我们将分步骤讲解以下代码片段，它展示了如何使用 CSS 和 SVG 滤镜创建云效果：

```html
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(165deg, #527785 0%, #7FB4C7 100%);
        margin: 0;
        padding: 0;
      }

      .container {
        position: relative;
        left: 50%;
        margin-left: -250px;
      }

      .cloud {
        width: 500px;
        height: 275px;
        border-radius: 50%;
        position: absolute;
        top: -35vh;
        left: -25vw;
      }

      #cloud-back {
        filter: url(#filter-back);
        box-shadow: 300px 300px 30px -20px #fff;
      }

      #cloud-mid {
        filter: url(#filter-mid);
        box-shadow: 300px 340px 70px -60px rgba(158, 168, 179, 0.5);
        left: -25vw;
      }

      #cloud-front {
        filter: url(#filter-front);
        box-shadow: 300px 370px 60px -100px rgba(0, 0, 0, 0.3);
        left: -25vw;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="cloud" id="cloud-back"></div>
      <div class="cloud" id="cloud-mid"></div>
      <div class="cloud" id="cloud-front"></div>
      <svg width="0" height="0">
        <!--Top Layer-->
        <filter id="filter-back">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="0"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="170"></feDisplacementMap>
        </filter>
        <filter id="filter-mid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="0"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="150"></feDisplacementMap>
        </filter>
        <filter id="filter-front">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="0"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="100"></feDisplacementMap>
        </filter>
      </svg>
    </div>
  </body>
</html>
```

### 分析代码

#### 1. 设置背景和基本样式

首先，我们在 `body` 元素中设置了背景和基本样式：

```css
body {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(165deg, #527785 0%, #7FB4C7 100%);
  margin: 0;
  padding: 0;
}
```

这段代码为页面设置了全屏的线性渐变背景，从深蓝色渐变到浅蓝色，模拟天空的颜色。`margin` 和 `padding` 被设为 0，确保背景覆盖整个页面。

#### 2. 创建容器

接下来，我们创建了一个容器来包含云的元素：

```css
.container {
  position: relative;
  left: 50%;
  margin-left: -250px;
}
```

`container` 容器使用了 `relative` 定位，并通过 `left: 50%` 和 `margin-left: -250px` 将其水平居中。这个容器的宽度为 500px，因此通过负边距将其中心对齐。

#### 3. 定义云的样式

云是使用 `.cloud` 类创建的，我们定义了它的基本样式：

```css
.cloud {
  width: 500px;
  height: 275px;
  border-radius: 50%;
  position: absolute;
  top: -35vh;
  left: -25vw;
}
```

每个云元素都是一个 500px 宽、275px 高的椭圆形，使用 `border-radius: 50%` 来实现圆角。云的位置使用 `absolute` 定位，并通过 `top` 和 `left` 属性调整其初始位置。

#### 4. 应用滤镜效果

云的外观通过 SVG 滤镜实现，分别为不同层次的云定义了不同的滤镜效果：

```css
#cloud-back {
  filter: url(#filter-back);
  box-shadow: 300px 300px 30px -20px #fff;
}

#cloud-mid {
  filter: url(#filter-mid);
  box-shadow: 300px 340px 70px -60px rgba(158, 168, 179, 0.5);
  left: -25vw;
}

#cloud-front {
  filter: url(#filter-front);
  box-shadow: 300px 370px 60px -100px rgba(0, 0, 0, 0.3);
  left: -25vw;
}
```

每个云元素都应用了不同的 SVG 滤镜，并使用 `box-shadow` 添加阴影效果。滤镜效果在 `svg` 标签中定义：

```html
<svg width="0" height="0">
  <!--Top Layer-->
  <filter id="filter-back">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="0"></feTurbulence>
    <feDisplacementMap in="SourceGraphic" scale="170"></feDisplacementMap>
  </filter>
  <filter id="filter-mid">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="0"></feTurbulence>
    <feDisplacementMap in="SourceGraphic" scale="150"></feDisplacementMap>
  </filter>
  <filter id="filter-front">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="0"></feTurbulence>
    <feDisplacementMap in="SourceGraphic" scale="100"></feDisplacementMap>
  </filter>
</svg>
```

#### 5. 滤镜详解

##### `feTurbulence`

`feTurbulence` 元素生成基于分形噪声的图像，创建一种类似于云的纹理：

```html
<feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="0"></feTurbulence>
```

- `type`：指定噪声类型为分形噪声。
- `baseFrequency`：设置噪声频率，值越小，噪声图案越大。
- `numOctaves`：定义分形噪声的层数，值越大，细节越多。
- `seed`：确定噪声图案的随机种子。

##### `feDisplacementMap`

`feDisplacementMap` 元素使用噪声图像来变形云的形状，创建更加自然的外观：

```html
<feDisplacementMap in="SourceGraphic" scale="170"></feDisplacementMap>
```

- `in`：指定输入图像。
- `scale`：定义位移的强度，值越大，变形效果越明显。

### 完整实现

通过结合上述所有步骤，我们实现了一个逼真的云效果。以下是完整的代码：

```html
<!DOCTYPE html>
<html>
  <head>
    <style type="text/css">
      body {
        width: 100vw;
        height: 100vh;
        background: linear-gradient(165deg, #527785 0%, #7FB4C7 100%);
        margin: 0;
        padding: 0;
      }

      .container {
        position: relative;
        left: 50%;
        margin-left: -250px;
      }

      .cloud {
        width: 500px;
        height: 275px;
        border-radius: 50%;
        position: absolute;
        top: -35vh;
        left: -25vw;
      }

      #cloud-back {
        filter: url(#filter-back);
        box-shadow: 300px 300px 30px -20px #fff;
      }

      #cloud-mid {
        filter: url(#filter-mid);
        box-shadow: 300px 340px 70px -60px rgba(158, 168, 179, 0.5);
        left: -25vw;
      }

      #cloud-front {
        filter: url(#filter-front);
        box-shadow: 300px 370px 60px -100px

 rgba(0, 0, 0, 0.3);
        left: -25vw;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <div class="cloud" id="cloud-back"></div>
      <div class="cloud" id="cloud-mid"></div>
      <div class="cloud" id="cloud-front"></div>
      <svg width="0" height="0">
        <!--Top Layer-->
        <filter id="filter-back">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="0"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="170"></feDisplacementMap>
        </filter>
        <filter id="filter-mid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="0"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="150"></feDisplacementMap>
        </filter>
        <filter id="filter-front">
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="2" seed="0"></feTurbulence>
          <feDisplacementMap in="SourceGraphic" scale="100"></feDisplacementMap>
        </filter>
      </svg>
    </div>
  </body>
</html>
```

## 总结

通过上述步骤，我们成功地使用 CSS 和 SVG 滤镜创建了一个逼真的云效果。这种技术可以用于多种场景，如背景动画、图形特效等。