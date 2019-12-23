
# 浏览器💔

## ☕事件机制

### 事件流(事件传播)

- 捕获阶段(capture phase)：`window`往事件触发处传播，遇到注册的捕获事件触发
- 目标阶段(target phase)：传播到引发事件的嵌套最深的元素`event.target`
- 冒泡阶段(bubbling phase)：`target`往`window`传播，遇到注册的冒泡事件触发

### 注册事件

`target.addEventListener(type, listener[, options|useCapture])`

- `options`：`object`，指定有关 listener 属性的可选参数对象
  - capture：`Boolean`，决定注册事件是捕获事件还是冒泡事件
  - once：`Boolean`，表示 listener 在添加之后最多只调用一次
  - passive：`Boolean`，设置为true时表示 listener 永远不会调用 preventDefault()。调用了客户端将会忽略它并抛出一个控制台警告
- `useCapture`：`Boolean`，决定了注册的事件是捕获事件还是冒泡事件

### 事件委托

- 定义：利用冒泡的原理把原本需绑定在子元素的响应事件委托给父类元素，触发执行效果
- 作用：许多相似的元素在其共同的祖先上面添加一个处理器；单个处理器作为许多不同事件的入口点
- 特点：
  - 省内存，效率高，减少事件注册
  - 新增子对象时无需再次对其绑定事件，适合动态添加元素
  - `focus、blur`之类事件无法委托，`mousemove、mouseout`不适合事件委托

## 🐊跨域

### 什么是跨域

- 什么是同源策略

> 同源策略是一种用于隔离潜在恶意文件的重要安全机制。同源指"协议+域名+端口"三者相同，即便两不同域名指向同一`IP`地址，也非同源
>
> ![avatar](https://user-gold-cdn.xitu.io/2018/5/23/1638b3579d9eeb32?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 同源策略限制内容(img、link、script等标签允许跨域)
  - `Cookie、LocalStorage、IndexedDB`等存储性内容
  - `DOM`节点
  - `AJAX`请求发送后，结果被浏览器拦截

——当协议、子域名、主域名、端口号中任意一个不相同时，都算作不同域。不同域之间相互请求资源，就算作"跨域"

### 跨域解决方案

#### JSONP

- 原理：利用`<script>`标签无跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。
- 特点：
  - 仅支持get方法，不安全可能会遭受XSS攻击
  - JSONP和AJAX均为客户端发送请求，从服务器端获取数据。但AJAX属于同源策略，JSONP属于跨域请求

#### CORS（Cross-Origin Resource Sharing）

- 原理：浏览器向服务器发出`Fetch/XHR`请求，服务器使用额外的HTTP头部告诉浏览器让web应用进行跨域资源请求
- 特点：
  - CORS要求服务端设置一些头部字段，最重要的就是 `Access-Control-Allow-Origin`
  - 生产环境中建议用成熟的开源中间件：如前端使用`axios`进行 `http`传输，后端以`koa`作为服务端框架，可使用CORS中间件 `koa2-cors`

#### Nginx

>反向代理：代理后端服务器响应客户端请求的一个中介服务器，代理的对象是服务器

- 原理：反向代理，即所有客户端的请求都必须先经过nginx的处理，nginx作为代理服务器再将请求转发给node或者java服务，规避了同源策略
- 特点：
  - 保护和隐藏原始资源服务器
  - 负载均衡

#### Websocket

特点：
>WebSocket：是一种网络传输协议，浏览器和服务器只需要完成一次握手，两者之间就可以创建持久性的链接，并进行双向数据传输。

- WebSocket复用了HTTP的握手通道：客户端通过HTTP请求与WebSocket服务端协商升级协议。协议升级完成之后，后续的数据交换则遵照WebSocket的协议
- 数据传递：基于数据帧的传递
- 封装好的接口：`socket.io`

## ➰Event Loop

### 浏览器渲染进程（浏览器内核）

- `GUI渲染线程`：负责渲染浏览器界面，解析 HTML、CSS、构建 DOM 树和 RenderObject 树，布局和绘制等。可用于重绘（Repaint）、重排（Reflow）
- `JS引擎线程`：js 内核，负责处理 javascript 脚本程序（V8 引擎）
- `事件触发线程`：用来控制事件循环，当对应的事件符合触发条件被触发时，事件线程会把事件添加到待处理事件队列的队尾，等待 js 引擎的处理
- `定时触发器线程`：负责执行异步定时器一类的函数的线程，如： setTimeout，setInterval
  - 主线程依次执行代码时，遇到定时器，会将定时器交给该线程处理，当计数完毕后，事件触发线程会将计数完毕后的事件加入到任务队列的尾部，等待 JS 引擎线程执行
- `异步http请求线程`：负责执行异步请求类函数的线程，如： Promise，axios，ajax
  - 主线程依次执行代码时，遇到异步请求，会将函数交给该线程处理，当监听到状态码变更，如果有回调函数，事件触发线程会将回调函数加入到任务队列的尾部，等待 JS 引擎线程执行。

注意：GUI 渲染线程和 JS 引擎线程是互斥的，后者执行时前者会被挂起；JS 执行时间过长，会造成页面渲染不连贯，导致页面渲染加载阻塞

### `Event Loop`机制

- 定义：事件循环，是指浏览器或`Node`的一种解决`js`单线程运行时不会阻塞的一种机制，可以理解为实现`异步`的一种方式。

> - 主线程(`main thread`)：JS 引擎线程，主线程的执行过程是一个 tick
> - 执行栈(`execution stack`)：同步任务在主线程上运行，会形成一个执行栈
> - 任务队列(`task queue`)：由`事件触发线程`管理，含宏任务/微任务队列
>   - 异步任务触发时，将异步线程(如`定时触发器线程`、`异步http请求线程`)提供的回调事件，缓存到任务队列中
>   - 异步任务执行时（即主线程空闲时，同步任务执行完毕），将任务队列中的异步任务回调事件，提供给主线程读取，执行栈执行
> - 宏任务：macrotask，也叫 tasks。
>   - script（主代码块）
>   - setTimeout、setInterval、setImmediate、MessageChannel
>   - requestAnimationFrame(rAF)、UI Rendering、I/O
> - 微任务：microtask，也叫 jobs。当前宏任务执行后立即执行(渲染前)的任务
>   - Promise.then(Async/await)、MutationObserver(监听 DOM 修改事件)
>   - Process.nextTick（Node 独有，优先级高于Promise.then)

