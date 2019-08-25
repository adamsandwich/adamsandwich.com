---
layout: post
title: "初识 Service Workers 和缓存策略"
date: 2019-08-20 21:20:07 +0800
tags: Javascript
comments: true
toc: true
---

## 初识
如果你从事前端开发一定对 Service Workers 有所耳闻。简单来说，它就是一个能在后台运行的与网页或者说 DOM 没有关联的脚本并且能提供开箱即用的功能。列如网络请求代理、推送通知和后台同步。Service Workers 能够确保用户能有丰富的离线体验。  
你可以很容易想象出 Service Worker 就像一个处于客户端和服务端的人——中间人，将所有请求传递给服务端。当所有请求都通过 Service Worker 时他将有能力拦截请求。  

![](/assets/img/2019-08-20-understanding-service-workers-and-caching-strategies/service-worker-as-the-middle-man.png)

Service Workers 可以说很像 Javascript 只是没有与 DOM 交互的能力。他们运行在不同的线程上，可以通过 `postMessage` API 访问 DOM 。如果你打算构建渐进式 Web 应用 (PWA) 事先理解 Service Workers 和缓存策略是非常重要的。  

> Service Workers 不是 Web Workers 。Web Workers 是运行再不同线程上用于执行密集型计算防止阻塞主线程的事件循环因此不会导致 UI 绘制缓慢。

## 注册 Service Worker
为了在网站上使用 Service Worker 我们必须在 Javascript 中注册 Service Worker 。  
```javascript
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log(`Service Worker 注册成功 ${registration}`);
        }, error => {
            console.error(`Service Worker 注册失败 ${error}`);
        });
    });
}
```
在上方的代码中我们首先检查 Service Worker API 是否支持。如果支持我们将使用 Service Worker 文件的路径作为参数使用 register 方法。因而当页面加载完毕时 Service Worker 已完成注册。

## Service Worker 的生命周期
![The life cycle of service worker](/assets/img/2019-08-20-understanding-service-workers-and-caching-strategies/the-life-cycle-of-service-worker.png)

### Install
当 Service Worker 注册后一个 `instll` 事件被触发。我们能在 `sw.js` 文件中监听这个事件。在开始编码之前让我们先想想应该在这个事件中做什么。

- 设置我们的缓存
- 将所有静态资源加入缓存

`event.waitUntil` 方法接受一个 `Promise` 通过它了解安装花费的时间和何时成功与否。任何一个文件没有被缓存则 Service Worker 不会被安装。确保没有大量的 URL 列表需要被缓存时非常重要的，因为任何一个 URL 缓存失败都会使整个 Service Worker 的安装停滞。  
```javascript
const CACHE_NAME = 'adamsandwich.com-cache-V1';
const URLS_To_CACHE = [
    '/main.css',
    '/main.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open()
            .then(cache => {
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});
```

### Activate
当一个新的 Service Worker 被安装之前的版本就不会被使用，新的 Service Worker 激活时我们就获得了一个 `activate` 事件，在这个事件中我们能移去或删除现有缓存。  
```javascript
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames => {
                return Promise.all(
                    cacheNames.filter((cacheName => {
                        // 如果需要移去缓存返回 true ，但缓存会在源对象中共享
                    }).map(cacheName => {
                        return caches.delete(cacheName);
                    }))
                )
            }))
    );
});
```

### Idle
此阶段不会介绍过多，在 `activate` 阶段之后 Service Worker 将保持空闲不做任何事直到有其它事件被触发。

### Fetch
每当 fetch 请求时，一个 `fetch` 事件就被触发。在这个事件中我们尝试去实现缓存策略。正如之前所说 Service Worker 作为一个中间人所有的请求都要通过它。从这开始我们能决定是否请求到网络或者缓存。下方例子说明当一个请求被 Service Worker 拦截，如果向缓存发出请求而缓存未返回有效响应，则向网络发出请求。  
下方的代码时缓存策略的一种。后续将深入缓存策略。  
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) return response;
                return fetch(event.request);
            })
    );
});
```

## 缓存策略

在 fetch 事件中我们讨论了一种叫 `优先缓存，网络备用` 的缓存策略，另一件需要记住的事是缓存策略需要在 fetch 事件中实现。

### 仅缓存
最简单的一种策略，如其名所有的请求都通过缓存。  
使用场景：当仅想访问静态资源时。  
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
    );
});
```

### 仅网络
当客户端发起请求时，Service Worker 拦截它然后向网络请求。脱裤子放屁！  
使用场景：当没有离线使用的场景，如分析 ping ，无 `GET` 请求。  
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(fetch(event.request));
});
```

### 缓存优先，网络备用
这是之前讨论过的策略，Service Worker 向缓存请求，如果请求没有成功则向网络发起请求。  
使用场景：当构建离线应用时。  
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});
```

### 网络优先，缓存备用
首先 Service Worker 向网络请求如果成功那最好不过否则向缓存请求。  
使用场景：当你构建经常变化的东西如论坛帖子。你的首要目的是最新的数据那此策略最优。  
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .catch(() => {
                caches.match(event.request);
            })
    );
});
```

### 泛用备用
当向网络和缓存的请求都失败的时候你展示一个备选的方案，这样用户就不会白屏或者奇怪的错误了。  
```javascript
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            }).catch(() => {
                return caches.match('/offline.html');
            })
    );
});
```
上述涵盖了构建 PWA 应用基础的几种缓存策略希望有所收获。

关联阅读:
> [https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
> [https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/](https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/)
