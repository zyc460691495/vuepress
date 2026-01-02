---
title: Promise
date: 2025-12-29
author: zyc
---

### 什么是Promise?

Promise 是一个"承诺"，表示将来某个时间点会返回一个结果（可能是成功的结果，也可能是失败的原因）。

Promise 有三种状态：

- pending：初始状态，既不是成功，也不是失败状态
- fulfilled：意味着操作成功完成
- rejected：意味着操作失败

```js
const myPromise = new Promise((resolve, reject) => {
    // 异步操作代码

    if (/* 操作成功 */) {
        resolve('成功的结果'); // 将 Promise 状态改为 fulfilled
    } else {
        reject('失败的原因'); // 将 Promise 状态改为 rejected
    }
});
```

### 如何使用Promise?

#### then方法

`then()` 方法用于指定 Promise 状态变为 fulfilled 或 rejected 时的回调函数。

```js
// promise.then(
//     onFulfilled,  // 成功时的回调（可选）
//     onRejected    // 失败时的回调（可选）
// );
myPromise.then(
    (result) => {
        // 处理成功情况
        console.log('成功:', result);
    },
    (error) => {
        // 处理失败情况
        console.error('失败:', error);
    }
);
```

#### 链式调用

```js
const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(10), 1000);
});

// 如果 then 的回调返回一个值，它会被自动包装成 Promise
promise
    .then(result => {
        console.log(result);  // 10
        return result * 2;    // 传递给下一个 then
    })
    .then(result => {
        console.log(result);  // 20
        return result + 5;
    })
    .then(result => {
        console.log(result);  // 25
    });
```

#### 异常处理

```js
// 方式1：then的第二个参数
promise.then(
    result => console.log('成功:', result),
    error => console.error('失败:', error)  // 仅捕获当前promise的错误
);

// 方式2：catch方法（更常用）
promise
    .then(result => console.log('成功:', result))
    .catch(error => console.error('失败:', error));  // 捕获链中所有错误
```

```js
myPromise
    .then((result) => {
        console.log('成功:', result);
    })
    .catch((error) => {
        console.error('失败:', error);
    })
    .finally(() => {
        console.log('操作完成');
    });
```


















