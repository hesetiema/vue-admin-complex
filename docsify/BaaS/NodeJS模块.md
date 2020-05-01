# NodeJS 模块

> node server.js 可替换为 nodemon server.js 支持热更新

## 一、模块机制

> 采用了 Commonjs 规范，通过 module.exports、require 来导出和引入一个模块

### 1、模块的分类

- 系统模块
  - c/c++模块：内建模块，用于 native 模块调用
  - native 模块：如 http、fs、buffer 等，底层调用的内建模块
- 第三方模块
  - 路径形式的文件模块（以 `.`、`..`、`/`开头的）
  - 自定义的模块（比如 express、koa 框架、moment.js 等）

### 2、模块加载机制

- 加载步骤：路径分析、文件定位、编译执行
- 加载顺序：系统缓存 ->系统模块 ->文件模块 ->目录 ->node_modules 根目录
- 模块缓存地址：require.cache API 查看已缓存的模块，返回值为对象

### 3、对象引用关系

- module.exports 与 exports 的区别：exports 相当于 module.exports 的引用
  - `const exports = modules.exports;`
  - 如果要对外暴露属性或方法，就用 exports
  - 要暴露对象(类似 class，含很多属性和方法)，就用 module.exports

## 二、事件触发器

> EventEmitter 类由 events 模块定义，本质是观察者模式的实现，类似发布/订阅

### 1、事件驱动

- 所有的异步 I/O 操作在完成时都会发送一个事件到事件队列
- 使用回调函数监听一个事件，on 表示注册事件监听函数，emit 表示触发监听函数

```javascript
const EventEmitter = require("events").EventEmitter;
const emitter = new EventEmitter();

emitter.on("起床", function (time) {
  console.log(`早上 ${time} 开始起床，新的一天加油！`);
});

emitter.emit("起床", "6:00");
```

### 2、基于 EventEmitter 自定义类

```javascript
//继承于 EventEmitter
const EventEmitter = require("events");
const oneDayPlanRun = {
  "6:00": function () {
    console.log(`现在是早上 6:00，起床，开始新的一天加油！`);
  },
  "7:00": function () {
    console.log(`现在是早上 7:00，吃早饭！`);
  },
};

function OneDayPlan() {
  EventEmitter.call(this);
}

Object.setPrototypeOf(OneDayPlan.prototype, EventEmitter.prototype);
Object.setPrototypeOf(OneDayPlan, EventEmitter);
//实例化类，实现事件的触发、监听
const oneDayPlan = new OneDayPlan();

oneDayPlan.on("6:00", function () {
  oneDayPlanRun["6:00"]();
});

oneDayPlan.on("7:00", function () {
  oneDayPlanRun["7:00"]();
});

async function doMain() {
  oneDayPlan.emit("6:00");

  await sleep(2000); // 间隔 2 秒钟输出

  oneDayPlan.emit("7:00");
}

doMain();

async function sleep(s) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(1);
    }, s);
  });
}
```

### 3、解决高并发下缓存雪崩问题——once() 方法

> 当触发多次相同名称事件，通过 once 添加的侦听器只会执行一次，并且在执行之后会接触与它关联的事件，相当于 on 方法和 removeListener 方法的组合

- once 方法接收到信息之后使用 on 方法监听，在 onceWrapper 方法中通过 removeListener 删掉监听函数自身

### 4、同步与异步

- EventEmitter 会按照监听器注册的顺序**同步**地调用所有监听器。 所以必须确保事件的排序正确，且避免竞态条件
- 异步模式：使用 `setImmediate()` 或 `process.nextTick()` 切换

```javascript
const events = require("events");
const emitter = new events.EventEmitter();

emitter.on("test", function () {
  setImmediate(() => {
    console.log(111);
  });
});
emitter.emit("test");
console.log(222); //输出：222 111
```

### 5、错误处理

应该始终为 'error' 事件注册监听器

```javascript
const events = require("events");
const emitter = new events.EventEmitter();

emitter.on("error", function (err) {
  console.error(err);
});

emitter.emit("error", new Error("This is a error"));

console.log("test");
```

## 三、加解密模块 Crypto

### 1、cipher 对称密钥加密

- AES/ECB/PKCS5Padding：代表算法/模式/填充量
- 使用`openssl list-cipher-algorithms` 可以查看系统所支持的算法
- 数据加密
  - `crypto.createCipheriv(algorithm, pwd, iv)`指定算法、密码、向量，创建加密对象`cipher`

