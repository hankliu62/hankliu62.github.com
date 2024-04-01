---
title: Web安全之 XSS 攻击
date: 2020-06-12 10:10:20
tag: [network, security, xss]
---

## Web安全之 XSS 攻击

### 简介
**XSS，全称跨站脚本攻击（Cross-Site Scripting）**，是一种网络安全漏洞攻击，指攻击者在网页中嵌入恶意脚本，当其他用户浏览该网页时，恶意脚本就会在其浏览器上执行，从而达到攻击者窃取用户信息、破坏数据、篡改网页内容、在用户浏览器上执行非法任务等目的。

### 分类

`XSS`攻击分为三种类型：

- **反射型XSS（Reflected XSS）**：攻击者将恶意脚本嵌入到URL地址中，当其他用户访问这个URL时，恶意脚本就会在其浏览器中执行。这种攻击方式需要用户主动点击含有恶意脚本的链接才会触发。

- **存储型XSS（Stored XSS）**：攻击者将恶意脚本存储到被攻击的网站数据库中，当其他用户访问网站时，恶意脚本会从数据库中取出并在用户浏览器中执行。这种攻击方式不需要用户主动点击链接，只要用户浏览被攻击的网站就可能被攻击。

- **DOM型XSS（DOM-based XSS）**：攻击者通过修改页面的DOM结构，注入恶意脚本，当其他用户浏览该页面时，恶意脚本会在用户浏览器中执行。这种攻击方式也不需要用户主动点击链接，只需要用户浏览被修改的页面就可能被攻击。

### 案例

#### 反射型XSS

在`Node.js`中，一个反射型`XSS`攻击的案例可能涉及一个web应用，该应用没有正确地处理或转义用户输入的数据，并将其直接插入到HTML响应中。攻击者可以构造一个包含恶意脚本的URL，当其他用户访问这个URL时，恶意脚本会在用户的浏览器中执行。

以下是一个简单的`Node.js`反射型`XSS`攻击的案例：

``` javascript
const express = require('express');
const app = express();
app.use(express.static('public'));

app.get('/profile', (req, res) => {
  // 假设用户可以通过URL参数传递他们的名字
  const username = req.query.username;

  // 没有对用户输入进行任何处理或转义
  const html = `<html>
                <body>
                  <h1>Welcome, ${username}!</h1>
                </body>
              </html>`;

  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

在这个例子中，我们创建了一个简单的`Express`应用，其中有一个`/profile`路由，该路由从URL的查询参数中获取用户名（`username`）。然后，我们将这个用户名嵌入到一个`HTML`字符串中，并将其作为响应发送回客户端。

攻击者可以构造一个包含恶意脚本的URL，如：

```
http://example.com/profile?username=<script>alert('XSS');</script>
```

当用户访问这个`URL`时，浏览器会接收到包含恶意脚本的`HTML`响应，并执行该脚本，从而触发`XSS`攻击。

为了防止反射型`XSS`攻击，开发者应该对用户输入进行适当的过滤和转义。在这个案例中，可以使用如`escape-html`这样的库来转义`HTML`特殊字符：

``` javascript
const escapeHtml = require('escape-html');

app.get('/profile', (req, res) => {
  const username = req.query.username;

  // 转义用户输入中的HTML特殊字符
  const escapedUsername = escapeHtml(username);

  const html = `<html>
                <body>
                  <h1>Welcome, ${escapedUsername}!</h1>
                </body>
              </html>`;

  res.send(html);
});
```

通过转义用户输入，恶意脚本将不会被浏览器执行，从而防止了`XSS`攻击。此外，开发者还应该使用内容安全策略（`CSP`）等额外安全措施来增强应用的安全性。

<!-- more -->

#### 存储型XSS
在`存储型XSS（Persistent XSS）`攻击中，恶意脚本被用户提交并存储到服务器端的数据库中。当其他用户访问包含这些恶意脚本的页面时，脚本会在用户的浏览器上执行。下面是一个简单的`Node.js`存储型XSS案例，我们将使用`Express`框架和`MongoDB`数据库。

首先，确保你已经安装了以下依赖：

``` bash
npm install express body-parser mongoose
```

然后，你可以创建一个简单的`Express`应用，并设置一个`MongoDB`数据库来存储评论。

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// 连接到MongoDB数据库
mongoose.connect('mongodb://localhost/xss-example', { useNewUrlParser: true, useUnifiedTopology: true });

// 定义评论模型
const Comment = mongoose.model('Comment', new mongoose.Schema({
  content: String
}));

// 使用body-parser中间件来解析请求体
app.use(bodyParser.urlencoded({ extended: true }));

// 路由：添加评论
app.post('/comment', async (req, res) => {
  try {
    // 创建新的评论并保存到数据库
    const newComment = new Comment({ content: req.body.content });
    await newComment.save();
    res.send('Comment added successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while saving the comment.');
  }
});

// 路由：显示所有评论
app.get('/comments', async (req, res) => {
  try {
    // 从数据库中获取所有评论
    const comments = await Comment.find({});

    // 渲染评论列表的HTML
    const html = renderComments(comments);
    res.send(html);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching the comments.');
  }
});

// 渲染评论列表的HTML
function renderComments(comments) {
  let html = '<html><body>';
  comments.forEach(comment => {
    // 这里没有对评论内容进行转义，这会导致存储型XSS漏洞
    html += `<div>${comment.content}</div>`;
  });
  html += '</body></html>';
  return html;
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```
在这个案例中，我们定义了一个`Comment`模型，用于在`MongoDB`数据库中存储评论。`/comment`路由接受`POST`请求，将用户提交的评论保存到数据库中。`/comments`路由则负责从数据库中检索所有评论，并将它们渲染为HTML页面。