- 一次 Event loop 顺序
  - 执行同步代码`main script`(宏任务)=>执行栈为空，查询是否有微任务需要执行=>执行所有微任务
  - 必要的话渲染 UI=>开始下一轮 Event loop，执行宏任务中的异步代码

## 🔮存储

### cookie

>cookie：直接保存在浏览器上的小数据串，`HTTP`协议的一部分，基于域名。大多数情况`cookies`是由 web 服务器设置，并自动添加到相同域名下的每次请求中。主要用来保存登陆信息，保存用户登录状态

- 访问`cookies`：使用`document.cookie`属性，name/value 必须编码
- `cookies`选项：列在 key=value 后面，使用`;`间隔
  - `path=/mypath`：可访问到 cookie 的 url 路径前缀。必须是绝对路径
  - `domain=site.com`：默认 cookie 仅在当前域名下可见，如果明确设置了域名，可以让 cookie 在子域名下也可见
  - `expires, max-age`：设置 cookie 过期时间，若没有设置，则当浏览器关闭时 cookie 就失效了(session cookies)
  - `secure`：使 cookie 仅在 HTTPS 下有效
  - `samesite`：如果请求来自外部网站，禁止浏览器发送 cookie，这样有助于防止 CSRF 攻击
  - `httpOnly`：禁止任何 JavaScript 操作访问 cookie。我们使用 document.cookie 不能看到或操作 cookie
- 数据存储大小：一个 cookie 最大 4kb，每个网站最多 20+ 个 cookies（取决于浏览器）

### localStorage、sessionStorage

> web storage：HTML5中专门为浏览器存储而提供的数据存储机制，不与服务端发生通信。localStorage 和 sessionStorage 允许我们在浏览器上保存键值对
>
> - **所有的 key 和 value 都必须是字符串**
> - 数据绑定在同源下，不会随着每次请求发送到服务端。允许保存至少 2M 字节的数据，取决于浏览器也会有所不同

- localStorage
  - 同源的数据在所有浏览器标签页和窗口之间共享
  - 数据不会过期。浏览器重启甚至系统重启后仍然保留
  
- sessionStorage
  - 数据只存在于当前浏览器标签页
  - 数据在页面刷新后仍保留。关闭重新打开浏览器标签页后不会被保留
- API（两个存储对象都提供相同的方法和属性）
  - setItem(key, value) – 存储键值对
  - getItem(key) – 根据键名获取值
  - removeItem(key) – 删除单个数据
  - clear() – 删除所有数据
  - key(index) – 获取该索引下的键名
  - length – 存储数据的长度
  - 使用 Object.keys 获取所有的键
  - 注意：使用对象属性的形式来访问键，则 storage 事件不会被触发
- Storage 事件：
  - 在调用 setItem，removeItem，clear方法后触发
  - 所有能访问到存储对象的 window 对象上都会被触发
  - event.storageArea 会返回数据发生改变的存储对象

