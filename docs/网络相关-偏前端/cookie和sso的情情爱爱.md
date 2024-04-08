# **cookie和sso的情情爱爱**

---------------------

## 背景故事

几天前和一位小兄弟聊面试的时候他说起遇到的一个面试官。

- 面试官：你在你的项目里做的登录和注册，太简单了，有负责其他的吗？
- 小兄弟：额。。。

本来没啥问题，但是我并不觉得登录是一个很简单的事情，所以在聊到这里的时候，我说登录并不简单，比如：然后我问了一句，你知道如何实现 a.abc.com 和 b.abc.com 的跨子域登录状态保持吗？

- 小兄弟： 额。。。

所以我们就来埋一埋这个坑~😎

## cookie是什么？

关于cookie，MDN是这么解释的：
>Cookie 就是访问者在访问网站后留下的一个信息片段。Cookie 用于个性化用户的体验。可能包含用户在访问网站时的参数或输入。用户可以自定义浏览器来接受，拒绝或删除 Cookie。

[WIKI](https://en.wikipedia.org/wiki/HTTP_cookie)上大概把 cookie 分为三类：

- HTTP cookies
  <span style="color: rgb(155,155,155);font-size: 14px">HTTP Cookie（也称为网络 Cookie、互联网 Cookie、浏览器 Cookie 或简称 Cookie）是用户浏览网站时由网络服务器创建的小块数据，并由用户的 Web 浏览器放置在用户的计算机或其他设备上。Cookie 放置在用于访问网站的设备上，并且在会话期间可能会在用户的设备上放置多个 Cookie。Cookie 在网络上提供有用的功能，有时甚至是基本功能。它们使 Web 服务器能够在用户的设备上存储有状态信息（例如添加到在线商店购物车中的项目）或跟踪用户的浏览活动（包括单击特定按钮、登录或记录过去访问过的页面）。它们还可用于保存用户以前在表单字段中输入的信息（如姓名、地址、密码和支付卡号）以供后续使用。</span>
- Authentication cookies
  <span style="color: rgb(155,155,155);font-size: 14px">Web 服务器通常使用身份验证 Cookie 来验证用户是否已登录以及他们使用哪个帐户登录。如果没有 cookie，用户将需要通过登录包含他们希望访问的敏感信息的每个页面来验证自己。认证 Cookie 的安全性通常取决于发布网站和用户网络浏览器的安全性，以及 Cookie 数据是否加密。安全漏洞可能允许攻击者读取 Cookie 的数据，用于访问用户数据，或用于访问（使用用户的凭据）访问 Cookie 所属的网站（有关示例，请参阅跨站点脚本和跨站点请求伪造）。</span>
- Tracking cookies
  <span style="color: rgb(155, 155, 155);font-size:14px">跟踪cookie，尤其是第三方跟踪cookie，通常被用作编译个人浏览历史长期记录的方法 - 这是一个潜在的隐私问题，促使欧洲 [3] 和美国立法者在2011年采取行动。 [4] [5] 欧洲法律要求所有针对欧盟成员国的网站在将非必要的cookie存储在其设备上之前，必须获得用户的“知情同意”。</span>

[WIKI](https://en.wikipedia.org/wiki/HTTP_cookie)上能看到cookie的前世今生。

## cookie如何工作的？

1. 服务器通过HTTP响应头将Cookie信息发送给客户端（浏览器）。
2. 浏览器将Cookie信息保存在本地。
3. 每次浏览器向服务器发送请求时，都会将Cookie信息通过HTTP请求头发送给服务器。

前端设置cookie

```javascript
document.cookie = "name=value; expires=date; path=path; domain=domain; secure";
```

前端获取cookie

```javascript
const cookie = document.cookie;
```

前端删除cookie(注意expires为过去的时间，其实是让cookie过期)

```javascript
document.cookie = "name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
```

### 😎举个列子

我们可以在浏览器控制台中敲入以下代码

```javascript
document.cookie = `access-token=123;expires=Tue, 19 Jan 2038 03:14:07 GMT;path=/;`
```

然后进入到 Application 中去查看

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/6e3e3fb6-34a1-4efc-9905-09caac22d483)

可以看到cookie有很多属性，下面我画个表简单介绍一下(Partition Key 和 Priority 不是 cookie 的标准属性，估计是chrome的自定义属性)

|属性名|定义的行为|
|---------------|----------------|
|Name|Cookie的名称。它用于在存储和获取Cookie时进行识别。|
|Value|Cookie的值。它可以是任意字符串，用于存储相关数据。|
|Expires|Cookie的过期时间。它指定了Cookie何时过期。可以使用expires字段来设置过期时间的日期和时间。|
|Max-Age|指定Cookie的最大生命周期，以秒为单位。相对于Expires字段，Max-Age是一个相对值，表示Cookie将在指定秒数后过期。|
|Domain|指定可以访问Cookie的域名。默认情况下，Cookie只在设置它的域名和子域名下可见指定可以访问Cookie的域名。默认情况下，Cookie只在设置它的域名和子域名下可见。|
|Path|指定可以访问Cookie的路径。默认情况下，Cookie只在设置它的路径及其子路径下可见。|
|Secure|指示Cookie是否只能通过HTTPS传输。当Secure字段被设置为true时，Cookie将只在安全连接下传输（HTTPS）。|
|HttpOnly|指示Cookie是否只能通过HTTP来访问。当HttpOnly字段被设置为true时，JavaScript无法访问该Cookie，这有助于防止某些形式的跨站点脚本攻击。|
|SameSite|用于控制Cookie的跨站点行为。它可以帮助防止某些安全攻击，特别是跨站点请求伪造（CSRF）攻击。|

注意Domain这个属性，这就是咱们这次用来填坑的东西，要实现 a.abc.com 和 b.abc.com 的登录状态保持，就是通过设置 cookie 中的 domain 来实现的。

```javascript
document.cookie = `access-token=123;expires=Tue, 19 Jan 2038 03:14:07 GMT;path=/;domain=.abc.com;`
```

这样便可以实现啦！当然了现实业务中，cookie 一般由后端设置，而后端设置的原理则是通过设置回复响应头实现的```Set-Cookie: access-token=123; Max-Age=3600; Domain=.abc.com```

这里我用expressjs来举个栗子~😎

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.cookie('name', 'value', { 
    maxAge: 3600000, // 设置Cookie的有效期为一小时
    httpOnly: true, // 设置只能通过HTTP访问Cookie，禁止客户端的JavaScript访问
    secure: true, // 设置Cookie只能通过HTTPS传输
  });
  res.send('Hello');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

需要特别注意的是，可能后端设置了，但并不会真正设置上，这是因为浏览器对于后端设置 cookie 有一定的限制，前端也需要配合，https协议下会简单一些，但特别当是跨域请求的时候，后端需要设置```Access-Control-Allow-Credentials``` 请求头，以允许 cookie 的发送，并且前端的请求需要设置```credentials: 'include' // 需为include或same-origin才能通过 cookie 的设置，否则后端设置 cookie 不会生效！！！```

---------------------

*当你在公司项目中使用cookie来做登录状态等验证的时候，一定要考虑到安全问题哈！比如做一些对称加密的措施，而且敏感信息要避免出现在cookie中，切记切记！*

## SSO(Single sign-on)

对于单点登录，WIKI是这么说的(已翻译)：
>单点登录 （SSO） 是一种身份验证方案，允许用户使用单个 ID 登录到多个相关但独立的软件系统中的任何一个。不应将其与同点登录（目录服务器身份验证）混淆，后者通常通过使用轻量级目录访问协议 （LDAP） 并将 LDAP 数据库存储在（目录）服务器上来完成。可以使用 Cookie 通过 IP 网络实现简单版本的单点登录，但前提是站点共享一个公共 DNS 父域。

### sso是如何工作的？

- 用户（User）：具有身份验证需求的实体。
- 身份提供者（Identity Provider，IdP）：负责认证用户的身份并生成令牌（Token）。也被称为身份验证服务提供商（Authentication Service Provider）。
- 服务提供者（Service Provider，SP）：提供需要用户身份验证的应用程序或服务，依赖SSO系统进行用户身份验证。

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/a188c148-353c-427f-8fd6-904b7ed3627c)

可以这么说，cookie 仅仅是可以用来实现一个非常简单的 SSO，且最好只用来实现跨子域的SSO，如果提供三方，则会受到一些客户端安全策略的影响而导致失效。

SSO 单点登录的实现方式，和单节点的负载均衡的方式非常相似。

IdP 提供给客户端（App1，App2，App3）用户登录方式，比如用户在App1登录，IdP 提供商会返回一个 Authentication 的令牌给客户端（App1），而当用户在另一个客户端（App2）登录时也是到 IdP 提供商那里去询问用户登录状态，如果是激活状态，则也返回令牌用于在 App2 中交互使用。

SSO 的实现，更多是偏向架构的思考，各位可以通过
Taina Teravainen 大佬关于[SSO的文章](https://www.techtarget.com/searchsecurity/definition/single-sign-on)了解更多。
