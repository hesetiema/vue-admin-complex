# 前端安全 🔐

## 👽XSS

> 跨站脚本攻击（Cross-site scripting，aka XSS）是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等。本质是恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。

### 根据攻击的来源分类

| 类型 | 存储区(恶意代码存放的位置) | 插入点 |
| ---- | ----- | ------ |
| 存储型XSS | 后端数据库 | HTML |
| 反射型XSS | URL | HTML |
| DOM型XSS | 后端数据库/前端存储/URL | 前端Javascript |

- 存储型（持久型）：用户打开目标网站时，`网站服务端`将恶意代码从`数据库`取出，拼接在 HTML 中返回给浏览器解析执行。常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等

- 反射型（非持久型）：用户被诱导打开带有恶意代码的`URL`时，`网站服务端`将恶意代码从`URL`中取出，拼接在 HTML 中返回给浏览器解析执行。常见于通过`URL`传递参数的功能，如网站搜索、跳转等

- DOM型：攻击者构造出特殊的`URL`，其中包含恶意代码。用户打开带有恶意代码的`URL`。用户浏览器接收到响应后解析执行，`前端 JavaScript` 取出`URL`中的恶意代码并执行。属于前端 JavaScript 自身的安全漏洞

### 如何防御

- 输入过滤：对于明确的输入类型，如数字、URL、电话号码、邮件地址等等内容
  - 输入内容长度控制：对于不受信任的输入，限定一个合理的长度
  - 对 HTML 做充分转义：不同情况采用不同转义规则，采用成熟的的转义库
- CSP(Content Security Policy)：内容安全策略本质上是建立白名单，规定浏览器只能够执行特定来源的代码

- HTTP-only Cookie：禁止 JavaScript 读取某些敏感 Cookie，攻击者完成 XSS 注入后也无法窃取此 Cookie
- 验证码：防止脚本冒充用户提交危险操作

## 💥CSRF

>CSRF（Cross-site request forgery，aka CSRF or XSRF）跨站请求伪造，是一种冒充受信任用户，向服务器发送非预期请求的攻击方式。本质是利用用户的登录态发起恶意请求。

### 攻击类型

- GET类型的CSRF：只需要一个HTTP请求
- POST类型的CSRF：利用起来通常使用的是一个自动提交的表单。模拟用户完成了一次POST操作
- 链接类型的CSRF：需要用户点击链接才会触发。通常是在论坛中发布的图片中嵌入恶意链接，或者以广告的形式诱导用户

### 防护策略

- 同源检测：相对简单，能够防范绝大多数的CSRF攻击
  - Origin Header: 在部分与CSRF有关请求的Header中会携带Origin字段，若存在则使用Origin中的字段确认来源域名
  - Referer Header: 在HTTP头中Referer字段记录了该HTTP请求的来源地址，使用Referer中链接的Origin部分可得知请求的来源域名
- Samesite Cookie：为Set-Cookie响应头新增Samesite属性，标明这个Cookie是个“同站 Cookie”，同站Cookie只能作为第一方Cookie，不能作为第三方Cookie
  - Samesite=Strict: 严格模式，表明该Cookie 在任何情况下都不可能作为第三方 Cookie，浏览器在任何跨域请求中都不会携带Cookie
  - Samesite=Lax: 宽松模式，假如是GET请求，则该Cookie可作为第三方Cookie，其他网站通过页面跳转过来时可使用Cookie
- CSRF Token：服务器下发一个随机 Token（算法不能复杂），每次发起请求时将 Token 携带上，服务器验证 Token 是否有效
  - 服务器给打开页面的用户生成一个Token
  - 页面提交的请求携带这个Token
  - 服务器验证Token是否正确
- 双重Cookie验证：利用CSRF攻击不能获取到用户Cookie的特点，要求Ajax和表单请求携带一个Cookie中的值
  - 用户访问网站页面时，向请求域名注入一个Cookie，内容为随机字符串
  - 前端向后端发起请求时，取出Cookie，并添加到URL的参数中
  - 后端接口验证Cookie中的字段与URL参数中的字段是否一致，不一致则拒绝

## 🚨点击劫持

- 定义：界面伪装攻击，攻击者一般通过透明的iframe（目标网站），覆盖在攻击者的网页上，并诱导用户进行操作。一般会利用XSS或CSRF漏洞来进行攻击。
- 应对：
  - 设置`X-Frame-Options` HTTP 响应头，防止网页被iframe加载
    - `deny`：拒绝当前页面加载任何frame页面
    - `sameorigin`：frame页面的地址只能为同源域名下的页面
    - `allow-from uri`：允许frame加载的页面地址
  - 使用CSP(Content Security Policy)内容安全策略

## 🔆HTTP劫持

- 定义：由于http明文传输，运营商可能会修改内存缓存池中http响应内容
- 分类
  - 类似DNS劫持返回302让用户浏览器跳转到另外的地址
  - 在服务器返回的HTML数据中插入js或dom节点
- 应对：全站HTTPS，将HTTP加密，这使得运营商无法获取明文。注意一点，非全站HTTPS并不安全

## 🔯中间人攻击

> 混合内容：：初始`HTML`内容通过安全的`HTTPS`连接加载，但其他资源（如图像、视频、样式表、脚本）则通过不安全的`HTTP`连接加载。混合内容会降低 HTTPS 的安全性
>
> - 被动混合内容：不与页面其余部分进行交互的内容，从而使中间人攻击在拦截或更改该内容时能够执行的操作受限
> - 主动混合内容：作为整体与页面进行交互，几乎允许攻击者对页面进行任何操作

- 定义：中间人攻击(man-in-the-middle attack, aka MitM)，即在消息发出方和接收方之间拦截双方通讯，进行数据篡改和嗅探，而通信的双方毫不知情。问题的根源在于 A 无法确认收到的公钥是否由 B 方创建

![avatar](https://user-gold-cdn.xitu.io/2019/1/20/16869e02ddf801cf?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 应对：增加一个安全通道来传输信息。需要 “数字证书” 系统来验证公钥的所有者，一般数字证书认证机构（Certificate Authority）称之为 CA

![avatar](https://user-gold-cdn.xitu.io/2019/1/21/1687111918a61d13?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