重要提示：在这个案例的`renderComments`函数中，我们没有对评论内容进行任何形式的转义或过滤。这意味着如果用户在评论中输入了恶意脚本，它将被直接插入到`HTML`页面中，并在其他用户查看该页面时执行。这就是`存储型XSS`攻击的核心。

为了防止`存储型XSS`攻击，你应该对所有的用户输入进行适当的转义或过滤。在`Express`应用中，你可以使用如`express-sanitized`和`helmet`这样的中间件来设置一些基本的`HTTP`头，以增加安全性。另外，使用模板引擎（如`ejs`、`pug`等）也可以帮助你更安全地渲染用户输入的数据，因为这些模板引擎通常会自动转义特殊字符。此外，对于`存储型XSS`，还需要确保在将用户数据插入到`HTML`之前进行适当的转义处理。

#### DOM型XSS
在`React`应用程序中，`DOM型XSS`（跨站脚本）攻击通常发生在直接将用户输入嵌入到`JSX`中而没有进行适当的转义或过滤时。`React`本身不会自动转义用户输入，因此开发者需要确保在渲染用户输入之前进行适当的处理。下面是一个简单的`React`应用案例，展示了如果不正确地处理用户输入，可能会导致的`DOM型XSS`攻击：

首先，创建一个简单的`React`组件，它将接收一个名为`username`的属性，并将其直接渲染到页面上：

```jsx
import React from 'react';

function UserProfile({ username }) {
  return (
    <div>
      <h1>Welcome, {username}!</h1>
    </div>
  );
}

export default UserProfile;
```

然后，在父组件中使用这个`UserProfile`组件，并假设从某个地方（例如URL参数、数据库或用户输入）获取`username`：

``` jsx
import React from 'react';
import UserProfile from './UserProfile';

function App() {
  // 假设这是从某个不安全的来源获取的用户名
  const username = "Alice <img src='https://example.com/x.png' onerror='alert(\"XSS\")' />";

  return (
    <div className="App">
      <UserProfile username={username} />
    </div>
  );
}

export default App;
```

在这个案例中，如果`username`包含了恶意的`HTML`和`JavaScript`代码，那么这段代码将会被执行，导致`XSS`攻击。

为了防止这种攻击，你应该在渲染用户输入之前使用某种方法对其进行转义，以确保它不会被浏览器解析为`HTML`或`JavaScript`代码。在`React`中，你可以使用内置的`dangerouslySetInnerHTML`属性配合适当的转义函数来安全地渲染`HTML`内容。然而，这通常不是推荐的做法，因为它可能会引入其他安全风险。

更好的做法是使用库如`react-dom-purify`来清理用户输入中的潜在恶意代码。下面是如何使用`react-dom-purify`来防止`XSS`攻击的例子：

首先，安装`react-dom-purify`：

``` bash
npm install react-dom-purify
```

然后，在你的`React`组件中使用它：

``` jsx
import React from 'react';
import DOMPurify from 'react-dom-purify';

function UserProfile({ username }) {
  // 使用DOMPurify来清理用户输入中的潜在恶意代码
  const safeUsername = DOMPurify.sanitize(username);

  return (
    <div>
      <h1>Welcome, {safeUsername}!</h1>
    </div>
  );
}

export default UserProfile;
```

在这个修改后的例子中，即使`username`包含了恶意的`HTML`和`JavaScript`代码，`DOMPurify.sanitize`函数也会将其清理掉，确保它们不会被浏览器执行。

总之，为了防止`DOM型XSS`攻击，你应该始终确保在将用户输入渲染到React组件之前对其进行适当的转义或清理。

#### ejs 模板引擎

例如，如果你使用`ejs`作为模板引擎，你可以这样渲染评论：

```ejs
<body>
  <% comments.forEach(function(comment) { %>
    <div><%= comment.content %></div>
  <% }); %>
</body>
```

在这个例子中，`<%= comment.content %>`会自动转义`comment.content`中的特殊字符，从而防止`XSS`攻击。

为了防止反射型和`存储型XSS`攻击，开发者应该对用户输入的数据进行适当的验证、过滤和转义。在`Node.js`中，可以使用诸如`express-sanitized`和`helmet`等中间件来增强应用的安全性。此外，对于`存储型XSS`，还需要确保在将用户数据插入到`HTML`之前进行适当的转义处理。

