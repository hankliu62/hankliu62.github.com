---
title: 常用的CSS技巧
date: 2019-10-12 18:20:12
tag: [css]
---


01. 网站平滑滚动

在`<html>`元素中添加scroll-behavior: smooth，以实现整个页面的平滑滚动。

``` css
html {
  scroll-behavior: smooth;
}
```

02. 链接的属性选择器

此选择器的目标是具有以“https”开头的 href 属性的链接。

``` css
a[href^="https"] {
  color: blue;
}
```

03. 〜合并兄弟姐妹

选择 `<h2>` 后面的所有兄弟元素 `<p>` 元素。

``` css
h2 ~ p {
  color: blue;
}
```

04. :not() 伪类

该选择器将样式应用于不具有“特殊”类的列表项。

``` css
li:not(.special) {
  font-stlye: italic;
}
```

05. 用于响应式排版的视口单位

使用视口单位（vw、vh、vmin、vmax）可以使字体大小响应视口大小。

``` css
h1 {
  font-size: 5vw;
}
```

06. `:empty` 表示空元素

此选择器定位空的 `<p>` 元素并隐藏它们。

``` css
p:empty {
  display: none;
}
```

07. 自定义属性（变量）

可以定义和使用自定义属性，以更轻松地设置主题和维护。

``` css
:root {
  --main-color: #3498db;
}

h1 {
  color: var(--main-color);
}
```

08. 图像控制的Object-fit属性

**object-fit** 控制如何调整替换元素（如 `<img>`）的内容大小。

``` css
img {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
```

<!-- more -->

09. 简化布局的网格

CSS 网格提供了一种以更简单的方式创建布局的强大方法。

``` css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}
```

10. `:focus-in` 伪类

如果该元素包含任何具有 `:focus` 的子元素，则 `:focus-within` 会选择该元素。

``` css
form:focus-within {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0, 0.2);
}
```

11. 使用 Flexbox 垂直居中

使用 Flexbox 轻松将内容在容器内水平和垂直居中。

``` css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
```
12. 自定义选择的突出显示颜色

自定义在网页上选择文本时的突出显示颜色。

``` css
::selection {
  background-color: #ffcc00;
  color: #333;
}
```

13. 占位符文本样式

设置输入字段内占位符文本的样式。

``` css
::placeholder {
  color: #999;
  font-style: italic;
}
```

14. 渐变边框

使用`background-clip`属性创建渐变边框。

``` css
.element {
   border: 2px solid transparent;
   background-clip: padding-box;
   background-image: linear-gradient(to right, red, blue);
}
```

15. vw 可变字体大小

根据视口宽度调整字体大小，从而实现更具响应性的排版。

``` css
body {
   font-size: calc(16px + 1vw);
}
```

16. 彩色元素的圆锥渐变

使用圆锥渐变创建色彩缤纷的动态背景。

``` css
.element {
  background: conic-gradient(#ff5733, #33ff57, #5733ff);
}
```

17. 响应式文本的 `Clamp()` 函数

使用`clamp()`函数设置字体大小的范围，确保在不同屏幕尺寸上的可读性。

``` css
.text {
  font-size: clamp(16px, 4vw, 24px);
}
```

18. 通过字体显示交换实现高效字体加载

使用字体显示：交换； 属性可通过在加载自定义字体时显示后备字体来提高 Web 字体的性能。

``` css
@font-face {
  font-family: 'YourFont';
  src: url('your-font.woff2') format('woff2');
  font-display: swap;
}
```

19. 自定义滚动捕捉点

实施自定义滚动捕捉点以获得更流畅的滚动体验，对于图像库或滑块尤其有用。

``` css
.scroll-container {
  scroll-snap-type: y mandatory;
}

.scroll-item {
  scroll-snap-align: start;
}
```

20. 具有字体变化设置的可变字体样式

利用可变字体和 `font-variation-settings` 属性对字体粗细、样式和其他变体进行微调控制。

``` css
.text {
  font-family: 'YourVariableFont', sans-serif;
  font-variation-settings: 'wght' 500, 'ital' 1;
}
```

