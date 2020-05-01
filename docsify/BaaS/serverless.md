# Serverless 初略

> Serverless：无服务器技术，是继虚拟机、容器之后的云计算第三代通用计算技术
>
> BFF（Backend For Frontend）：在微服务和前端中间的 BFF 层，可对接口进行聚合、裁剪后再输出给前端。作为当前 Node.js 在服务端较为广泛的应用

- 概念：Serverless 是一种构建和管理基于**微服务架构**的完整流程，不需服务器管理应用部署
- 特点：
  - 无运维：无需对服务器进行监控、配置、更新、扩容等运维操作
  - 无状态：每次函数执行可能使用的不同容器，无法进行内存或数据共享。共享数据只能通过 Redis、COS 等第三方服务
  - 低成本：按需调用、按需伸缩、按使用收费
  - 事件驱动：云函数在平台中需要通过事件来触发执行，如 HTTP 请求事件、文件上传/处理、消息事件、定时器事件、IoT 某个事件
- 应用场景：小程序、IoT（未来涉及）
- 技术方向
  - BaaS：Backend as a Service，后端即服务平台。后端、FaaS、前端都可通过对应 SDK/API 调用 BaaS 服务。如小程序云开发即直接在前端调用 BaaS 服务
    - CDB：云数据库
    - COS：云对象存储
    - CMQ：云消息队列
    - API：API 接口
    - Credis：云缓存
    - Log、Monito & Alert：日志、监控报警
  - FaaS：Function as a Service，函数即服务平台。触发器与平台自己的后端服务相关，使用相应的 SDK 或 API 来连接和调用 BaaS，**实现业务逻辑层**
    - BFF 实现：前端向 BFF 发起的请求是 FaaS 的一个 **HTTP 触发器**，触发函数的执行，实现针对该请求的业务逻辑，然后将处理结果返回给前端
    - SSR 实现：每个请求的 path 都对应服务端的每个路由，将路由都拆分为一个个函数，再在 FaaS 上部署。请求 path 对应的就是每个单独的函数
  - Webassembly（未来涉及）

![G4ynGd.jpg](https://s1.ax1x.com/2020/04/09/G4ynGd.jpg)

- 更多了解（`https://zhuanlan.zhihu.com/p/109428222`）