#### express-sanitized 中间件
`express-sanitized` 是一个 `Express.js` 的中间件，用于帮助防止跨站脚本（`XSS`）攻击。它通过提供一组函数来清理和转义用户输入的数据，从而减少潜在的安全风险。然而，需要注意的是，`express-sanitized` 本身并不提供全面的 `XSS` 保护。它应当与其他安全措施（如内容安全策略（`CSP`）、`HTTP` 头设置等）一起使用。

下面是一个简单的 `Node.js` 案例，演示了如何使用 `express-sanitized` 中间件来防止反射型 `XSS` 攻击：

首先，你需要安装 `express` 和 `express-sanitized`：

```bash
npm install express express-sanitized
```
然后，你可以创建一个简单的 Express 应用，并使用 express-sanitized 来清理用户输入的数据：

``` javascript
const express = require('express');
const sanitized = require('express-sanitized');
const app = express();

// 使用 express-sanitized 中间件
app.use(sanitized());

// 一个简单的 GET 路由，接收用户输入并反射回去
app.get('/reflect', (req, res) => {
  // 假设我们从 URL 参数中获取用户输入
  const userInput = req.query.message;

  // 使用 express-sanitized 的 sanitize 函数来清理用户输入
  const cleanedInput = sanitized.sanitize(userInput);

  // 将清理后的用户输入嵌入到 HTML 中
  const html = `
    <html>
      <body>
        <h1>Welcome, ${cleanedInput}!</h1>
      </body>
    </html>
  `;

  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

在这个例子中，我们定义了一个 `/reflect` 路由，该路由从 `URL` 参数 `message` 中获取用户输入。然后，我们使用 `express-sanitized` 的 sanit`ize 函数来清理用户输入，该函数会移除或转义潜在的恶意脚本标签。最后，我们将清理后的用户输入嵌入到 `HTML` 响应中。

然而，需要注意的是，仅仅依赖 `express-sanitized` 是不够的。你应该始终遵循最佳实践，如使用模板引擎（如 `Pug`、`EJS` 等）来自动处理 `HTML` 转义，设置适当的 `HTTP` 头（如 `X-XSS-Protection` 和 `Content-Security-Policy`），并且对用户输入进行严格的验证和过滤。

另外，`express-sanitized` 可能不是最新的或最广泛使用的 `XSS` 防护中间件。对于更全面的 `XSS` 防护，你可以考虑使用 `helmet` 中间件，它提供了多种增强 `Express` 应用安全性的功能，包括 `XSS` 防护。

#### helmet 中间件

`helmet` 是一个 `Express.js` 的中间件，用于设置各种 `HTTP` 头来帮助预防一些已知的 `web` 漏洞，包括跨站脚本攻击（XSS）和数据泄露等。尽管 `helmet` 本身并不能完全防止 `XSS` 攻击，但它可以通过设置某些 `HTTP` 头来减少攻击面。

下面是一个使用 `helmet` 中间件来增强 `Express.js` 应用安全性的简单案例：

首先，你需要安装 `express` 和 `helmet`：

``` bash
npm install express helmet
```

然后，创建一个 `Express` 应用并引入 `helmet` 中间件：

``` javascript
const express = require('express');
const helmet = require('helmet');

const app = express();

// 使用 helmet 中间件
app.use(helmet());

// 一个简单的 GET 路由
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

在上面的代码中，`helmet()` 函数是一个方便的快捷方式，用于启用多个安全头。这些头包括：

- `content-security-policy`：帮助检测和缓解某些类型的攻击，包括跨站脚本和数据注入攻击。
- `x-dns-prefetch-control`：控制浏览器是否应该执行 `DNS` 预取。
- `x-frame-options`：指示浏览器是否应该允许页面被嵌入到 `<iframe>`、`<frame>`、`<embed>` 或 `<object>` 元素中。
- `x-content-type-options`：防止浏览器猜测响应的 `MIME` 类型。
- `x-xss-protection`：启用浏览器的反射型 `XSS` 保护。
- `x-permitted-cross-domain-policies`：限制 `Adobe Flash Player` 的跨域策略文件的使用。
- `referrer-policy`：控制浏览器在发送 `HTTP` 引用头时如何生成和发送引用信息。

请注意，尽管 `helmet` 提供了这些保护措施，但它们并不是万无一失的。特别是 `content-security-policy` 头，它允许你明确指定哪些内容是安全的，是防止 `XSS` 攻击的重要工具。你需要根据你的应用程序的具体需求来配置它。

此外，你还需要确保应用程序的其他部分（如模板引擎、用户输入验证等）也采取了适当的安全措施。`helmet` 只能作为安全策略的一部分，而不能单独依赖它来完全防止 `XSS` 攻击。

### 预防措施

为了防范`XSS`攻击，可以采取以下措施：

1. 对用户输入的数据进行过滤和转义，防止恶意脚本的注入。
2. 使用`HTTPOnly`属性设置Cookie，防止攻击者通过`XSS`攻击窃取用户信息。
3. 使用 `CSP` 内容安全策略（`Content-Security-Policy`）限制网站中能够执行的脚本，防止恶意脚本的执行。
4. 使用最新的Web安全技术和框架，如`React`、`Vue`等，它们提供了内置的`XSS`防护措施。
5. 定期对网站进行安全漏洞扫描和测试，及时发现和修复`XSS`漏洞。