21. 自定义下划线

使用 `border-bottom` 和 `text-decoration` 的组合自定义链接上下划线的样式。

``` css
a {
  text-decoration: none;
  border-bottom: 1px solid #3498db;
}
```

22. 隐藏的辅助文本

使用类 `sr-only` 在视觉上隐藏元素，但让屏幕阅读器可以访问它们。

``` css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
```

23. 纵横比框

使用填充技巧来保持图像或视频等元素的宽高比。

``` css
.aspect-ratio-box {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* Adjust as needed */
}

.aspect-ratio-box > iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
```

24. 选择偶数和奇数元素

使用 `:nth-child` 伪类设置替代元素的样式。

``` css
li:nth-child(even) {
  background-color: #f2f2f2;
}

li:nth-child(odd) {
  background-color: #e6e6e6;
}
```

25. CSS计数器

使用计数器重置和计数器增量属性在列表中创建自动编号。

``` css
ol {
  counter-reset: item;
}

li {
  counter-increment: item;
}

li::before {
  content: counter(item) ". ";
}
```

26. 多个背景图像

将多个背景图像应用于具有不同属性的元素。

``` css
.bg {
  background-image: url('image1.jpg'), url('image2.jpg');
  background-position: top left, bottom right;
  background-repeat: no-repeat, repeat-x;
}
```

27. 连字符让文本更流畅

通过允许使用 `hyphens` 属性自动连字符来提高文本可读性。

``` css
p {
  hyphens: auto;
}
```

28. 动态样式的CSS变量

利用 CSS 变量创建动态且可重用的样式。

``` css
:root {
  --main-color: #3498db;
}

.element {
  color: var(--main-color);
}
```

29. 键盘导航的焦点样式

改进焦点样式以获得更好的键盘导航和可访问性。

``` css
:focus {
  outline: 2px solid #27ae60;
}
```

30. 平滑渐变过渡

对渐变背景应用平滑过渡以获得精美效果。

``` css
.gradient-box {
  background: linear-gradient(45deg, #3498db, #2ecc71);
  transition: background 0.5s ease;
}

.gradient-box:hover {
  background: linear-gradient(45deg, #e74c3c, #f39c12);
}
```

31. 文字描边效果

为文本添加笔划（轮廓）以获得独特的视觉效果。

``` css
h1 {
  color: #3498db;
  -webkit-text-stroke: 2px #2c3e50;
}
```

32. 纯CSS汉堡菜单

无需 JavaScript 创建一个简单的汉堡菜单。

``` css
.menu-toggle {
    display: none;
}

.menu-toggle:checked + nav {
    display: block;
}
/* Add styles for the hamburger icon and menu here */
```

33. CSS `:is()` 选择器

使用 `:is()` 伪类简化复杂的选择器。

``` css
:is(h1, h2, h3) {
  color: blue;
}
```

34. CSS变量的计算

在动态样式的 CSS 变量中执行计算。

``` css
:root {
  --base-size: 16px;
  --header-size: calc(var(--base-size) * 2);
}

h1 {
  font-size: var(--header-size);
}
```

35. 内容的 `attr()` 函数

使用 `attr()` 函数检索和显示属性值。

``` css
div::before {
  content: attr(data-custom-content);
}
```

36. CSS 屏蔽

对图像应用遮罩以获得创意效果。

``` css
.masked-image {
  mask: url(mask.svg);
  mask-size: cover;
}
```

37. 混合模式

尝试混合模式以获得有趣的色彩效果。

``` css
.blend-mode {
  background: url(image.jpg);
  mix-blend-mode: screen;
}
```

38. 纵横比属性

使用宽高比属性简化宽高比框的创建。

``` css
.aspect-ratio-box {
  aspect-ratio: 16/9;
}
```

39. 用于文本换行的 `shape-outside`

使用 `shape-outside` 属性使文本环绕指定形状，从而实现更动态的布局。

``` css
.shape-wrap {
  float: left;
  width: 150px;
  height: 150px;
  shape-outside: circle(50%);
}
```

