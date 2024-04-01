---
title: Web安全之 SQL 注入
date: 2021-09-26 18:20:26
tag: [network, security, sql]
---

## Web安全之 SQL 注入

随着互联网的快速发展，网络安全问题日益受到人们的关注。 `SQL` 注入是一种常见的网络安全攻击方式，严重威胁着数据库的安全。本文将从 `SQL` 注入的概念、原理、危害以及防范措施等方面，对网络安全中的 `SQL` 注入进行深入探讨。

### 概念

`SQL` 注入（`SQL Injection`）是指攻击者在用户输入的数据中注入恶意的 `SQL` 语句，从而在未经授权的情况下实现对数据库的非法操作。当应用程序没有对用户输入的数据进行有效的验证和过滤时，攻击者可以利用这一漏洞，篡改原始的 `SQL` 语句，进而窃取、篡改或删除数据库中的数据。

### 原理

`SQL` 注入的原理主要基于应用程序对用户输入数据的处理不当。攻击者通过在用户输入的数据中插入恶意的 `SQL` 语句，使得应用程序在构建 `SQL` 查询时，将恶意语句作为查询的一部分发送给数据库执行。这样，攻击者就可以绕过应用程序的验证，直接对数据库进行操作。

### 危害

1. **数据泄露：**攻击者可以通过 `SQL` 注入获取数据库中的敏感信息，如用户密码、身份信息、银行账户等，从而导致数据泄露和用户隐私泄露。
2. **数据篡改：**攻击者可以利用 `SQL` 注入修改数据库中的数据，破坏数据的完整性和准确性。
3. **数据删除：**攻击者可以通过 `SQL` 注入删除数据库中的数据，导致数据丢失和业务受损。
4. **服务器被控制：**攻击者还可以通过 `SQL` 注入获取数据库的完全控制权限，进一步对服务器进行攻击和控制。

### 案例

下面是一个简单的 `Node.js` 和 `Express` 框架中的 `SQL` 注入案例：

``` js
const express = require('express');
const mysql = require('mysql');
const app = express();

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'test'
});

connection.connect();

// 定义一个简单的路由处理函数，存在 SQL 注入漏洞
app.get('/users', (req, res) => {
  const username = req.query.username; // 从查询字符串获取用户名

  // 直接将用户名插入 SQL 查询中，没有进行任何过滤或转义
  const query = `SELECT * FROM users WHERE username = '${username}'`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
```

在上述代码中，我们定义了一个简单的 `Express` 应用，它监听 `/users` 路由，并从查询字符串中获取 `username` 参数。然后，我们直接将 `username` 插入 `SQL` 查询语句中。由于没有对 `username` 进行任何形式的过滤或转义，攻击者可以通过在查询字符串中插入恶意的 `SQL` 代码来操纵查询结果，甚至执行任意的 `SQL` 语句。

例如，攻击者可以通过以下 `URL` 尝试注入攻击：

``` url
http://localhost:3000/users?username='; DROP TABLE users; --
```

这个 `URL` 会导致 `SQL` 查询变成：

``` sql
SELECT * FROM users WHERE username = ''; DROP TABLE users; --'
```

如果应用执行了这条查询，它会删除 `users` 表中的所有数据。

### 防范措施

为了防止 `SQL` 注入攻击，你应该：

#### 使用参数化查询

参数化查询可以确保用户输入被当作数据而不是 `SQL` 代码来处理。在 `Node.js` 中，可以使用像 `mysql` 包中的 `query` 方法的参数化版本，或者使用 `ORM`（对象关系映射）库如 `Sequelize` 或者 `TypeORM`。

在上述的 `Node.js` 例子中，你可以使用 `mysql` 包来执行参数化查询。以下是一个使用 `mysql` 包和参数化查询来预防 `SQL` 注入的示例：

``` js
...

app.get('/users', (req, res) => {
  const username = req.query.username; // 从查询字符串获取用户名

  // 构建 SQL 语句
  const query = `SELECT * FROM users WHERE username = '?'`;

  connection.query(query, [username], (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

...
```

在这个例子中，`? `是一个参数占位符，代表我们要查询的 `username`。我们将 `username` 作为数组 `[username]` 的元素传递给 `query` 方法的第二个参数。这样，`MySQL` 驱动程序就会知道 `?` 应该被 `username` 的值替换。

由于参数化查询确保了用户输入被当作数据处理，而不是作为 `SQL` 代码的一部分，因此即使 `username` 包含恶意的 `SQL` 代码，它也不会被执行。这是预防 `SQL` 注入攻击的一种有效方式。

#### 使用预编译语句

预编译语句是一种将 `SQL` 语句和参数分开处理的方式，数据库管理系统会对 `SQL` 语句进行解析、优化和编译，然后存储起来。每次执行时，只需传递参数，避免了 `SQL` 注入的风险。


