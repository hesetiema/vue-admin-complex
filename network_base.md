
# 网络基础🌏

## 😱五层因特网协议栈

| 协议栈 | 含义 | 举例 | 数据单位封装 |
| ---- | --- | ---- | ---- |
| 应用层 | 为操作系统或网络应用程序提供访问网络服务的接口；数据格式转换、数据流动的逻辑通路、数据分割等 | `DNS`域名系统、`http`超文本传输协议、`FTP`、`SMTP` | 报文(message)：网络中交换与传输的数据单元 |
| 传输层 | 定义端口，标识应用程序身份，实现端口到端口的通信，TCP协议可以保证数据传输的可靠性 | `TCP`传输控制协议、`UDP`用户数据协议 | 报文段(segment)是组成报文的每个分组
|网络层 | 地址管理与路由选择。定义IP地址，区分网段，子网内MAC寻址，对外网数据包进行路由转发 |`IP`协议、`ARP`地址解析协议（映射IP 地址与Mac地址）、路由器| 分组(packet)：传输的二进制格式单元。数据报(Datagram)：传输的基本数据单元。数据包(datapacket)：传输中的数据单位。 |
| 数据链路层 | 对0和1进行分组，定义数据帧，确认主机的Mac地址 |Wi-Fi，以太网：规定一组电信号就是一个数据包，即一帧 |帧（frame）：数据链路层的协议数据单元。 |
| 物理层 | 界定连接器、数据速率、媒体对应的比特编码方式 |光纤、双绞线、无线电波：决定电信号(0和1)的传输方式、带宽、速率、抗干扰性等 | 比特（bit），协议数据单元。1字节(byte) = 8 bit |