40. ch 单位用于一致的尺寸

ch 单位表示所选字体中字符“0”的宽度。 它对于创建一致且响应式的布局很有用。

``` css
h1 {
  font-size: 2ch;
}
```

41. `::marker`伪元素

使用 `::marker` 伪元素设置列表项标记的样式。

``` css
li::marker {
  color: blue;
}
```

42. 背景的 `element()` 函数

使用 `element()` 函数动态引用元素作为背景。

``` css
.background {
  background: element(#targetElement);
}
```

43. 使用 Flexbox 的粘性页脚

使用 Flexbox 创建粘性页脚布局。

``` css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex: 1;
}
```

44. `scroll-padding`实现平滑滚动

通过调整滚动填充来改进滚动行为。

``` css
html {
    scroll-padding: 20px;
}
```

45. 交互式高亮效果

使用 CSS 变量创建交互式突出显示效果。

``` css
.highlight {
  --highlight-color: #e74c3c;
  background-image: linear-gradient(transparent 0%, var(--highlight-color) 0%);
  background-size: 100% 200%;
  transition: background-position 0.3s;
}

.highlight:hover {
  background-position: 0 100%;
}
```

46. 自定义单选按钮和复选框

设置不带图像的单选按钮和复选框的样式。

``` css
input[type="radio"] {
  appearance: none;
  -webkit-appearance: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  border: 2px solid #3498db;
}

input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 2px solid #e74c3c;
}
```

47. 调整文本区域的属性大小

使用 `resize` 属性控制文本区域的大小调整行为。

``` css
textarea {
  resize: vertical;
}
```

48. 文字渐变

使用 `background-clip` 和 `text-fill-color` 属性为文本创建渐变效果。

``` css
.gradient-text {
  background-image: linear-gradient(45deg, #3498db, #2ecc71);
  background-clip: text;
  color: transparent;
}
```

49. 长单词的断字属性

使用 `word-break` 属性可以控制不带空格的单词或字符串的长度。

``` css
.long-words {
  word-break: break-all;
}
```

50. 可变字体的 `font-variation-settings`

使用 `font-variation-settings` 属性微调可变字体样式。

``` css
.custom-font {
  font-family: 'MyVariableFont';
  font-variation-settings: 'wght' 600, 'ital' 1;
}
```

51. 用于创意叠加的混合混合模式

使用 `mix-blend-mode` 将混合模式应用于元素，在叠加元素时创建有趣的视觉效果。

``` css
.overlay {
  mix-blend-mode: overlay;
}
```

52. 设计破损图像的样式

使用 `:broken` 伪类将样式应用于损坏的图像。

``` css
img:broken {
  filter: grayscale(100%);
}
```

53. CSS 形状

使用 `shape-outside` 属性创建有趣的 CSS 形状设计。

``` css
.shape {
  shape-outside: circle(50%);
}
```

54. 子串匹配的属性选择器

使用属性选择器和 *= 运算符进行子字符串匹配。

``` css
[data-attribute*="value"] {
  /* Styles */
}
```

55. 模糊背景的背景滤镜

使用背景滤镜对背景应用模糊效果，以获得磨砂玻璃效果。

``` css
.element {
  backdrop-filter: blur(10px);
}
```

56. CSS环境变量

使用 `env()` 函数访问 CSS 中的环境变量。

``` css
.element {
  margin-top: env(safe-area-inset-top);
}
```

57. CSS属性计数器

使用 `:nth-child` 选择器计算特定属性值的出现次数。

``` css
[data-category="example"]:nth-child(3) {
  /* Styles for the third occurrence */
}
```

58. 用于文本换行的 CSS 形状

将 `shape-outside` 与 `Polygon()` 函数结合使用，可实现围绕不规则形状的精确文本环绕。

``` css
.text-wrap {
  shape-outside: polygon(0 0, 100% 0, 100% 100%);
}
```

59. 自定义光标样式

使用光标属性更改光标样式。

``` css
.custom-cursor {
  cursor: pointer;
}
```

60. 用于透明颜色的 HSLA

