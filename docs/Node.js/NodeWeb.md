---
date: 2025-12-27
title: Node Web
description: 使用Node构建Web程序
---

### 一个Web程序的结构

典型的 Node Web 程序是由下面几部分组成的：

- package.json—— 一个包含依赖项列表和运行这个程序的命令的文件；
- public/—— 静态资源文件夹，CSS 和客户端 JavaScript 都放在这里；
- node_modules/——项目的依赖项都会装到这里；
- 放程序代码的一个或多个 JavaScript 文件。

程序代码一般又会分成下面几块：

- app.js 或 index.js——设置程序的代码；
- models/——数据库模型；
- views/——用来渲染页面的模板；
- controllers/ 或 routes/——HTTP 请求处理器；
- middleware/——中间件组件。

### Express

Express 以 Node 自带的 http 模块为基础，致力于在 HTTP 请求和响应上来建模 Web 程序。
为了做出一个最基本的程序，我们需要用 express()创建一个程序实例，添加路由处理器，然
后将这个程序实例绑定到一个 TCP 端口上。下面是最基本的程序所需的全部代码：

```js
const express = require('express');
const app = express();
const port = process.env.PORT || 8888;
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(port, () => {
    console.log(`Express web app available at localhost: ${port}`);
});
```

### 搭建一个REST ful风格的web服务

```js
const express = require('express');
const app = express();
const articles = [{title: 'Example'}];
app.set('port', process.env.PORT || 8888);
app.get('/articles', (req, res, next) => {
    res.send(articles);
});
app.post('/articles', (req, res, next) => {
    res.send('OK');
});
app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('Fetching:', id);
    res.send(articles[id]);
});
app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    console.log('Deleting:', id);
    delete articles[id];
    res.send({message: 'Deleted'});
});
app.listen(app.get('port'), () => {
    console.log('App started on port', app.get('port'));
});
```

新增文章功能优化

```js
const express = require('express');
const app = express();
const articles = [{title: 'Example'}];
app.set('port', process.env.PORT || 3000);
// 解析 Content-Type: application/json, 可以直接使用req.body.title
app.use(express.json());
// 解析 Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));
app.post('/articles', (req, res, next) => {
    const article = {title: req.body.title};
    articles.push(article);
    res.send(article);
});

// 前端发送application/json：
fetch('/api/data', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({name: '张三', age: 25})
});

// HTML 表单提交
// <form action="/submit" method="post">
//     <input name="username" value="张三">
//     <input name="password" value="123456">
// </form>
// 或者前端发送application/x-www-form-urlencoded：
fetch('/submit', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: 'username=张三&password=123456'
});
```

### 数据持久化——连接SQLite

SQLite 是一个轻量级的嵌入式关系型数据库，不需要单独的服务器进程，整个数据库就是一个文件

1. 构建模型类

```js
// db.js
const sqlite3 = require('sqlite3').verbose();
const dbName = 'later.sqlite';
const db = new sqlite3.Database(dbName);
db.serialize(() => {
    const sql = `CREATE TABLE IF NOT EXISTS articles 
    (id integer primary key, title, content TEXT)`;
    db.run(sql);
});

class Article {
    // cb是回调函数
    static all(cb) {
        db.all('SELECT * FROM articles', cb);
    }

    static find(id, cb) {
        db.get('SELECT * FROM articles WHERE id = ?', id, cb);
    }

    static create(data, cb) {
        const sql = 'INSERT INTO articles(title, content) VALUES (?, ?)';
        db.run(sql, data.title, data.content, cb);
    }

    static delete(id, cb) {
        if (!id) return cb(new Error('Please provide an id'));
        db.run('DELETE FROM articles WHERE id = ?', id, cb);
    }
}

module.exports = db;
module.exports.Article = Article; 
```

添加到路由中

```js
app.get('/articles', (req, res, next) => {
    Article.all((err, articles) => {
        if (err) return next(err);
        res.send(articles);
    });
});
app.get('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.find(id, (err, article) => {
        if (err) return next(err);
        res.send(article);
    });
});
app.delete('/articles/:id', (req, res, next) => {
    const id = req.params.id;
    Article.delete(id, (err) => {
        if (err) return next(err);
        res.send({message: 'Deleted'});
    });
});
```

PS: `next`是一个函数，用于将控制权传递给下一个中间件或路由处理器。

```js
app.use((req, res, next) => {
    console.log('1. 第一个中间件 - 开始');
    next();
    console.log('1. 第一个中间件 - 结束');
});
app.use((req, res, next) => {
    console.log('2. 第二个中间件 - 开始');
    next();
    console.log('2. 第二个中间件 - 结束');
});
app.get('/test', (req, res, next) => {
    console.log('3. 路由处理器');
    res.send('完成');
// 注意：res.send() 后还可以执行代码，但不能再修改响应
});
// 输出顺序：
// 1. 第一个中间件 - 开始
// 2. 第二个中间件 - 开始
// 3. 路由处理器
// 2. 第二个中间件 - 结束
// 1. 第一个中间件 - 结束
```