![avatar](https://user-gold-cdn.xitu.io/2019/2/13/168e49372eedcb32?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## ⛲UDP

- 面向报文：UDP 只是报文的搬运工，不会对报文进行任何拆分和拼接操作。
- 不可靠性：无连接的；尽最大努力交付，即不保证可靠交付；没有拥塞控制
- 高效：头部开销小，只有八字节
- 传输方式：支持一对一、一对多、多对一和多对多的交互通信

## 🐣TCP

>TCP：提供一种面向连接的、可靠的字节流服务。保证数据通信的完整性和可靠性，防止丢包。TCP 建立连接需要三次握手，断开连接需四次握手。效率比不上 UDP 协议，但具有重发包，顺序控制等机制
>
![avatar](https://s2.ax1x.com/2019/10/11/uHeatJ.png)

### 特点

- 连接识别：源 IP 地址、源端口号、目的 IP 地址、目的端口号
- 可靠性高：TCP 为 HTTP 提供了一条可靠的比特传输管道
  - 数据包校验、对失序数据包重排序
  - 丢弃重复数据、自动重传、超时重发、流量控制
- 分段、分组传送：TCP 报文被打包为报文段，再通过 IP 分组（ IP 数据报）封装来发送的。每个 IP 分组中都包括： IP 分组首部、 TCP 段首部、 TCP 数据块

### TCP段

![avatar](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043741.png)

- 序列号(Sequence number)：对数据包进行标记，保证传输的报文都是有序的
- 确认号(Acknowledgement Number)：期望收到对方下一个报文段的序号值，表示上一序号的数据已收到
- 窗口大小(Window Size)：表示还能接收多少字节的数据，用于流量控制
- 标识符
  - URG=1：该字段表示本数据报的数据部分包含紧急信息，是一个高优先级数据报文，此时紧急指针有效
  - ACK=1：该字段表示确认号字段有效。此外，TCP 还规定在连接建立后传送的所有报文段都必须把 ACK 置一
  - PSH=1：该字段表示接收端应该立即将数据 push 给应用层，而不是等到缓冲区满后再提交
  - RST=1：复位报文段。该字段表示当前 TCP 连接出现严重问题，可能需要重新建立 TCP 连接，也可以用于拒绝非法的报文段和拒绝连接请求
  - SYN=1：同步报文段。当SYN=1，ACK=0时，表示一个连接请求报文。当SYN=1，ACK=1时，表示一个同意建立连接的应答报文
  - FIN=1：结束报文段。该字段表示此报文段是一个释放连接的请求报文

### 建立连接三次握手（两端交换ISN，证明两端收发能力OK）

- 1、客户端发送`SYN`报文，指明客户端初始化序列号`Seq = ISN(c)`</br>
- 2、服务端发送`SYN+ACK`报文，指明服务端初始化序列号`Seq = ISN(s)`，确认号`ACK = ISN(c)+1`</br>
- 3、客户端发送`ACK`报文，指明序列号`Seq =  ISN(c)+1`，确认号`ACK = ISN(s)+1`
  - 第三次握手中可以携带数据：
    - 服务器在第二个握手报文中嵌入不透明Cookie(`Opaque Cookie`)，凡是在第三个握手报文中携带这个不透明Cookie(`Opaque Cookie`)的为真实`IP`
  - 为什么还需要第三次握手？
    - **防止失效的连接请求报文段被服务端接收，产生错误**
  - 第三次握手ACK丢失会发生什么？
    - 超时重传 SYN 包，一般会重试五次，在建立连接中可能会遇到 SYN FLOOD 攻击，可选择调低重试次数或在不能处理的情况下拒绝请求

![avatar](https://i.postimg.cc/Kzkqjtb2/Snipaste-2019-10-09-14-35-41.png)

### 断开连接四次挥手

- 为什么需要四次挥手?
  - 第二次挥手后, 客户端不再向服务端请求任何数据, 但服务端可能还正在给客户端发送数据，此时服务端会等待数据传输完毕后再发送关闭请求
- 为什么 Client 要进入 TIME-WAIT 状态，且等待 2MSL 时间后才进入 CLOSED 状态？
  - 可靠地实现TCP全双工连接的终止：被动关闭的一方可能收不到主动关闭一方最后发送的ACK，因此一定是主动关闭的一方需要TIME_WAIT，以便重传最后那个ACK
  - 保证 Server 能收到 Client 的确认应答
    - 直接进入 CLOSED 状态时，如果确认应答因为网络问题一直没有到达，会造成 server 不能正常关闭
    - 2MSL 时间能保证当前连接的所有分组都被丢弃，建立新连接时就不可能接受到前一个连接的重复分组

### ARQ协议

>ARQ(Automatic Repeat Request)：即自动重传请求。当请求失败时它会自动重传，直到请求被正确接收为止，保证了数据的正确送达。ARQ 协议包含停止等待 ARQ 和连续 ARQ

- 停止等待 ARQ：只要 A 向 B 发送一段报文，都要停止发送并启动一个定时器，等待对端`ACK`，在定时器时间内接收到对端应答就取消定时器并发送下一段报文
- 连续 ARQ：发送端拥有一个发送窗口，可以在没有收到应答的情况下持续发送窗口内的数据。通过累计确认，可以在收到多个报文以后统一回复一个应答报文

### 滑动窗口(Sliding window)

- 作用：实现了流量控制，控制发送方发送速率，保证接收方来得及接收
- 发送端窗口
  - 组成：已发送但未收到应答的数据、可以发送但未发送的数据
  - 大小：不断变化的。接收方会把当前接收窗口的剩余大小写入应答报文，发送端收到应答后根据该值和当前网络拥塞情况设置发送窗口的大小
  - 滑动：当发送端接收到应答报文后，会随之将窗口进行滑动
- zero窗口
  - 发送报文的过程中，可能会遇到对端出现零窗口的情况，发送端会停止发送数据，并启动`persistent timer`
  - 定时器会定时发送请求给对端，让对端告知窗口大小。重试超过一定次数后，可能会中断 TCP 链接

![uHlfVx.png](https://s2.ax1x.com/2019/10/11/uHlfVx.png)
![uHlha6.png](https://s2.ax1x.com/2019/10/11/uHlha6.png)

### 拥塞控制

作用于网络，防止过多的数据拥塞网络，避免出现网络负载过大。包括四个算法：慢开始，拥塞避免，快速重传，快速恢复

- 慢开始：传输开始时将发送窗口慢慢指数级扩大
  - 连接初始设置拥塞窗口`cwnd（Congestion Window）`为 1 MSS（一个分段的最大数据量）
  - 每过一个 RTT(round-trip time,往返时间)  就将窗口大小乘二
  - 当窗口大小大于阈值（ssthresh，慢开始门限）时就会启动拥塞避免算法
- 拥塞避免：每过一个 RTT 窗口大小只加一，避免指数级增长导致网络拥塞，慢慢将大小调整到最佳值
  - 传输过程中可能定时器超时的情况，这时 TCP 会认为网络拥塞
    - 将阈值设为当前拥塞窗口的一半
    - 将拥塞窗口设为 1 MSS，进入慢开始
    - 窗口达到新阈值，启动拥塞避免算法
- 快速重传+快速恢复（fast retransmit and recovery，FRR）：
  - 快重传：发送方一连收到三个重复确认(`3-ACK`)时，立即重传对方尚未收到的报文段，而不必继续等待设置的重传计时器时间到期
  - 快恢复(TCP New Reno)：发送方一连收到三个重复确认(`3-ACK`)时，将阈值设为当前cwnd的一半`ssthresh = cwnd / 2`。同时记下三个重复 ACK 的分段的最大序号S
    - 将拥塞窗口`cwnd`重新设置`cwnd= ssthresh + 3 * MSS`，开始重传，若收到新的ACK序号<=S，表明多包丢失，继续重传
    - 若收到新的ACK序号>S，表明重传成功。将拥塞窗口`cwnd`重新设置为ssthresh的大小，然后执行拥塞避免算法

![avatar](https://user-gold-cdn.xitu.io/2018/1/1/160b0882956c7736?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 💭HTTP

>HTTP 超文本传输协议：无状态协议，不会保存状态</br>

### 资源

#### MIME类型

>MIME(Multipurpose Internet Mail Extension 多用途因特网邮件扩展)媒体类型：描述报文实体主体内容的一些标准化名称（比如，text/html、image/jpeg）。

在 HTTP 中，MIME 媒体类型被广泛用于 Content-Type 和 Accept 首部，例如：

- Content-Type: video/quicktime
- Content-Type: text/html; charset="iso-8859-6"
- Content-Type: multipart/mixed; boundary=gc0p4Jq0M2Yt08j34c0p
- Accept: image/gif

#### URL(Uniform Resource Identifier)通用资源标志符

`<scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag>`

- scheme 方案：访问服务器以获取资源时要使用哪种协议。如`http`、`https`
- host 主机：资源宿主服务器的主机名或点分IP地址
  - localhost 是个域名，可被配置为任意的 IP 地址
    - 通常指向 127.0.0.1(ipv4)、 ::1(ipv6)表示本地主机名
    - 本机 IP 是你真实网卡的 IP，具体来说有线网卡ethrtnet、无线网卡wlan。而127.0.0.1 是那块叫做 loopback 的虚拟网卡的 IP
- port 端口：资源宿主服务器正在监听的端口号。很多方案都有默认端口号（HTTP的默认端口号为`80`）
- path 路径：服务器上资源的本地名，`/`与前面的URL组件分隔开来

### HTTP请求方法

>副作用：指对服务器上的资源做改变。搜索是无副作用的，注册是副作用的</br>
>幂等：指发送 M和 N次请求(M不等于N，都大于1)，服务器上资源的状态一致

- GET：请求服务器向客户端发送命名资源
  - 多用于无副作用，幂等的场景，例如搜索关键字
  - Get 请求都包含在 URL 里，能缓存且会被浏览器保存历史纪录
  - 只支持 ASCII 字符
- POST：将客户端数据发送到一个服务器网关应用程序
  - 多用于副作用，不幂等的场景，例如注册
  - 可通过 request body来传输比 Get 更多的数据
  - 支持更多的编码类型且不对数据类型限制
- HEAD：仅发送命名资源响应（同GET）中的 HTTP 首部
  - 多用于在下载一个大文件前，先获取其大小再决定是否要下载
- OPTIONS：用于获取目的资源所支持的通信选项
- PUT：将来自客户端的数据存储到一个命名的服务器资源中
  - 多用于幂等的场景，通常情况下，PUT的URI指向是具体单一资源
- DELETE：从服务器中删除命名资源
- PATCH：用于对资源进行部分修改

### HTTP响应状态码

- 2XX 成功
  - 200 OK
  - 204 No Content 响应报文不含实体的主体部分
  - 205 Reset Content 响应报文不含实体的主体部分，要求请求方重置内容
  - 206 Partial Content 进行范围请求
- 3XX 重定向
  - 301 Moved Permanently 永久性重定向，表示资源已被分配了新的 URL
  - 302 found 临时性重定向，表示资源临时被分配了新的 URL（http1.0协议）
  - 303 see other 表示资源存在着另一个 URL，应使用 GET 方法获取资源
  - 304 not modified 服务器允许访问资源，但请求未满足条件（资源未修改）
  - 307 temporary redirect 临时重定向，期望客户端保持请求方法不变向新地址请求
- 4XX 客户端错误
  - 400 bad request 请求报文存在语法错误
  - 401 unauthorized 表示发送的请求需要有通过 HTTP 认证的认证信息
  - 403 forbidden 表示对请求资源的访问被服务器拒绝
  - 404 not found 表示在服务器上没有找到请求的资源
- 5XX 服务器错误
  - 500 internal sever error，表示服务器端在执行请求时发生了错误
  - 501 Not Implemented，请求超出服务器的能力范围（不支持的请求方法）
  - 503 service unavailable，服务器暂时处于超负载或停机维护，无法处理请求
  - 504 Gateway Timeout，响应来自一个网关或代理，它们在等待另一服务器对其请求进行响应时超时

### HTTP 首部

- General
  - Connection：浏览器想要优先使用的连接类型，比如`keep-alive`长连接
  - Date：创建报文时间，比如`Thu, 10 Oct 2019 10:47:45 GMT`
  - Transfer-Encoding：传输编码方式，比如`chunked`
  - Via：报文经过的中间节点（代理、网关）
  - Cache-Control：控制缓存的行为，如`no-cache`。`no-cache`表达的是可以缓存，但是每次都需要去服务器确认缓存资源的新鲜度，而不是不缓存
- Request Headers
  - 信息性首部
    - User-Agent：客户端信息
    - Host：服务器的域名
    - Refer：提供包含当前请求URI的文档的URL
    - From：提供客户端用户的E-mail地址
  - Accept首部
    - Accept：用户代理期望的`MIME`类型列表，如`*/*`
    - Accept-Charset：用户代理支持的字符集
    - Accept-Encoding：用户代理支持的编码方法，如`gzip, deflate`
    - Accept-Language：用户代理期望的页面语言，如`zh-CN`
  - 条件请求首部
    - Expect：期待服务端的指定行为
    - Range：如果服务器支持范围请求，就请求资源的指定范围
    - If-Match：两端资源实体标记比较，相匹配就获取这份资源
    - If-None-Match：两端资源实体标记比较，若相同(false)则返回`304`，不相同(true)则返回`200`获取资源
    - If-Modified-Since：两端资源更新时间比较，服务器确认客户端资源新鲜返回`304`，不新鲜返回`200`获取资源
  - 安全请求首部
    - Cookie：客户端用它向服务器传送一个令牌——非真正的安全首部，但隐含有安全功能
    - Authorization：包含了客户端提供给服务器，以便对其自身进行认证的数据
  - 代理请求首部
    - Proxy-Authorization：代理服务器要求web认证信息
    - Max-Forwards：限制可被代理及网关转发的次数
- Response Headers
  - 信息性首部
    - Age：资源在代理缓存中存在的时间
    - Server：服务器应用程序软件的名称和版本
  - 协商首部
    - Accept-Ranges：支持资源的某些范围类型，如`bytes`
    - Vary：服务器查看的其他首部的列表，根据这些首部的内容挑选出最适合的资源版本发送给客户端
  - 安全响应首部
    - Proxy-Authenticate 向代理服务器发送的验证信息
    - Set-Cookie：非真正的安全首部，但隐含有安全功能；可以在客户端设置一个令牌，以便服务器对客户端进行标识
    - WWW-Authenticate：服务器对客户端的质询列表
- Entity（实体） Headers
  - 信息性首部
    - Allow：列出了可以对此实体执行的请求方法
    - Location：告知客户端重定向到某个 URL
  - 内容首部
    - Content-Encoding：内容的编码方式
    - Content-Language：内容使用的语言
    - Content-Length：内容的长度
    - Content-Location：返回数据的备用地址
    - Content-Range：内容在整个资源中的字节范围
    - Content-Type：内容的媒体类型
  - 缓存首部
    - ETag：与此实体相关的实体标记。标记本质上就是某版本资源的标识符
    - Expires：内容的过期时间
    - Last-Modified：实体的最后修改时间

### 缓存

- 强缓存：表示在缓存期间不需要请求，state code 为 200
  - Expires：响应头，代表该资源的过期时间， HTTP / 1.0 的产物
  - Cache-Control：请求/响应头，缓存控制字段，出现于 HTTP / 1.1，优先级高于 Expires 。属性`Cache-control: max-age=30`表示资源会在 30 秒后过期，需要再次请求
- 协商缓存：缓存过期可以使用协商缓存。协商缓存需要请求，若服务端提示缓存资源未改动（Not Modified），资源会被重定向到浏览器缓存返回 304。协商缓存需要客户端和服务端共同实现
  - Last-Modified 和 If-Modified-Since：
    - Last-Modified 表示本地文件最后修改日期
    - If-Modified-Since 会将 Last-Modified 的值发送给服务器，询问服务器在该日期后资源是否有更新，有更新的话就会将新的资源发送回来
  - ETag 和 If-None-Match
    - ETag 类似于文件指纹
    - If-None-Match 会将当前 ETag 发送给服务器，询问该资源 ETag 是否变动，有变动的话就将新的资源发送回来。并且 ETag 优先级比 Last-Modified 高

### CORS

- 原理：浏览器向服务器发出`Fetch/XHR`请求，服务端使用额外的HTTP头部`Access-Control-Allow-Origin` 就可以告诉浏览器让web应用进行跨域资源请求
- 特点：
  - CORS要求服务端设置一些头部字段，最重要的就是 `Access-Control-Allow-Origin`
  - 生产环境中建议用成熟的开源中间件：如前端使用`axios`进行 `http`传输，后端以`koa`作为服务端框架，可使用CORS中间件 `koa2-cors`
- 跨域请求：`Access-Control-Allow-Origin`为 * 或与 Origin 值相同
  - 简单请求：不触发预检请求
    - 可请求方法：GET, POST 或 HEAD
    - 可定义请求头：Accept、Accept-Language、Content-Language、Content-Type( application/x-www-form-urlencoded， multipart/form-data 或 text/plain.)
  - 预检请求&正式请求
    - 预检请求（浏览器发送 OPTIONS 请求到相同的 url，确认没问题）
      - Access-Control-Request-Headers：告知服务器，实际请求将携带自定义请求首部字段
      - Access-Control-Request-Method：告知服务器，实际请求将使用相应的方法
      - Access-Control-Max-Age：指定预检请求的结果能够被缓存多久，单位是秒
      - Access-Control-Allow-Headers、Access-Control-Allow-Methods：表明服务器允许的请求首部字段和请求方法
      - Access-Control-Expose-Headers 让服务器把允许浏览器访问的头部字段放入白名单，允许 JavaScript 访问任何其他响应头
    - 正式请求：实际请求中发送了对应的头部字段

    ```js
    //预检请求
    axios({
      method: 'POST',
      url: 'http://localhost:3000/api/mainRequest',
      headers: { 'Sec-Fetch-Mode': 'CORS' }, // 增加自定义的头部字段
      withCredentials: true // 增加了withCredentials 选项
    }).then(data => {console.log(data);});
    ```
  
  - 附带身份验证的请求(cookie 不能跨域传递)
    - 服务器响应设置
      - Access-Control-Allow-Origin 值与 Origin 相同，不能为`*`
      - Access-Control-Allow-Credentials （凭据）为 true
    - js代码请求添加凭据
      - XHR：withCredentials: true
      - Fetch：credentials: 'include'

## 🗯HTTPS

>HTTPS 还是通过 HTTP 来传输信息，但 HTTP 报文发送给 TCP 前先将其发送给`TLS`(`Transport Layer Security`) `传输层安全协议`进行加密。TLS 是个二进制协议，其流量通常是承载在端口 443

![avatar](https://i.postimg.cc/PfyqM78N/Snipaste-2019-10-11-11-09-10.png)

### 数字加密

>TLS 中使用了两种加密技术，分别为对称加密和非对称加密。</br>

- 密钥算法
  - key exchange 密钥协商交换算法：如`ECDHE_RSA`
    - ECDHE(Elliptic Curves Diffie-Hellman Ephemeral)基于椭圆曲线签密方案`D-H`的密钥协商协议，用于协商临时会话密钥
    - RSA算法：证书公钥加密算法，用于对证书数据部分的散列值进行签密、对 ECDHE 交换参数（的 HASH 值）进行签密
  - Cipher 加密算法：如`AES_256_GCM`
    - AES_256（Advanced Encryption Standard,高级加密标准）：使用长度为256位的会话对称加密算法，双方通过 ECDHE 交换参数协商出对称密钥
    - GCM(Galois计数器模式)：一种特殊的称为 AEAD 的加密模式
  - Hash algorithm 消息认证码算法：如`SHA-256`
    - 基于有密钥的加密散列函数，用于创建消息摘要/指纹
    - 使用安全散列算法2（SHA-2）生成256字节的摘要，确保消息的完整性（没有被篡改）
  - Key exchange group，如`X25519`
    - X25519：椭圆曲线密钥交换算法，Curve25519 是目前最高水平的 Diffie-Hellman函数，适用于广泛的场景
- 对称加密（AES算法实现）：加密和解密使用相同的密钥。双方需要共享相同的密钥才能通信
- 非对称加密（RSA算法实现）：有公钥私钥之分，数据用公钥加密，用私钥解密，私钥只有分发公钥的一方才知道

### TLS 握手协议

>Handshake协议：负责协商使用的TLS版本、加密算法、哈希算法、密钥材料等，对服务器、客户端（可选）进行身份认证，最后对整个握手阶段信息进行完整性校验以防范中间人攻击，是整个TLS协议的核心。TLS 1.2 协议需要两次往返（ 2-RTT ）才能完成握手，然后才能发送请求。</br>

TLS 1.3 协议不再支持静态的`RSA`密钥交换(不是前向安全算法)，引入了新的密钥协商机制 —`PSK`。首次建立连接只需要1-RTT
![avatar](https://upload-images.jianshu.io/upload_images/80097-ca53d3d086450b6b.png?imageMogr2/auto-orient/strip|imageView2/2/w/651/format/webp)

>+表示该报文中值得注意的extension、* 表示该内容也可能不被发送、{} 表示该内容使用handshake_key加密、[] 表示该内容使用application_key加密

- `Client`发送`Client Hello（CH）`报文给`Server`，包含相关连接扩展和密钥协商扩展，如支持的加密套件，支持的TLS协议版本号、支持的椭圆曲线类型及对应计算出的`public key`(key_share中)
- `Server`发送`Server Hello（SH）`报文给`Client`，包含有关密钥协商的扩展，如选择的TLS协议版本号、选中的椭圆曲线及计算出来的`公钥`返回给客户端，双方根据CH和SH的协商结果可以得出密钥材料
- 利用密钥材料和前两个报文的哈希值，使用`HKDF`(新的密钥导出函数)可以计算出一个handshake_key，此后握手阶段的信息受该密钥保护
- `Server Hello`之后server立刻发送`Encrypted Extension`，包含其他与密钥协商无关的扩展数据给`Client`
- 若需要对`Client`身份进行认证，`Server`需要发送`Certificate Request（CR）`;客户端收到了服务端的`CR`报文，返回自己的`Certificate`报文和`CV`报文
- `Server`发送`Certificate`报文（传递自己的证书信息）、`Certificate Verify(CV)`报文（使用自己的证书私钥对之前的报文进行`HMAC`签名证明自己持有该证书）给`Client`
- 服务端发送`Finished`报文。表明服务端到客户端信道的握手阶段结束，理论上不得再由该信道发送任何握手报文
- 客户端发送`Finished`报文，表明握手阶段结束，可以正式开始会话通讯。`Finished`报文使用会话密钥对上述所有握手信息进行`HMAC`签名，校验签名可以检验握手阶段的完整性，也可以验证双方是否协商出了一致的密钥

## 🏻HTTP 2.0

>队头阻塞（Head of line blocking）：导致在达到最大请求数量时，剩余的资源需要等待其他资源请求完成后才能发起请求

### 二进制传输

在之前的 HTTP 版本中，我们是通过文本的方式传输数据。在 HTTP 2.0 中引入了新的编码机制，所有传输的数据都会被分割，并采用二进制格式编码。

![avatar](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-43760.png)

### 多路复用

>帧：代表着最小的数据单位，每个帧会标识出该帧属于哪个流；</br>流：多个帧组成的数据流

多路复用：一个 TCP 连接中可存在多条流，即可以发送多个请求，对端可以通过帧中的标识知道属于哪个请求。以避免 HTTP 旧版本的队头阻塞问题，极大提高传输性能

![avatar](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043800.png)

### Header 压缩

HTTP 2.0 中，使用了`HPACK`压缩格式对传输的 header 进行编码，减少了 header 的大小。并在两端维护了索引表，用于记录出现过的 header ，后面在传输过程中就可以传输已经记录过的 header 的键名，对端收到数据后就可以通过键名找到对应的值

### 服务端 Push

>DNS Prefetch(`DNS`预获取)：让具有此属性的域名不需要用户点击链接就在后台解析，而域名解析和内容载入是串行的网络操作，所以该方式能减少用户的等待时间，提升用户体验

HTTP 2.0 中，服务端可以在客户端某个请求后，主动推送其他资源。提前给客户端推送必要的资源，这样就可以相对减少一点延迟时间。当然在浏览器兼容的情况下你也可以使用`prefetch`

### QUIC

QUIC（Quick UDP Internet Connection）快速 UDP 互联网连接：一种基于`UDP`协议的实验性的传输层协议，它在两个端点之间创建连接，且支持多路复用。

- 支持多路复用
- 实现了自己的加密协议，通过类似 TCP 的 TFO 机制可以实现 0-RTT
- 支持重传和纠错机制（向前恢复），在只丢失一个包的情况下不需要重传，使用纠错机制恢复丢失的包

![avatar](https://img.halfrost.com/Blog/ArticleImage/100_1.png)

## 🍤DNS

>DNS 的作用就是通过域名查询到具体的`IP`

访问`www.google.com`时，操作系统执行`DNS`迭代查询，DNS 是基于 UDP 做的查询

- 浏览器搜索自己的 DNS 缓存
- 没有的话搜索操作系统中的 DNS 缓存，没有的话搜索操作系统的 hosts 文件
- 没有的话会去系统配置的 DNS 服务器中查询
- 还没得的话会直接去 DNS 根服务器查询，找出负责一级域名的服务器(如 com )
- 去该服务器查询 google 这个二级域名，再查询三级域名
- 将得到的`IP`地址返回给操作系统，同时自己也将 IP 地址缓存起来；操作系统将 IP 地址返回给浏览器，同时自己也将 IP 地址缓存起来

## 🌷IP

>IP 地址：指明节点被分配到的网络地址，用于区分两台主机是否同属一个网络</br>
>MAC 地址：指网卡所属的固定地址。采用十六进制标识，共6个字节， 前三个字节是厂商编号，后三个字节是网卡流水号，例如 4C-0F-6E-12-D2-19

- IPV4 地址：32位的地址，常采用4个十进制数字表示。例如C类地址192.168.24.1
  - 前面部分代表网络地址。若两个IP地址在同一子网内，则网络地址一定相同
  - 后面部分表示该主机在局域网中的地址
- IP 地址可以和 MAC 地址进行配对，IP 间的通信依赖 MAC 地址
- IP 地址可变换，但 MAC 地址基本上不会更改
- ARP 地址解析协议：根据IP地址获取MAC地址的一个网络层协议

## 🗻相关进阶

### 从输入 URL 到页面加载完成的过程

- 首先浏览器线程分析判断 URL地址，`确定应用层协议`如 HTTP/HTTPS。再调用浏览器引擎中loadUrl方法，`分析加载URL地址`。最后通过`DNS解析`获取对应的IP地址，查询完成后连同浏览器的Cookie、userAgent等信息向网站目的IP发出请求
- 接下来是`TCP握手`，应用层会下发数据给传输层，这里 TCP 协议会指明`两端的端口号`，然后下发给网络层。网络层中的 IP 协议会确定`IP 地址`，并且指示了数据传输中如何跳转路由器。然后包会再被封装到数据链路层的数据帧结构中，最后就是物理层面的传输
- TCP 握手结束后会进行`TLS握手`，然后就开始正式的传输数据
- 数据在进入服务端之前，可能还会先经过负责`负载均衡`的服务器，它的作用就是将请求合理的分发到多台服务器上，这时假设`服务端响应`一个 HTML 文件
- 首先`浏览器判断状态码`是什么，如果是 200 那就继续解析，如果 400 或 500 的话就会报错，如果 300 的话会进行重定向，这里会有个重定向计数器，避免过多次的重定向，超过次数也会报错
- `浏览器开始解析文件`，如果是 gzip 格式的话会先解压一下，然后通过文件的编码格式知道该如何去解码文件。解析的过程可以分成两个子过程：词法分析（lexer）和语法分析（parser）。一个是拆分标记，一个是匹配规则。
- 文件解码成功后会正式开始`渲染流程`，先会根据 HTML 构建 DOM 树，有 CSS 的话会去构建 CSSOM 树。如果遇到 script 标签的话，会判断是否存在 async 或者 defer ，前者会并行进行下载并执行 JS，后者会先下载文件，然后等待 HTML 解析完成后顺序执行，如果以上都没有，就会阻塞住渲染流程直到 JS 执行完毕。遇到文件下载的会去下载文件，这里如果使用 HTTP 2.0 协议的话会极大的提高多图的下载效率。
- 初始的`HTML被完全加载和解析后触发 DOMContentLoaded`事件
- CSSOM 树和 DOM 树构建完成后会开始`生成 Render 树`，这一步就是确定页面元素的布局、样式等等诸多方面的东西
- 生成 Render 树的过程中，`浏览器调用 GPU 绘制`,合成图层，将内容显示在屏幕上
