---
title: 中间件
date: 2025-12-27
author: zyc
---

### Connect

Connect 以前是 Express 的基础，但实际上只用 Connect 也能做出完整的 Web 程序

```bash
npm install connect -d
```

```js
const app = require('connect')();
app.use((req, res, next) => {
    res.end('Hello, world!');
});
app.listen(3000); 
```

传给 app.use 的函数是个中间件，它以文本 Hello,World! 作为响应结束了请求处理过程

Connect 中间件就是 JavaScript 函数。这个函数一般会有三个参数：请求对象、响应对象，以
及一个名为 `next` 的回调函数。一个中间件完成自己的工作，要执行后续的中间件时，可以调用
这个回调函数。在中间件运行之前，Connect 会用`分派器`接管请求对象，然后交给程序中的第一个中间件。
![](./public/img_3.png)

#### 使用use组合中间件

这两个中间件的名称签名不一样：一个有 next，一个没有。因为后面这个中间件完成了 HTTP
响应，再也不需要把控制权交还给分派器了

```js
const connect = require('connect');

function logger(req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
}

function hello(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.end('hello world');
}

connect()
    .use(logger)
    .use(hello)
    .listen(3000);
```

#### 可配置中间件

为了做到可配置，中间件一般会遵循一个简单的惯例：用一个函数返回另一个函数（闭包）。
这种可配置中间件的基本结构如下所示：

```js
function setup(options) {
    // 设置逻辑
    return function (req, res, next) {
        // 中间件逻辑
    }
} 
```

之前的logger只能输出`console.log('%s %s', req.method, req.url);`，
要求logger能接收一个字符串参数，描述输出的日志格式，以适应不同的输出格式:

```js
const app = connect()
    .use(setup(':method :url'))
    .use(hello);

function setup(format) {
    const regexp = /:(\w+)/g;
    return function createLogger(req, res, next) {
        const str = format.replace(regexp, (match, property) => {
            return req[property];
        });
        console.log(str);
        next();
    }
} 
```

#### 错误处理

```js
const env = process.env.NODE_ENV || 'development';

// 错误处理中间件函数必须有四个参数：err、req、res 和 next
function errorHandler(err, req, res, next) {
    res.statusCode = 500;
    switch (env) {
        case 'development':
            console.error('Error:');
            console.error(err);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(err));
            break;
        default:
            res.end('Server error');
    }
}

module.exports = errorHandler;

connect()
    .use(router(require('./routes/user')))
    .use(router(require('./routes/blog'))) // 跳过
    .use(router(require('./routes/admin'))) // 跳过
    .use(errorHandler);  
```

如果负责用户路由的中间件引发了一个错误，则中间件 blog 和 admin 都会被跳过，
因为它们不是错误处理中间件（只有三个参数）。然后 Connect 看到接受错误参数的 errorHandler，就会调用它。

