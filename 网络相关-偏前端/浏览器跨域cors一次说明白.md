# **浏览器跨域**

## 背景故事 📻

今天在和一位后端同学联调接口的时候，遇到跨域问题，我就去和后断沟通，让后端配置一下cors的配置，解决一下跨域问题，后来着到了后端以及运维无情的回怼：

我：xx，浏览器报跨域了，配置一下cors吧。
后端：小程序都能调用啊？这服务都上线了的，你那儿咋就不行了？

later...（此时后端同学应该去baidu了一下跨域的东西）

后端：你那边不能直接跨域请求是吧？我记得web端可以跨域请求啊

ps: 又经过了一顿bb，最终决定先配合我，但是后端同学配置了Access-Control-Allow-Origin: '*'，并没有生效，所以又找到了运维同学。

运维：前端调你的后端的服务报跨域了，那就该前端解决啊，前端调的你啊，前端跨域啊。

________________________

### 什么是CORS？📢

> 跨源资源共享（CORS，或通俗地译为跨域资源共享）是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其他源（域、协议或端口），使得浏览器允许这些源访问加载自己的资源。**跨源资源共享还通过一种机制来检查服务器是否会允许要发送的真实请求，该机制通过浏览器发起一个到服务器托管的跨源资源的“预检”请求。在预检中，浏览器发送的头中标示有 HTTP 方法和真实请求中会用到的头**。这是一段引文。
[1]:<https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORShttp://www.google.com>
________________________

### 什么是浏览器的同源策略呢？🏷️

>同源策略是一个重要的安全策略，它用于限制一个源的文档或者它加载的脚本如何能与另一个源的资源进行交互。
它能帮助阻隔恶意文档，减少可能被攻击的媒介。例如，它可以防止互联网上的恶意网站在浏览器中运行 JS 脚本，从第三方网络邮件服务（用户已登录）或公司内网（因没有公共 IP 地址而受到保护，不会被攻击者直接访问）读取数据，并将这些数据转发给攻击者。

________________________

### 什么又是源？源的定义？🏷️

>如果两个 URL 的协议、端口（如果有指定的话）和主机都相同的话，则这两个 URL 是同源的。这个方案也被称为“协议/主机/端口元组”，或者直接是“元组”。（“元组”是指一组项目构成的整体，具有双重/三重/四重/五重等通用形式。)

下表给出了与 URL ```http://store.company.com/dir/page.html``` 的源进行对比的示例：

|URL|结果|原因|
|------|------|------|
|```http://store.company.com/dir2/other.html```|同源|只有路径不同|
|```http://store.company.com/dir/inner/another.html```|同源|只有路径不同|
|```https://store.company.com/secure.html```|不同源|协议不同|
|```http://store.company.com:81/dir/etc.html```|不同源|端口不同（http默认80端口）|
|```http://news.company.com/dir/other.html```|不同源|主机不同|

________________________

### 介绍完上面这三个概念，我们再来看看CORS

正是因为浏览器同源策略的限制，cors才被应用来处理跨域资源共享的问题，他是一种基于HTTP头的机制，当我们涉及到跨域资源的请求时，比如我们发起一个跨域的POST复杂请求：

![Pre-flight](data:image/png;base64,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)
<span style="font-size:14px">可以看到如CORS的机制所说，浏览器先发起了一个OPTIONS请求，当这个OPTIONS请求成功返回了之后才会发起咱们的POST请求。</span>

##### 这里有几个知识点