使用透明颜色的 HSLA 值，提供对 Alpha 通道的更多控制。

``` css
.transparent-bg {
  background-color: hsla(120, 100%, 50%, 0.5);
}
```

61. 垂直文本的文本方向

使用文本方向属性垂直旋转文本。

``` css
.vertical-text {
  text-orientation: upright;
}
```

62. 小型大写字母的字体变体

使用 `font-variant` 属性将小型大写字母应用于文本。

``` css
.small-caps {
  font-variant: small-caps;
}
```

63. 背景分割的 `box-decoration-break`

使用 `box-decoration-break` 控制跨多行的元素的背景。

``` css
.split-background {
  box-decoration-break: clone;
}
```

64. `:focus-visible` 用于特定焦点样式

仅当元素处于焦点且焦点不是通过鼠标单击提供时才应用样式。

``` css
input:focus-visible {
  outline: 2px solid blue;
}
```

65. 最佳字体渲染的文本渲染

使用文本渲染属性改进文本渲染。

``` css
.optimized-text {
  text-rendering: optimizeLegibility;
}
```

66. 首字母大写字母

使用 `::first-letter` 设置块级元素的第一个字母的样式。

``` css
p::first-letter {
  font-size: 2em;
}
```

67. `overscroll-behavior` 滚动超调

控制用户滚动超过滚动容器边界时的行为。

``` css
.scroll-container {
  overscroll-behavior: contain;
}
```

68. 垂直布局的写作模式

使用 `writing-mode` 属性创建垂直布局。

``` css
.vertical-layout {
  writing-mode: vertical-rl;
}
```

69. `::cue` 用于设置 HTML5 标题样式

使用 `::cue` 伪元素设置 HTML5 标题文本的样式。

``` css
::cue {
  color: blue;
}
```

70. 用于截断多行文本的`line-clamp`

使用 `line-clamp` 属性限制元素内显示的行数。

