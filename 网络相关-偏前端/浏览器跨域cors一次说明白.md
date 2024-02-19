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

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/64b9eb90-1f22-403a-a7b5-c2d9194ba610)
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