```javascript
function cipher(str) {
  try {
    const crypto = require("crypto");
    const cipher = crypto.createCipheriv("des-ecb", "12345678", "");

    /**
     * update方法
     * 第一个参数代表加密的数据
     * 第二参数代表传入数据的格式，可以是'utf8', 'ascii', 'latin1'
     * 第三个参数代表加密数据的输出格式，可以是'latin1'， 'base64' 或者 'hex'
     * 没有执行则返回Buffer
     */
    let encrypted = cipher.update(str, "utf8", "hex");
    /**
     * final方法，返回任何加密的内容
     * 参数可以是'latin1', 'base64' 或者 'hex'，没有指定返回Buffer
     */
    encrypted += cipher.final("hex");

    return encrypted;
  } catch (e) {
    console.log("加密失败");

    return e.message || e;
  }
}

cipher("hello,world"); //ffdba47df8b1e3835d82e3681c83bb77
```

- 数据解密

```javascript
function decipher(encrypted) {
  try {
    const crypto = require("crypto");
    const decipher = crypto.createDecipheriv("des-ecb", "12345678", "");
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (e) {
    console.log("解密失败");
    return e.message || e;
  }
}

decipher("ffdba47df8b1e3835d82e3681c83bb77"); //'hello,world'
```

### 2、MD5 加密

> 把一个任意长度的字节串变换成一定长度的十六进制数字串（32 个字符） 一致性验证，过程不可逆

- 创建返回 hash 对象：`crypto.createHash(algorithm)`，算法为`sha1、md5、sha256、sha512`等
- 更改`hash`内容为指定数据：`hash.update(data)`
- 计算所有传入数据的 hash 摘要(digest)：`hash.digest(encoding='binary')`
  - `encodeing`编码方式可选 `hex`、`binary`、`base64`

```javascript
const crypto = require("crypto");
const md5 = (str) => {
  return crypto.createHash("md5").update(str, "utf8").digest("hex");
};
console.log(md5("123456789")); //默认输出32位小写字母
```

## 四、Buffer 缓冲区模块

### 1、Buffer 初识

- 流的概念：Stream 是对输入输出设备的抽象，这里的设备可以是文件、网络、内存等。数据是从一端流(stream)向另一端
  - 流类型
    - Readable - 可读操作
    - Writable - 可写操作
    - Duplex - 可读可写操作
    - Transform - 操作被写入数据，然后读出结果
  - 常用 Stream 对象，事件
    - data - 当有数据可读时触发
    - end - 没有更多的数据可读时触发。
    - error - 在接收和写入过程中发生错误时触发。
    - finish - 所有数据已被写入到底层系统时触发。
- Buffer 概念：数据到达的速度比进程消耗的速度慢，那么早先到达的数据需要等待一定量的数据到达之后才能被处理。等待区就指的缓冲区（Buffer），它是计算机中的一个小物理单位，通常位于计算机的 RAM
- Buffer 作用及特点
  - Buffer 用于读取或操作二进制数据流
  - Buffer 在创建时大小已被确定且是无法调整的，内存分配由 C++ 层面提供

### 2、Buffer 基本使用

> 在一些 Web 应用中，对于静态数据可以预先转为 Buffer 进行传输，可以有效减少 CPU 的重复使用（重复的字符串转 Buffer 操作）

#### 2.1 创建 Buffer

- Buffer.from(string[, encoding])： 返回一个被 string 值初始化的新的 Buffer 实例
- Buffer.from(array)： 返回一个被 array 值初始化的新的 Buffer 实例（元素只能是数字，不然就会自动被 0 覆盖）
- Buffer.from(buffer)： 复制传入的 Buffer 实例的数据，返回一个新的 Buffer 实例
- Buffer.alloc(size)：返回一个大小为 size 字节的已初始化的 Buffer 实例，不含旧数据
- Buffer.allocUnsafe(size)：创建一个大小为 size 字节的新的未初始化的 Buffer

#### 2.2 Buffer 字符编码：实现 Buffer 实例与 JavaScript 字符串之间的相互转换

- 'ascii'——仅适用于 7 位 ASCII 数据
- 'utf8' ——多字节编码的 Unicode 字符
- 'utf16le' —— 同'ucs2'， 2 或 4 个字节的小端序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）。
- 'base64' —— Base64 编码。当从字符串创建 Buffer 时，此编码也会正确地接受 RFC 4648 第 5 节中指定的 “URL 和文件名安全字母”。
- 'latin1' —— 同'binary'，一种将 Buffer 编码成单字节编码字符串的方法
- 'hex' —— 将每个字节编码成两个十六进制的字符

```javascript
//字符串转换为 Buffer 类型
//一个中文在 UTF-8 下占用 3 个字节
const buf = Buffer.from("Node.js 技术", "UTF-8");
console.log(buf); //<Buffer 4e 6f 64 65 2e 6a 73 20 e6 8a 80 e6 9c af>
console.log(buf.length); // 14

//Buffer 类型转换为字符串
//解码缓冲区数据并使用指定的编码返回字符串
console.log(buf.toString("UTF-8", 0, 11)); //Node.js 技
```

