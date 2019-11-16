---
title: "细说 Javascript 中的 Event Loop"
subtitle: "What the heck is the event loop anyway?"
date: 2019-11-01 19:51:32
tags:
  - Javascript
  - Eventloop
---

# 细说 Javascript 中的 Event Loop

即使经过一段时间的学习我依旧对 Javascript 是如何运行的感到费解，相信 JSer 都有所感触为什么会这样运行。我听说过 V8 引擎是 Chrome 中运行 Javascript 的运行环境，但并不知道它究竟做了什么。我知道 Javascript 是单线程的，因为我还在使用回调函数。如果你在 Google 搜索 javascript 会得到它是一个单线程（因为 Service Worker、Web Worker 的存在严格来说不是）、非阻塞、异步、解释型脚本语言的解释，对于初学者而言 Javascript 总是执行的很诡异，经过相当长时间的摸索，自认为稍许 get 到它了。

让我们看下 Javascript 的运行环境，比如说 V8 Chrome 的 Javascript 运行时，下图是一个 Javascript 运行时的示意图，堆记录内存的分配，栈记录回调函数的栈帧，但是如果你 clone V8 的源码会发现 setTimeout, DOM, HTTP 请求这些并不在其中，这令我很吃惊，因为当你想要异步编程的时候，这是你首先要考虑使用的东西，但是现在我知道了这才是最重要的部分。
![](/images/2019-11-05-What-the-heck-is-the-event-loop-anyway/javascript-runtime.png)

首先是 V8 运行时，然后是浏览器提供的 Web APIs 诸如 DOM, AJAX, setTimeout 然后才是令人困惑的事件循环 (Eventloop) 和回调队列 (call stack)，这些术语你一定都听过，但可能未必理解他们是如何成为一个整体的。
我先介绍下这些术语，也许有些人会厌烦可以跳过此段。总的来说 Javascript 是单线程的，他只有一个调用栈，每次只能做一件事 one thread == one call stack == one thing at a time，我们先从一个简单的示例开始，我们有几个函数，一个将两个函数相乘的 `multiply`，一个调用前者的平方函数 `square`，还有一个打印函数 `printSquare` 它调用 `square` 然后打印结果。如果我们运行它，`call stack` 基本是一个记录当前程序所在位置的数据结构，如果我们进入某个函数它会被放在 stack 里，如果它离开这个函数就会被弹出 stack，这也 stack 的定义，如果你运行这个文件会有个一个主函数 `main` 指代这个文件自身，它被首先放入栈中，然后我们有一些函数的定义声明，然后是 `printSquare(4)` 它是一个函数调用，然后我们把它放入 stack，然后是 `square(n)`，`multiply(n ,n)`，然后我们得到返回 `multiply(n ,n)` 弹出，`square(n)` 弹出，调用 `console.log(squared)` 入栈紧接着弹出，`printSquare(4)` 弹出，然后就执行完成了。

```javascript
function multiply(a, b) {
    return a * b;
}
function square(n) {
    return multiply(n, n);
}
function printSquare(n) {
    var squared = square(n);

    console.log(squared);
}
printSquare(4);
```
![](/images/2019-11-05-What-the-heck-is-the-event-loop-anyway/call-stack.png)

在 Web 开发中你肯定遇到过类似的情况， foo 函数抛出一个异常，将整个调用栈都打印出来。
```javascript
function foo() {
    throw new Error('something went wrong');
}
function bar () {
    foo();
}
function baz () {
    bar();
}
baz();
```
![](/images/2019-11-05-What-the-heck-is-the-event-loop-anyway/chrome-error.png)

同时这也会造成内存泄漏，例如下方的示例然后你会得到 chrome 的报错 `Uncaught RangeError: Maximum call stack size exceeded` 。
```javascript
function foo () {
    foo();
}
foo();
```

## Blocking

复杂的计算、发送网络请求、下载图片这些表现的很慢的操作都会阻塞主线程，因为这些都是同步的函数而 Javascript 是单线程的，每次执行网络请求都会等待返回结果，整个线程被阻塞了因而对于用户而言感觉是页面卡住了。这对于用户体验是相当不友好的，我们希望用户能够流畅的使用界面，因此为了解决同步的问题我们使用异步回调函数 (asynchronous callbacks)。
```javascript
function getSync (url) {
    console.log(url);
    // get something synchronized
}
var a = getSync('//a.com');
var b = getSync('//b.com');
var c = getSync('//c.com');

console.log(a);
console.log(b);
console.log(c);
```

### Asynchronous callbacks

当然如果你使用过 Javascript 会对它很熟悉它，当然这也会造成代码难以维护的问题，ES6, ES7 的出现， Promise, async, await 使我们能更加优雅的处理异步函数。对于异步调用的函数，会先往后执行然后神奇的在需要它执行的时候进入了栈里。

## Event Loop

```javascript
console.log('1');
setTimeout(function () {
    console.log('2');
}, 5000);
console.log('3');
```

上述代码会按顺序入栈，而 `setTimeout` 由 Web APIs 提供，因此现在打印出 `13`，然后 Web APIs 会将 `setTimeout` 的回调函数推入 task queue，而 event loop 负责在栈空的时候检查 task queue 并执行队列，因此最后打印出 `132`，这也是你会看到出现 `setTimeout(foo, 0)`，因为 event loop 的存在最后还是会打印出 `132`。
这同样会造成下面的示例，也许你期待每隔五秒就打印一次，但是结果却是 5 秒后都打印出来，因为他们一进栈就出栈了，五秒后 Web APIs 将他们放到 task queue，event loop 将他们放入栈执行，所以结果是三次连续的打印。

```javascript
setTimeout(function() {
    console.log('1');
}, 5000);
setTimeout(function() {
    console.log('1');
}, 5000);
setTimeout(function() {
    console.log('1');
}, 5000);
```

## Render

接下来我想谈谈 Render，大多数屏幕的刷新率是 60Hz，这也是一个能让人感受到流程动画的帧率，因此浏览器会已 1/60s = 16.7ms 的频率渲染画面，这里我们暂时不谈论 Repaint 和 Reflow，我们之前说过 Javascript 是单线程的，所以当 call stack 不为空的时候浏览器是没法执行渲染的，如果你的页面上有一个连续执行的动画，就会发现卡顿的存在，因为有超过 16.7ms call stack 都不是空的，页面的刷新率下降了，对于用户而言就是变卡顿了。

```javascript
[1, 2, 3, 4].forEach(function (i) {
    console.log(i);
});
function asyncForEach(array, cb) {
    array.forEach(function () {
        setTimeout(cb, 0);
    });
}
asyncForEach([1, 2, 3, 4], function (i) {
    console.log(i);
});
```

上述示例中，第一种方法会阻塞，因为整个函数入栈然后 `console.log(i);` 入栈出栈知道循环结束，这时 call stack 不是空的，页面就像卡住了一样，而第二种会在 Web APIs 吐给 task queue 时由 event loop 放入 call stack 中，因此每次执行都会有个间隔留个页面渲染，当然这个示例可能不明显，当执行的函数花费时间较多时你能明显感知到其中的区别。