``` css
.truncated-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

71. `scroll-snap-align`

`scroll-snap-align` 属性控制滚动容器内滚动捕捉点的对齐方式，确保精确控制滚动行为并增强用户体验。

``` css
.container {
  scroll-snap-type: x mandatory;
}
.item {
  scroll-snap-align: center;
}
```

72. `overscroll-behavior`

`overscroll-behavior` 使您能够定义浏览器应如何处理滚动过度，防止不必要的滚动效果并改善整体滚动体验。

``` css
.scrollable {
  overscroll-behavior: contain;
}
```

73. 字体字距调整

字体字距调整允许微调字符间距，通过调整文本元素内字符之间的间距来确保最佳的可读性。

``` css
p {
  font-kerning: auto;
}
```

74. 形状边缘

当与 CSS 形状结合使用时，形状边距指定浮动元素形状周围的边距，从而可以精确控制文本换行和布局。

``` css
.shape {
  shape-margin: 20px;
}
```

75. 滚动边距

滚动边距设置滚动容器边缘和滚动内容开始之间的边距，通过提供滚动缓冲空间来增强用户体验。

``` css
.container {
  scroll-margin-top: 100px;
}
```

76. 选项卡大小

滚动边距设置滚动容器边缘和滚动内容开始之间的边距，通过提供滚动缓冲空间来增强用户体验。

``` css
pre {
  tab-size: 4;
}
```

77. 文本最后对齐

`text-align-last` 确定块元素中最后一行文本的对齐方式，从而提供对多行块中文本对齐的精确控制。

``` css
p {
  text-align-last: justify;
}
```

78. 文本对齐

此属性控制文本对齐行为，指定是否应使用字间或字符间间距进行文本对齐。

``` css
p {
  text-align: justify;
  text-justify: inter-word;
}
```

79. 列填充

列填充指示内容如何跨多列布局分布，允许跨列顺序或平衡分布内容。

``` css
.container {
  column-count: 3;
  column-fill: auto;
}
```

80. 轮廓偏移

轮廓偏移调整轮廓和元素边缘之间的空间，从而可以更好地控制轮廓的外观而不影响布局。

``` css
button {
  outline: 2px solid blue;
  outline-offset: 4px;
}
```

81. 字体变体数字

此属性允许对数字排版渲染进行细粒度控制，从而启用诸如衬里和旧式数字、分数和序数指示符等功能。

``` css
p {
  font-variant-numeric: lining-nums;
}
```

82. 字体光学尺寸

启用或禁用字体光学尺寸调整以调整字符的间距和比例，以改善各种字体大小的视觉和谐。

``` css
p {
  font-optical-sizing: auto;
}
```

83. 文本装饰厚度

控制文本装饰的粗细，例如下划线、上划线和穿线，以进行精确定制。

``` css
p {
  text-decoration-thickness: 2px;
}
```

84. 文本下划线偏移

调整下划线相对于文本基线的位置，以改进排版细化。

``` css
p {
  text-underline-offset: 3px;
}
```

85. 滚动填充块

定义在可滚动块容器周围添加的填充空间，以确保内容在滚动期间保持可见和可访问。

``` css
.container {
  scroll-padding-block: 20px;
}
```

86. 内联滚动填充

设置在可滚动内联容器周围添加的填充空间，以增强滚动交互期间的用户体验。

``` css
.container {
  scroll-padding-inline: 10px;
}
```

87. 换行

指定单词或字符内的换行方式，以控制换行行为，从而改进文本布局和可读性。

``` css
p {
  line-break: strict;
}
```

88. 盒子装饰打破

控制跨分段元素的边框和填充的渲染，以确保跨多行或多列分割的元素的样式一致。

``` css
.element {
  box-decoration-break: clone;
}
```

89. 首字母

将块元素的第一个字母或首字母字符设计为装饰性首字下沉或其他视觉上突出的首字母字符。

``` css
p::first-letter {
  font-size: 2em;
  float: left;
}
```

90. 图像渲染

调整图像的渲染质量和性能，优化各种场景的图像显示。

``` css
img {
  image-rendering: pixelated;
}
```

91. 字体功能设置

`font-feature-settings` 允许您启用或禁用字体中的 OpenType 功能，例如，连字、字距调整和样式替代。

``` css
p {
  font-feature-settings: "liga" on;
}
```

92. 文本导向

此属性控制文本在其包含框中的方向，从而启用垂直或横向文本布局。

``` css
.vertical-text {
  text-orientation: sideways;
}
```

93. 文本装饰-跳过墨迹

`text-decoration-skip-ink` 控制文本装饰是否应跳过上升部分和下降部分，从而改善下划线和穿线的外观。

``` css
p {
  text-decoration-skip-ink: auto;
}
```

94. 文本下划线位置

`text-underline-position` 调整下划线相对于文本基线的位置，从而可以精确控制下划线的位置。

``` css
p {
  text-underline-position: under;
}
```

95. 图像导向

`image-orientation` 控制图像的方向，允许您根据需要旋转或翻转它。

``` css
img {
  image-orientation: from-image;
}
```

96. `column-span`

`column-span` 允许一个元素在多列布局中跨越多个列，从而实现更灵活和动态的设计。

``` css
.spanning-element {
  column-span: all;
}
```

97. `contain`

`contain` 指定元素的包含策略，通过限制布局计算和渲染的范围来实现优化，从而提高性能。

``` css
.optimized-element {
  contain: layout;
}
```

98. 内容可见性

内容可见性允许您控制屏幕外或隐藏内容的渲染行为，通过跳过隐藏元素的布局和绘制阶段来提高渲染性能。

``` css
.off-screen {
  content-visibility: auto;
}
```

99. 文字装饰风格

`text-decoration-style` 指定用于文本装饰的线条样式，允许您选择不同的线条样式，例如实线、双线、点线或虚线。

``` css
p {
  text-decoration: underline;
  text-decoration-style: wavy;
}
```

100. 字间距

字间距调整文本元素中字之间的间距，使您可以微调版式布局并提高可读性。

``` css
p {
  word-spacing: 2px;
}
```

101. 超出部分省略号

超出部分内容不展示，使用省略号代替

``` css
p {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```