#### 模板渲染

模板渲染是将动态数据与静态模板结合，生成最终HTML的过程。

```js
// 模板 + 数据 = HTML
const template = '<h1>Hello, {{name}}!</h1>';
const data = {name: '张三'};
// 渲染结果: <h1>Hello, 张三!</h1>
```

使用EJS模板渲染

```js
const express = require('express');
const app = express();

// 1. 设置模板引擎
app.set('view engine', 'ejs');

// 2. 设置模板目录（默认是 views 文件夹）
app.set('views', './views');

// 3. 渲染页面
app.get('/', (req, res) => {
    const data = {
        title: '首页',
        user: {name: '张三', age: 25},
        items: ['苹果', '香蕉', '橙子'],
        isLoggedIn: true
    };

    res.render('index', data);
});
```

```ejs
<!-- views/index.ejs -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title><%= title %></title>
    <style></style>
</head>
<body>
<h1>欢迎来到 <%= title %></h1>

<!-- 1. 输出变量 -->
<p>用户名: <%= user.name %></p>
<p>年龄: <%= user.age %></p>

<!-- 2. 条件判断 -->
<% if (isLoggedIn) { %>
    <p class="user">您已登录</p>
    <button>退出登录</button>
<% } else { %>
    <p class="guest">请先登录</p>
    <button>登录</button>
<% } %>

<!-- 3. 循环遍历 -->
<h3>水果列表：</h3>
<ul>
    <% items.forEach(function(item) { %>
        <li><%= item %></li>
    <% }); %>
</ul>

<!-- 4. 转义输出（防止 XSS） -->
<p>用户输入: <%- unsafeContent %></p>

<!-- 5. 包含其他模板 -->
<%- include('partials/header') %>
<%- include('partials/footer') %>

<!-- 6. 注释 -->
<%# 这是EJS注释，不会输出到HTML %>

<!-- 7. 模板布局 -->
<%- include('layouts/main', {body: content}) %>
</body>
</html>
```

模板使用

```ejs
<!-- layout/main.ejs （定义一次布局） -->
<!DOCTYPE html>
<html>
<head>
    <title><%= title %></title>
    <link rel="stylesheet" href="styles.css">
    <script src="main.js"></script>
</head>
<body>
<header>...</header>
<nav>...</nav>

<!-- 内容区域（占位符） -->
<%- body %>

<footer>...</footer>
</body>
</html>

<!-- page1.ejs （只需关注独特内容） -->
<%- include('../layouts/main', {
title: '联系我们',
description: '欢迎与我们取得联系',
stylesheets: ['/css/contact.css'],
scripts: ['/js/contact.js'],
body: `
<h1>页面1标题</h1>
<p>页面1内容...</p>`}) %>

```

```ejs
<!--定义head.ejs，复用共同组件-->
<% include head %>
<!--定义foot.ejs，复用共同组件-->
<% include foot %> 
```

#### node-readability

node-readability 用于提取网页的主要内容（去除广告、导航、页脚等无关内容）

```js
const read = require('node-readability');
app.post('/articles', (req, res, next) => {
    const url = req.body.url;
    read(url, (err, result) => {
        if (err || !result) res.status(500).send('Error downloading article');
        Article.create(
            {title: result.title, content: result.content},
            (err, article) => {
                if (err) return next(err);
                res.send('OK');
            }
        );
    });
}); 
```

### 多种返回格式

```js
res.format({
    html: () => {
        res.render('articles.ejs', {articles: articles});
    },
    json: () => {
        res.send(articles);
    }
}); 
```

#### express.static

express.static() 是 Express 中提供静态文件服务的内置中间件。

- 响应静态文件请求

```js
// 把 /css/bootstrap.css 添加到模板中
app.use(
    '/css/bootstrap.css',
    express.static('node_modules/bootstrap/dist/css/bootstrap.css')
);
// <link rel="stylesheet" href="/css/bootstrap.css">
```

- 加载静态资源

```js

// 多个静态目录（按顺序查找）
app.use(express.static('public'));     // 优先级低
app.use(express.static('uploads'));    // 优先级中
app.use('/static', express.static('assets')); // 优先级高（带前缀）
// 访问：
// /index.html        → 先在 public 找，找不到在 uploads 找
// /static/logo.png   → assets/logo.png
```

- 虚拟路径

```js
// 使用虚拟路径
app.use('/assets', express.static('public'));

// 访问：
// http://localhost:3000/assets/css/style.css
// 实际文件：public/css/style.css
```