### 3、Buffer 内存机制

> 采用 slab 机制进行预先申请、事后分配。内存分配是在 C++ 层面完成，内存管理在 JavaScript 层面

- 初次加载时就会初始化 1 个 8KB 的内存空间
- 根据申请的内存大小分为 小 Buffer 对象 和 大 Buffer 对象
- 小 Buffer 情况，会继续判断这个 slab 空间是否足够
  - 如果空间足够就去使用剩余空间同时更新 slab 分配状态，偏移量会增加
  - 如果空间不足，slab 空间不足，就会去创建一个新的 slab 空间用来分配
- 大 Buffer 情况，则会直接走 createUnsafeBuffer(size) 函数

### 4、Buffer 应用场景

- I/O 操作： I/O 可以是文件或网络 I/O，流中将会自动创建 Buffer

```javascript
const fs = require("fs");

const inputStream = fs.createReadStream("input.txt"); // 创建可读流
const outputStream = fs.createWriteStream("output.txt"); // 创建可写流

inputStream.pipe(outputStream); // 管道读写
```

- 加解密：Buffer.alloc() 初始化一个实例，之后使用 fill 方法做填充
  - buf.fill(value[, offset[, end]][, encoding])
    - value: 第一个参数为要填充的内容
    - offset: 偏移量，填充的起始位置
    - end: 结束填充 buf 的偏移量
    - encoding: 编码集

```javascript
//Cipher 的对称加密
const crypto = require("crypto");
const [key, iv, algorithm, encoding, cipherEncoding] = [
  "a123456789",
  "",
  "aes-128-ecb",
  "utf8",
  "base64",
];

const handleKey = (key) => {
  const bytes = Buffer.alloc(16); // 初始化一个 Buffer 实例，每一项都用 00 填充
  console.log(bytes); // <Buffer 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
  bytes.fill(key, 0, 10); // 填充
  console.log(bytes); // <Buffer 61 31 32 33 34 35 36 37 38 39 00 00 00 00 00 00>

  return bytes;
};

let cipher = crypto.createCipheriv(algorithm, handleKey(key), iv);
let crypted = cipher.update("Node.js 技术栈", encoding, cipherEncoding);
crypted += cipher.final(cipherEncoding);

console.log(crypted); // jE0ODwuKN6iaKFKqd3RF4xFZkOpasy8WfIDl8tRC5t0=
```

### 5、与 cache 区别

- 缓冲（Buffer）是用于处理二进制流数据，将数据缓冲起来，它是临时性的，主要目的进行流量整形，把突发的大数量较小规模的 I/O 整理成平稳的小数量较大规模的 I/O，以**规整化每次读取数据的尺寸，减少响应次数**，如从网上下电影等
- 缓存（Cache）是为了弥补高速设备和低速设备的鸿沟而引入的中间层，最终起到**减少重复读取数据时的开销，加快访问速度**的作用

## 五、进程与线程

### 1、进程

> 进程（Process）是计算机中的程序关于某数据集合上的一次运行活动，是系统进行资源分配和调度的基本单位。进程是线程的容器

- 多进程就是进程的复制（fork），fork 出来的每个进程都拥有自己的独立空间地址、数据栈，一个进程无法访问另外一个进程里定义的变量、数据结构，只有建立了 IPC 通信，进程之间才可数据共享

```javascript
// process.js
const http = require("http");

http.createServer().listen(3000, () => {
  process.title = "测试进程 Node.js"; // 进程进行命名
  console.log(`process.pid: `, process.pid); // process.pid: 20279
});
```

### 2、线程

> 线程是操作系统能够进行运算调度的最小单位。一个线程只能隶属于一个进程，一个进程可以拥有多个线程

同一进程中的多条线程将共享该进程中的全部系统资源，如虚拟地址空间，文件描述符和信号处理等。但同一进程中的多个线程有各自的调用栈（call stack），自己的寄存器环境（register context），自己的线程本地存储（thread-local storage)

#### 2.1 单线程

- Node.js 虽然是单线程模型，但是其基于事件驱动、异步非阻塞模式，可以应用于高并发场景，避免了线程创建、线程之间上下文切换所产生的资源开销
- 特点：需要大量计算，CPU 耗时的操作，开发时候要注意

#### 2.2 多线程

- Java 就是多线程编程语言的一种，可有效避免代码阻塞导致的后续请求无法处理
- 特点
  - 有创建新的线程和执行期上下文线程的切换开销，每创建一个线程就会占用一定的内存，当应用程序并发大了之后，内存将会很快耗尽
  - 需要一定的计算会造成当前线程阻塞的，推荐使用多线程来处理