在上述的 `Node.js` 例子中，你可以使用 `mysql` 包来执行预编译语句。以下是一个使用 `mysql` 包和预编译语句来预防 `SQL` 注入的示例：

``` js
...

app.get('/users', (req, res) => {
  const username = req.query.username; // 从查询字符串获取用户名

  // 准备预编译语句
  const prepareQuery = `PREPARE stmt FROM "SELECT * FROM users WHERE username = '?'"`;
  connection.query(prepareQuery, (error, results, fields) => {
    if (error) throw error;

    // 设置参数并执行预编译语句
    const executeQuery = 'EXECUTE stmt USING ?';
    connection.query(executeQuery, [username], (error, results, fields) => {
      if (error) throw error;
      console.log(results);

      // 释放预编译语句
      connection.query('DEALLOCATE PREPARE stmt', (error) => {
        if (error) throw error;
        connection.end();
      });
    });
  });
});

...

```

在这个预编译语句的例子中，我们首先准备一个预编译语句，其中包含一个占位符 `?`。然后，我们使用 `PREPARE` 语句将其发送到数据库进行编译。之后，我们使用 `EXECUTE` 语句并传递参数 `[username]` 来执行预编译的语句。最后，我们使用 `DEALLOCATE PREPARE` 语句释放预编译语句的资源。

使用预编译语句的好处是，即使参数中包含恶意的 `SQL` 代码，它也不会被数据库执行。这是因为预编译语句将参数和 `SQL` 语句分开处理，数据库只会执行预编译的 `SQL` 语句，并将参数作为数据来处理。

#### 转义用户输入

转义用户输入是另一种防止 `SQL` 注入攻击的方法。转义用户输入意味着将用户提供的值中的特殊字符（如单引号、双引号等）替换为它们的转义版本，这样在 `SQL` 语句中它们就会被当作普通文本处理，而不是 `SQL` 代码的一部分。

虽然参数化查询是首选的方法，因为它提供了更高级别的安全性，但在某些情况下，你可能需要手动转义用户输入。在 `Node.js` 中，你可以使用 `MySQL` 驱动程序的 `escape` 方法来转义用户输入。

以下是一个使用 `Node.js` 和 `mysql` 驱动程序手动转义用户输入的例子：

``` js
...

app.get('/users', (req, res) => {
  // 从查询字符串获取用户名
  const username = req.query.username;

  // 使用 escape 方法转义用户输入
  const safeUsername = mysql.escape(username);

  // 构建 SQL 语句
  const query = `SELECT * FROM users WHERE username = '${safeUsername}'`;

  connection.query(query, (error, results, fields) => {
    if (error) throw error;
    res.send(results);
  });
});

...
```

在这个例子中，我们使用了 `mysql.escape` 方法来转义 `username` 中的特殊字符。这样，即使 `username` 包含特殊字符，它也不会被误解为 `SQL` 语句的一部分。

然而，尽管手动转义用户输入可以提供一定程度的保护，但它仍然不是最安全的做法。原因之一是它可能会导致程序逻辑变得复杂且容易出错，尤其是在构建复杂的 `SQL` 语句时。因此，推荐使用参数化查询或预编译语句，因为它们提供了更强的安全性保证，并且更容易正确使用。

#### 最小权限原则

确保数据库账户只有执行必要操作的最小权限。例如，如果应用程序只需要从数据库中读取数据，那么就不应该赋予它写入权限。

在 `MySQL` 中设置只读权限，你需要登录到MySQL数据库，然后为用户创建一个新的角色并授予只读权限。你可以使用GRANT语句来实现这一点。具体如下所示:

``` sql
-- 登录到MySQL
mysql -u root -p

-- 创建新角色
CREATE ROLE 'readonlyuser'@'localhost';

-- 授予只读权限
GRANT SELECT ON your_database.* TO 'readonlyuser'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出MySQL
EXIT;
```

在上面的例子中，`your_database` 是你想要让用户具有只读权限的数据库名。`'readonlyuser'@'localhost'` 表示用户名为 `readonlyuser` ，并且该用户只能从本地主机连接到数据库。如果你希望用户可以从任何主机连接，你可以将 `localhost` 替换为 `'%'`。

#### 错误处理

不要将详细的数据库错误信息直接返回给用户。这可以防止攻击者利用这些信息进行更复杂的攻击。

#### 安全审计和测试

使用工具如 `SQLMap`、`OWASP Zap` 等进行安全审计和测试，确保应用程序不会受到 `SQL` 注入攻击。

### 总结

总之， `SQL` 注入是一种常见的网络安全攻击方式，对数据库的安全构成严重威胁。为了防范 `SQL` 注入攻击，我们需要加强用户输入验证、使用参数化查询、存储过程等安全措施，并定期更新和修补数据库管理系统和应用程序。只有这样，我们才能确保数据库的安全，保护用户的数据隐私和业务安全。