### IndexedDB

>定义：一个简单的键值对数据库，用于客户端存储大量结构化数据(包括文件和blobs)。它不仅可以存储字符串，还可以存储二进制数据。提供查找接口，还能建立索引，可看作运行在浏览器上的非关系型数据库

- 键值对存储：IndexedDB 内部采用对象仓库（object store）存放数据
- 异步：IndexedDB 操作时不会锁死浏览器，用户依然可进行其他操作(LocalStorage的操作是同步的)。异步设计是为防止大量数据的读写，拖慢网页
- 同源限制：每一个数据库对应创建它的域名，网页只能访问自身域名下的数据库

### Service worker

>Service worker：浏览器在后台独立于网页运行的、用JavaScript编写的脚本。本质上充当 Web 应用程序、浏览器、网络（可用时）间的代理服务器。

- 作用：
  - 实现离线应用
  - 数据 mock：与 Fetch 搭配，可以从浏览器层面拦截请求
  - 用于缓存静态资源：利用`CacheStorage API`来缓存js、css、字体、图片等
  - 实现消息的主动推送。与 Push 和 Notification 搭配
- 特点：
  - 独立于JavaScript主线程，不能直接访问DOM，window对象，可访问navigator对象，也可通过消息传递的方式（postMessage）与JavaScript主线程进行通信
  - 一个网络代理，可以控制Web页面的所有网络请求
  - 具有自身的生命周期
  - 只能由HTTPS承载
  - 设计为完全异步，大量使用Promise，同步API不能在service worker中使用

从整体上来说，应用获取一个资源的缓存类型分为`Service Worker`、`Memory Cache`、`Disk Cache`和`No Cache`。资源查找顺序为从左向右，找到资源则返回，未找到则继续寻找，直至最终获取资源。

![avatar](https://user-gold-cdn.xitu.io/2019/3/1/1693680282da5543?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 🖌渲染机制

### 浏览器渲染引擎工作流程

创建 DOM 树 —> 创建 CSSOM 树 -> 合并为 Render 树 —> 布局 Layout -—>调用 GPU 绘制 Painting

- 构建 DOM 树：用 HTML 解析器，解析 HTML 元素，构建一棵 DOM 树；
- 解析样式表构建 CSSOM 树：用 CSS 解析器，解析 CSS 文件和元素上的 inline 样式
- 构建 Render 树：将 DOM 树和样式表关联起来（Attachment），每个 DOM 节点都有 attach 方法，接受样式信息，返回一个 render 对象（aka renderer），这些 render 对象最终会被构建成一棵 Render 树
- 布局（确定节点坐标）：根据 Render 树结构，为每个 Render 树上的节点确定一个在显示屏上出现的精确坐标
- 绘制页面：根据 Render 树和节点显示坐标，调用每个节点的 paint 方法，调用 GPU 绘制，合成图层

![avatar](https://user-gold-cdn.xitu.io/2018/12/10/16798b8db54caa31?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### Load 和 DOMContentLoaded 区别

- Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕
- DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载

### 图层

> 特定的属性可以生成一个新的图层。不同的图层渲染互不影响。对于某些频繁渲染的节点建议单独生成一个新图层，提高性能。但不能生成过多图层。

通过以下几个常用属性可以生成新图层：

- translate3d、translateZ：3D 变换
- will-change
- video、iframe标签
- 通过动画实现的 opacity 动画转换
- position: fixed

### 重绘和回流

> - 重绘(repaint)：由于节点的几何属性发生改变或者由于样式发生改变而不会影响布局的，称为重绘。
> - 回流(reflow)：布局或者几何属性需要改变，表现为重新生成布局，重新排列元素。
> - 回流一定会触发重绘，而重绘不一定会引发回流

#### 减少重绘和回流

- CSS
  - 使用 transform 替代 top
  - 使用 visibility 替换 display: none
  - 避免使用table布局，可能很小的一个小改动会造成整个 table 的重新布局
  - 避免CSS选择符层级太多。CSS 选择符从右往左匹配查找，尽量平级类名
  - 为频繁重绘或者回流的节点设置图层：阻止该节点的渲染行为影响别的节点
    - iframe、video 等节点自动变为图层
    - 通过 3d 动画触发：transform: translate3d(0, 0, 0)
    - 提前通知浏览器元素变化：css中的will-change 属性
    - 将动画效果应用到position属性为absolute或fixed的元素。控制动画速度选择 `requestAnimationFrame`
- JS
  - 避免逐项更改样式。一次性更改style属性，或者直接定义class属性
  - 避免频繁操作DOM。选择在`documentFragment`上操作，然后再插入document中
  - 避免循环读取`offsetWidth`等属性。循环外存取  