### 3、Nodejs 的进程和线程

> 在多核 CPU 系统之上，可以用过 child_process.fork 开启多个进程（Node.js 在 v0.8 版本之后新增了`Cluster`集群来实现多进程架构），即`多进程+单线程`模式

- **进程 Process：一个全局对象，无需 require 直接使用**
  - **process.env：环境变量，例如通过 process.env.NODE_ENV 获取不同环境项目配置信息**
  - process.nextTick：这个在谈及 Event Loop 时经常会提到
  - process.pid：获取当前进程 id
  - process.ppid：当前进程对应的父进程
  - process.cwd()：获取当前进程工作目录
  - process.platform：获取当前进程运行的操作系统平台
  - process.uptime()：当前进程已运行时间，例如：pm2 守护进程的 uptime 值
  - 进程事件：process.on('uncaughtException', cb) 捕获异常信息、process.on('exit', cb）进程推出监听
  - 三个标准流：process.stdout 标准输出、process.stdin 标准输入、process.stderr 标准错误输出
- **Javascript 是单线程，但是做为宿主环境的 Node.js 并非是单线程**，不适合复杂的、消耗 CPU 资源的任务，适合于 I/O 密集型的应用场景

#### 3.1 Nodejs 的进程创建

> child_process 内置模块，用于创建子进程

- child_process.spawn()：适用于返回大量数据，例如图像处理，二进制数据处理
- child_process.exec()：适用于小量数据，maxBuffer 默认值为 200 \* 1024 超出这个默认值将会导致程序崩溃，数据量过大可采用 spawn。
- child_process.execFile()：类似 child_process.exec()，区别是不能通过 shell 来执行，不支持像 I/O 重定向和文件查找这样的行为
- child_process.fork()： 衍生新的进程，进程之间是相互独立的，每个进程都有自己的 V8 实例、内存，系统资源是有限的，不建议衍生太多的子进程出来，通长根据系统 CPU 核心数设置
  - `const fork = require('child_process').fork;fork('./worker.js');`

#### 3.2 Nodejs 多进程架构模型

- 编写主进程

```javascript
// master.js
const fork = require("child_process").fork;
const cpus = require("os").cpus();

const server = require("net").createServer();
server.listen(3000); //创建一个 server 并监听 3000 端口
process.title = "node-master";

const workers = {};
const createWorker = () => {
  const worker = fork("worker.js");
  worker.on("message", function (message) {
    if (message.act === "suicide") {
      createWorker();
    }
  });
  worker.on("exit", function (code, signal) {
    console.log("worker process exited, code: %s signal: %s", code, signal);
    delete workers[worker.pid];
  });
  worker.send("server", server);
  //通过子进程对象的 send 方法发送消息到子进程进行通信
  workers[worker.pid] = worker;
  console.log(
    "worker process created, pid: %s ppid: %s",
    worker.pid,
    process.pid
  );
};
for (let i = 0; i < cpus.length; i++) {
  createWorker(); //根据系统 cpus 开启多个子进程
}
process.once("SIGINT", close.bind(this, "SIGINT")); // kill(2) Ctrl-C
process.once("SIGQUIT", close.bind(this, "SIGQUIT")); // kill(3) Ctrl-\
process.once("SIGTERM", close.bind(this, "SIGTERM")); // kill(15) default
process.once("exit", close.bind(this));

function close(code) {
  console.log("进程退出！", code);
  //在主进程中监听子进程的变化，如果是自杀信号重新启动一个工作进程
  if (code !== 0) {
    for (let pid in workers) {
      console.log("master process exited, kill worker pid: ", pid);
      workers[pid].kill("SIGINT");
    }
  }
  //主进程在监听到退出消息的时候，先退出子进程在退出主进程
  process.exit(0);
}
```

- 工作进程

```javascript
// worker.js
const http = require("http");
//创建一个 server 对象，注意这里最开始并没有监听 3000 端口
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/plan",
  });
  res.end("I am worker, pid: " + process.pid + ", ppid: " + process.ppid);
  throw new Error("worker process exception!"); // 测试异常进程退出、重建
});

let worker;
process.title = "node-worker";
//通过 message 事件接收主进程 send 方法发送的消息
process.on("message", function (message, sendHandle) {
  if (message === "server") {
    worker = sendHandle;
    worker.on("connection", function (socket) {
      server.emit("connection", socket);
    });
  }
});
//监听 uncaughtException 事件，捕获未处理的异常
//发送自杀信息由主进程重建进程，子进程在链接关闭之后退出
process.on("uncaughtException", function (err) {
  console.log(err);
  process.send({ act: "suicide" });
  worker.close(function () {
    process.exit(1);
  });
});
```

- 测试：控制台执行 node master.js 可以看到已成功创建了四个工作进程

```javascript
$ node master
worker process created, pid: 19280 ppid: 19279
worker process created, pid: 19281 ppid: 19279
worker process created, pid: 19282 ppid: 19279
worker process created, pid: 19283 ppid: 19279
```

#### 3.3 守护进程

> 守护进程是在后台运行不受终端控制的进程（如输入、输出等）。实际工作中对守护进程的健壮性要求还是很高的，例如：进程的异常监听、工作进程管理调度、进程挂掉之后重启等

- 创建步骤
  - 创建子进程
  - 在子进程中创建新会话（调用系统函数 setsid）
  - 改变子进程工作目录（如：“/” 或 “/usr/ 等）
  - 父进程终止
- 测试：\$ node index.js
  - 守护进程开启 父进程 pid: 47608, 守护进程 pid: 47609

```javascript
// index.js
const spawn = require("child_process").spawn;

function startDaemon() {
  const daemon = spawn("node", ["daemon.js"], {
    cwd: "/usr", //指定当前子进程工作目录若不做设置默认继承当前工作目录
    detached: true, //使子进程在父进程退出后继续运行(系统层调用setsid方法）
    stdio: "ignore", //运行 daemon.unref() 退出父进程
  });

  console.log(
    "守护进程开启 父进程 pid: %s, 守护进程 pid: %s",
    process.pid,
    daemon.pid
  );
  daemon.unref();
}

startDaemon();

// /usr/daemon.js
const fs = require("fs");
const { Console } = require("console");

// custom simple logger
const logger = new Console(
  fs.createWriteStream("./stdout.log"),
  fs.createWriteStream("./stderr.log")
);
//开启一个定时器每 10 秒执行一次，使该资源不会退出
//同时写入日志到子进程当前工作目录下
setInterval(function () {
  logger.log("daemon pid: ", process.pid, ", ppid: ", process.ppid);
}, 1000 * 10);
```

### 4、interview 相关

- 什么是孤儿进程？
  - 父进程创建子进程之后，父进程退出了，但父进程对应的一个或多个子进程还在运行，这些子进程会被系统的 init 进程收养，对应的进程 ppid 为 1，即为孤儿进程
- 多进程模式下怎么实现多端口监听？
  - 当父子进程之间建立 IPC 通道之后，通过子进程对象的 send 方法发送消息，第二个参数 sendHandle 就是句柄，可以是 TCP 套接字、TCP 服务器、UDP 套接字等，为了解决上面多进程端口占用问题，我们将主进程的 socket 传递到子进程
- 什么是 IPC 通信，如何建立 IPC 通信？父子进程间如何通信？
  - IPC (Inter-process communication) ，即进程间通信技术，由于每个进程创建之后都有自己的独立地址空间，实现 IPC 的目的就是为了进程之间资源共享访问，实现 IPC 的方式有多种：管道、消息队列、信号量、Domain Socket，Node.js 通过 pipe 来实现
  - 父进程在创建子进程之前会先去创建 IPC 通道并一直监听该通道，之后开始创建子进程并通过环境变量（NODE_CHANNEL_FD）的方式将 IPC 频道的文件描述符传递给子进程，子进程启动时根据传递的文件描述符去链接 IPC 通道，从而建立父子进程之间的通信机制

```javascript
// pipe.js
const spawn = require("child_process").spawn;
const child = spawn("node", ["worker.js"]);
child.stdout.pipe(process.stdout); // 将子进程的输出做为当前进程的输入
console.log(process.pid, child.pid);
// worker.js
console.log("I am worker, PID: ", process.pid);
```

- 进程的当前工作目录？有何作用？
  - 通过 process.cwd() 命令获取，默认为当前启动的目录，如果是创建子进程则继承于父进程的目录，可通过 process.chdir() 命令重置
  - 通过 fs 读取文件，如果设置为相对路径则相对于当前进程启动的目录进行查找，启动目录设置有误时将无法得到正确结果。程序里引用第三方模块也是
- 多进程或多个 Web 服务之间的状态共享问题？
  - 多进程模式下各个进程之间是相互独立的，一般通过 Redis 或者 数据库来做数据共享

## 六、console 日志模块(Logger 模块基本使用)

- 日志输出至终端

```javascript
const logger = reuqire("logger");

logger.log("hello world"); // 普通日志打印
logger.info("hello world"); // 等同于logger.log
logger.error("hello world"); // 错误日志打印
logger.warn("hello world"); // 等同于logger.error
logger.clear(); // 清除控制台信息
```

- 日志输出至文件

```javascript
const fs = require("fs");
const output = fs.createWriteStream("./stdout.txt");
const errorOutput = fs.createWriteStream("./stderr.txt");
const { Logger } = require("./logger");

const logger = Logger(output, errorOutput);

logger.info("hello world!"); // 内容输出到 stdout.txt 文件
logger.error("错误日志记录"); // 内容输出到 stderr.txt 文件
```

- dir 显示一个对象的所有属性和方法

```javascript
const family = {
  name: "Jack",
  brother: {
    hobby: ["篮球", "足球"],
  },
};
//depth - 表示最大递归的层数
logger.dir(family, { depth: 3 });

// { name: 'Jack', brother: { hobby: [ '篮球', '足球' ] } }
```

- 计算程序执行消耗时间

```javascript
// 启动计时器
logger.time("计时器");

// 中间写一些测试代码
for (let i = 0; i < 1000000000; i++) {}

// 停止计时器
logger.timeEnd("计时器");

// 计时器: 718.034ms
```

## 七、Net 网络模块

> Net 与 Dgram 是基于网络模型的传输层来实现的，分别对应于 TCP、UDP 协议

- TCP 协议特点：
  - 面向链接: 需要对方主机在线，并建立连接(3 次握手)或断开连接(4 次握手)。在一次 TCP 三次握手的过程中，客户端与服务端会分别提供一个套接字来形成一个链接并通过它互相发送数据。
  - 面向字节流：每次选出一段字节发送的时候，都会带上一个序号，即字节中编号最小的字节的编号
  - 可靠性：保证数据有序的到达对方主机，每发送一个数据就会期待收到对方的回复，如果在指定时间内收到了对方的回复，就确认为数据到达，否则重新发送一遍。

### 1、Net 模块创建 TCP 服务

> net 模块用于创建基于流的 TCP 或 IPC 的服务器（net.createServer()）与客户端（net.createConnection()）

```javascript
const net = require('net');
const server = net.createServer();
//服务器可以是一个 TCP 服务器或 IPC 服务器，这取决于 listen() 监听什么

//启动一个 IPC 服务器监听给定 path 的连接：
//server.listen(path[, backlog][, callback])

//启动 TCP 服务监听输入的 port 和 host
server.listen([port[, host[, backlog]]][, callback])
```

#### 1.1 TCP 服务事件

- listening：监听事件，调用`server.listen()`绑定服务器之后触发
- connection：当一个新的链接建立的时候触发，也就是每次收到客户端回调
  - 链接事件方法：
    - data：socket.on('data') 事件接收到数据，可理解为读取数据
    - end：每次 socket 链接会出现一次，如客户端发送消息之后执行 Ctrl + C 终端，就会收到
    - error：监听 socket 的错误信息
    - write：在 socket 上发送数据。`socket.write(data[, encoding][, callback])`
- close：当 server 关闭的时候触发（server.close()）。 如果有连接存在，直到所有的连接结束才会触发这个事件
- error：捕获错误，例如监听一个已经存在的端口就会报 Error: listen EADDRINUSE 错误

#### 1.2 TCP 服务端代码实现

```javascript
const net = require("net");
const HOST = "127.0.0.1";
const PORT = 3000;

// 创建一个 TCP 服务实例
const server = net.createServer();

// 监听端口
server.listen(PORT, HOST);

server.on("listening", () => {
  console.log(`服务已开启在 ${HOST}:${PORT}`);
});

server.on("connection", (socket) => {
  // data 事件就是读取数据
  socket.on("data", (buffer) => {
    const msg = buffer.toString();
    console.log(msg);

    // write 方法写入数据，发回给客户端
    socket.write(Buffer.from("你好 " + msg));
  });
});

server.on("close", () => {
  console.log("Server Close!");
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log("地址正被使用，重试中...");

    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  } else {
    console.error("服务器异常：", err);
  }
});
```

#### 1.3 TCP 客户端代码实现

```javascript
const net = require("net");
const client = net.createConnection({
  host: "127.0.0.1",
  port: 3000,
});

client.on("connect", () => {
  // 向服务器发送数据
  client.write("Nodejs 技术栈");

  setTimeout(() => {
    client.write("JavaScript ");
    client.write("TypeScript ");
    client.write("Python ");
    client.write("Java ");
    client.write("C ");
    client.write("PHP ");
    client.write("ASP.NET ");
  }, 1000);
});

client.on("data", (buffer) => {
  console.log(buffer.toString());
});

// 例如监听一个未开启的端口就会报 ECONNREFUSED 错误
client.on("error", (err) => {
  console.error("服务器异常：", err);
});

client.on("close", (err) => {
  console.log("客户端链接断开！", err);
});
```

### 2、TCP 粘包问题

> 客户端在发送前会将短时间有多个发送的数据块缓冲到一起（发送端缓冲区），形成一个大的数据块一并发送，同样接收端也有一个接收端缓冲区，收到的数据先存放接收端缓冲区，然后程序从这里读取部分数据进行消费，以减少 I/O 消耗达到性能优化。

- TCP 拥塞控制：TCP 拥塞控制是传输控制协议(Transmission Control Protocol)避免网络拥塞的算法
- 解决方案
  - 延迟发送：设置延迟发送，sleep 休眠一段时间的方式，简单但传输效率大大降低，对于交互频繁的场景显然不适用，仅使用于交互频率很低的场景。
  - 关闭 Nagle 算法：Nagle 算法能将网络中充斥的大量小的数据块集合起来一起发送减少网络拥堵，改善网络传输效率。在 Node.js 中可以设置 socket.setNoDelay() 方法来关闭 Nagle 算法，但对于粘包并不十分有效。
  - 封包/拆包：业界常用，使用长度编码的方式，通信双方约定好格式，将消息分为定长的消息头（Header）和不定长的消息体（Body），在解析时读取消息头获取到内容占用的长度，之后读取到的消息体内容字节数等于字节头的字节数时，认为其是一个完整的包。
    | 消息头序号(Header) | 消息体长度 | 消息体 |
    | :---: | --- | --- |
    | 2 字节 | 2 字节 | N 字节 |

## 八、DNS 域名解析

> DNS 模块是基于 UDP 协议来实现的，在 Node.js 中我们可以通过 require('dns') 载入 DNS 实现域名的解析查询

### 1、分类：Node.js DNS 模块分为两大类

- 一是使用底层操作系统工具进行域名解析

```javascript
const dns = require("dns");
//dns.lookup() 方法使用底层操作系统进行域名解析，是不需要经过任何网络通信
dns.lookup("nodejs.red", (err, address, family) => {
  console.log("地址: %j 地址族: IPv%s", address, family);
});
//若本地 hosts 文件被修改过，dns.lookup() 会拿本地 hosts 文件的域名映射
```

- 二是链接到一个 DNS 网络服务器执行域名解析：除 dns.lookup() 之外的所有函数，都会连接到实际 DNS 服务器以执行名称解析

```javascript
const dns = require("dns");

dns.resolve("www.nodejs.red", (err, records) => {
  console.log(records);
});
//使用 dns.resolve 即使修改 hosts 文件，也还是从外部读取正常的地址
```

### 2、dns.lookup() 与 dns.resolve() 不同

- 以异步 JavaScript 的角度来调用`dns.lookup()`，但在内部 libuv 底层线程池中却是同步的调用`getaddrinfo(3)`，可能造成 Node 进程阻塞
- `dns.resolve()`没有使用`getaddrinfo(3)`，是通过网络执行的 DNS 查询，始终是保持异步不会对其它进程产生负面影响

### 3、DNS 解析过程及 DNS 本地解析

- 浏览器 DNS 缓存 —> 系统（OS）缓存 -> 路由器缓存 -> ISP(互联网服务提供商) DNS 缓存
- DNS 本地解析指的是 系统（OS）缓存 这一阶段，在浏览器 DNS 缓存未命中的情况下，会从本地系统的一个 hosts 文件寻找对应 IP

## 九、Nodejs 进阶

### 1、I/O 模型

> 每个设备都会有一个专用的 I/O 地址，用来处理自己的输入输出信息。一次 API 接口调用、向磁盘写入日志信息，其实就是在跟 I/O 打交道。一次 I/O 操作分为等待资源、使用资源两个阶段

- 阻塞与非阻塞 I/O：操作系统内核等待资源阶段，根据发起 I/O 请求是否阻塞判断
  - 阻塞 I/O：一个用户进程发起一个 I/O 操作后，只有收到响应或超时才可处理其它。阻塞的这段时间对 CPU 资源是浪费的
  - 非阻塞 I/O：一个用户进程发起一个 I/O 操作后，若数据未就绪会立刻返回（标志数据资源不可用），此时 CPU 时间片可用来做一些其它事情
- 同步与异步 I/O：发生在使用资源阶段，根据实际 I/O 操作来判断
  - 同步 I/O：应用发送或接收数据后，如果不返回，继续等待（此处发生阻塞），直到数据成功或失败返回
  - **异步 I/O：应用发送或接收数据后立刻返回，数据写入 OS 缓存，由 OS 完成数据发送或接收，并返回成功或失败的信息给应用**
- 用户空间与内核空间：操作系统将内存空间划分为用户空间、内核空间两部分
  - 用户空间：传输层之上为用户空间（Web 客户端、浏览器、FTP 这些都属于上三层）
  - 内核空间：传输层之下，如传输层的 TCP、UDP 协议对应到内核空间
- I/O 模型演进
  - 同步阻塞 IO
  - 同步非阻塞 IO
  - **IO 多路复用**：多个网络 I/O 复用一个或少量的线程来处理 Socket
    - select：通过轮询，线性遍历检查在文件描述符上设置的标识位来判断
    - poll：类似 select，基于链表来实现，没有了最大链接 1024 的限制
    - **epoll**：linux 下效率最高的 I/O 事件通知机制，没有最大链接限制，通过 callbak 回调通知机制。Nginx 是基于 epoll 来实现高并发
    - kqueue：与 epoll 类似，仅存于 FreeBSD（一种类 UNIX 操作系统）
  - 信号驱动 IO
  - **异步 IO 模型**：应用程序发起系统调用后无需等待直接返回当前调用状态，进行后续的其它任务，结果由内核完成 I/O 操作之后通过回调通知到我们的应用程序，中间没有阻塞过程

## 十、Express 入门

### 1、安装

`npm install express --save`

### 2、创建实例及监听端口

- 引入包方法：`const express = require('express')`
- 创建应用实例：`const app = express();app.get('/', (req, res) => res.send('Hello World!'))`
- 监听端口启动服务器：`app.listen(3000, () => {console.log('App listeningon port 3000!');});`

### 3、基本路由

#### 3.1 路由定义：app.METHOD(PATH, HANDLER)

有一个特殊的路由方法 app.all()，用于在路径上为所有 HTTP 请求方法加载中间件功能

```javascript
app.all("/secret", function (req, res, next) {
  console.log("Accessing the secret section ...");
  next(); // pass control to the next handler
});
```

#### 3.2 路由处理器 HANDLER（含中间件）

路由处理器可以采用**函数，函数数组或二者组合**的形式，如下所示

```javascript
app.get(
  "/example/b",
  function (req, res, next) {
    console.log("the response will be sent by the next function ...");
    next();
  },
  function (req, res) {
    res.send("Hello from B!");
  }
);
```

#### 3.3 链式路由处理器：app.route()

对于模块化的路由，建立链式路由处理器：

```javascript
app
  .route("/book")
  .get(function (req, res) {
    res.send("Get a random book");
  })
  .post(function (req, res) {
    res.send("Add a book");
  })
  .put(function (req, res) {
    res.send("Update the book");
  });
```

#### 3.4 创建模块化路由器：express.Router()

路由器实例是一个完整的中间件和路由系统。 中间件的加载顺序很重要：首先加载的中间件功能也将首先执行。

```javascript
//birds.js
const express = require("express");
const router = express.Router({
  mergeParams: true, //保留父路由器的req.params值，参数名称冲突则以子路由为准。
});

router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/", function (req, res) {
  res.send("Birds home page");
});

router.get("/about", function (req, res) {
  res.send("About birds");
});

module.exports = router;

const birds = require("./birds");
// app使用中间件(显示时间)，其加载顺序必须在最终 handler 之前，以便首先调用
app.use("/birds", birds);
```

#### 3.5 可配置的中间件：app.use()

要加载中间件，使用 app.use(HANDLER) 指定中间件函数。

```javascript
// my-middleware.js
module.exports = function (options) {
  return function (req, res, next) {
    // Implement the middleware function based on the options object
    next();
  };
};
var mw = require("./my-middleware.js");
app.use(mw({ option1: "1", option2: "2" }));
```

### 4、静态文件托管、json 解析

- 新建 public 文件夹，放入资源文件如 index.html
- 中间件默认使用相应路径访问
  - `app.use('/uploads',express.static(__dirname + '/uploads'))`
  - \_\_dirname 在 node 中可直接访问，表示当前运行文件的目录
- 解析 json :`app.use(express.json())`

### 5、CORS 跨域请求

- 安装跨域包:`npm i cors`
- 引入使用：`app.use(require('cors')())`

### 6、连接 MongoDB

- 安装包：`npm install mongoose`
- 命令行启动 mongoDB:`net start mongodb`
- 创建实例：`const mongoose = require('mongoose');`
- 连接数据库：`mongoose.connect('mongodb://localhost/test',{ useNewUrlParser: true,useUnifiedTopology: true })`
- 建立数据模型：
  - `const schema = new mongoose.Schema({title:String})`
  - `const Product = mongoose.model('Product',schema)`
- 传入数据：`Product.insertMany([{title:'产品1'},{title:'产品2'}])`
- 增删数据：

```javascript
app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.send(product);
});
app.delete("/products/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  await product.remove();
  res.send({
    success: true,
  });
});
```