1. 简单请求（需满足以下5个条件，但注意WebKit和Safari还有其他限制，不过多是对于部分Header值得限制）
   - [⭐️请求方法]
     - <span style="font-size:12px">GET</span>
     - <span style="font-size:12px">HEAD</span>
     - <span style="font-size:12px">POST</span>
   - [⭐️Header字段]
     - <span style="font-size:12px">Accept</span>
     - <span style="font-size:12px">Accept-Language</span>
     - <span style="font-size:12px">Content-Language</span>
     - <span style="font-size:12px">Content-Type</span>
     - <span style="font-size:12px">Range(只需简单的范围标头值。[不怕英文的话可以点击查看](https://fetch.spec.whatwg.org/#simple-range-header-value))</span>
   - [⭐️Content-Type头的值]
     - <span style="font-size:12px">text/plain</span>
     - <span style="font-size:12px">multipart/form-data</span>
     - <span style="font-size:12px">application/x-www-form-urlencoded</span>
   - [⭐XHR上传请求]
     - <span style="font-size:12px">由浏览器内置的XMLHttpRequest对象发出的，在返回的XMLHttpRequest.upload对象属性上没有注册任何事件监听器，即没有调用xhr.upload.addEventListener()</span>
   - [⭐请求中没有ReadableStream对象(fetch响应体中的body就是ReadableStream)]
      ![贴个图方便理解](data:image/png;base64,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)
2. 复杂请求（😎不满足简单请求的，当然就是复杂的咯~）
3. CORS预检请求(Preflight request)
   - [⭐️用于检查服务器是否支持CORS，它一般是用了以下几个头的OPTIONS请求]

      - <span style="font-size:12px">Access-Control-Request-Method</span>
      - <span style="font-size:12px">Access-Control-Request-Headers</span>
      - <span style="font-size:12px">Origin</span>
<span style="font-size:12px">比如下面这个</span>

```
OPTIONS /resource/foo
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: origin, x-requested-with
Origin: https://foo.bar.org
```

###### *这里有必要解答一个我曾经在面试中听到过的答案，```“简单请求不会涉及跨域，复杂请求才会跨域。”```但其实MDN说的很明白，他俩在CORS上的区别只是复杂请求会多一个预检请求的发送。*

________________________

### 该是实操的时候了😎

其实有很多方法解决同源策略带来的限制：

- jsonp
- 依赖webpack/vite等打包工具内部集成的反向代理
- 窗口消息传递(window.postMessage())
- cors(跨域资源共享)

以下我们简单通过Express来在服务端配置CORS

```bash
 pnpm add -S express
```

```javascript
// app.js

const express = require('express');

const app = express();

const corsMiddleware = (req, res, next) => {
  // 配置允许CORS的源
  res.header('Access-Control-Allow-Origin', '*');
  // 配置允许CORS的请求头
  res.header('Access-Control-Allow-Headers', '*');
  console.log('Cors middleware ===>')
  next()
}
// 在 '/' 路由上使用咱们定义的CORS中间件
app.use('/', corsMiddleware)
// 接收所有 '/' 路由的请求
app.all('/', (req, res) => {
  res.sendStatus(200)
})

app.listen(3000, () => {
  console.log('代理转发服务器已启动，监听端口 3000');
});
```

```bash
 node app.js
```

打开浏览器，在任何一个网站客户端下发起请求，可以是www.baidu.com可以是其他

```javascript
fetch("http://localhost:3000", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "content-type": "application/json;charset=UTF-8",
  },
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{}",
  "method": "POST",
  "mode": "cors",
}).then(res => console.log(res))

```

可以打开控制台看看，或者去到Network看看结果如何。

________________________

> 鲁迅说：既然说到这里了，就顺便再实现一个超级简单的Webpack或者Vite这类打包工具内置的反向代理吧。

*👉以下代码没有从源码参考哈
👉旨在帮大家了解Webpack/Vite的代理大概做了一些什么事情即可。*

```bash
pnpm add express http-proxy-middleware -S
```

```javascript
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express();

const proxyMiddleware = createProxyMiddleware({
  target: '你要转发的目标地址',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    }
  },
  // pathRewrite: {
  //   '^/api': '', // 但必须和app.use('/api')对应起来，因为是正则匹配
  // }
})

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next()
}

app.use('/', corsMiddleware, proxyMiddleware)

app.listen(3000, () => {
  console.log('代理转发服务器已启动，监听端口 3000');
});
```

🖥️自己继续去实验吧~
________________________

👉如果你要做真正CORS的转发，仅仅这几个CORS配置HTTP头是不够的，特别需要注意的是，比如在你需要传输cooike等身份验证相关的，都需要更多的设置。

> 📚在响应附带身份凭证的请求时：
比如：fetch的第二个参数中设置credentials: 'include'

- 服务器**不能**将 ```Access-Control-Allow-Origin``` 的值设为通配符“*”，而应将其设置为特定的域，如：```Access-Control-Allow-Origin: https://example.com```。
- 服务器**不能**将 ```Access-Control-Allow-Headers``` 的值设为通配符“*”，而应将其设置为标头名称的列表，如：```Access-Control-Allow-Headers: X-PINGOTHER, Content-Type```
- 服务器**不能**将 ```Access-Control-Allow-Methods``` 的值设为通配符“*”，而应将其设置为特定请求方法名称的列表，如：```Access-Control-Allow-Methods: POST, GET```

________________________

快要结尾了，谁还记得CORS是一个基于Http头的机制呢？再给大家贴一个CORS相关的Http头吧😄。

|Http Header (CORS)|作用|
|------|------|
|Access-Control-Allow-Origin|指示响应的资源是否可以被给定的来源共享|
|Access-Control-Allow-Credentials|指示当请求的凭证标记为 true 时，是否可以公开对该请求响应|
|Access-Control-Allow-Headers|用在对预检请求的响应中，指示实际的请求中可以使用哪些 HTTP 标头|
|Access-Control-Allow-Methods|指定对预检请求的响应中，哪些 HTTP 方法允许访问请求的资源|
|Access-Control-Expose-Headers|通过列出标头的名称，指示哪些标头可以作为响应的一部分公开|
|Access-Control-Max-Age|指示预检请求的结果能被缓存多久|
|Access-Control-Request-Headers|用于发起一个预检请求，告知服务器正式请求会使用哪些 HTTP 标头|
|Access-Control-Request-Method|用于发起一个预检请求，告知服务器正式请求会使用哪一种 HTTP 请求方法|
|Origin|指示获取资源的请求是从什么源发起的|
|Timing-Allow-Origin|指定特定的源，以允许其访问 Resource Timing API 功能提供的属性值，否则由于跨源限制，这些值将被报告为零|

👏👏👏👏👏CORS分享就到这儿吧👏👏👏👏👏

<span style="font-size:12px;color: #577590">
这里埋一个小坑，既然提到了cookie，当你深入后，你会发现，cookie似乎并不一定按照CORS的机制来~，咳咳，这个坑有机会咱们再埋~😎
</span>
