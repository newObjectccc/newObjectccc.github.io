#

## 🔥前端应该知道的curl请求bash工具

一次我和同事交谈的过程中，我发现大家很少用除了浏览器以外的其他工具或平台发起请求，但是其实在开发中，知道更多的请求方式绝对是有实实在在益处的，它能帮你提高开发效率，**至少能帮给你带来和后端口舌的优势~**😂

下面我就简单介绍一下在 `bash` 中的 `curl` 如何发起请求~

文章开头我会对 `curl` 命令先逐行注释，文章末尾再举一些简单请求的例子代码~

here we go！

### 正文开始👉

------------------------------------------------

看之前你需要知道一点点前置知识：

一般一个 `-` 通常代表这是一个入参的简写，两个 `--` 通常代表详细的书写，也就是说下面的文档里，`-` 是下面最近的 `--` 的简写，
举个栗子🌰：

`-a` 就可以代替以下的入参：

- `--append`
- `--aws-sigv4`
- `--basic`
- `--ca-native`
- `--cacert`
- `--capath`

----------------------------------------------------------------

#### 🔥curl 的使用文档（注释不易，且行且珍惜🤤）

- 使用：curl [options...] `<url>`

  *--abstract-unix-socket `<path>` 通过抽象Unix域套接字进行连接<br>
  --alt-svc `<file name>` 启用具有此缓存文件的alt-svc<br>
  --anyauth 选择任意身份验证方法*
  
- -a,

  *--append 上传时将内容附加到目标文件<br>
  --aws-sigv4 `<provider1[:provider2[:region[:service]]]>` 使用AWS V4签名验证<br>
  --basic 使用HTTP基本身份验证<br>
  --ca-native 使用本地操作系统中的CA证书<br>
  --cacert `<file>` 使用此CA证书验证对等体<br>
  --capath `<dir>` 使用此CA目录验证对等体*

- -E,

  *--cert `<certificate[:password]>` 客户端证书文件和密码<br>
  --cert-status 验证服务器证书的状态通过OCSP-staple<br>
  --cert-type `<type>` 证书类型(DER/PEM/ENG/P12)<br>
  --ciphers `<list of ciphers>` 使用的SSL密码<br>
  --compressed 请求压缩响应 --compressed-ssh 启用SSH压缩*
  
- -K,

  *--config `<file>` 从文件中读取配置<br>
  --connect-timeout `<fractional seconds>` 连接的最大时间<br>
  --connect-to HOST1:PORT1:HOST2:PORT2 连接到主机*
  
- -C,
  
  *--continue-at `<offset>` 恢复传输偏移量*

- -b,
  
  *--cookie `<data|filename>` 从字符串/文件发送cookie*
  
- -c,
  
  *--cookie-jar `<filename>` 在操作后将cookie写入文件<br>
  --create-dirs 创建必要的本地目录层次结构<br>
  --create-file-mode `<mode>` 创建的文件的文件模式<br>
  --crlf 在上传时将LF转换为CRLF<br>
  --crlfile `<file>` 使用此CRL列表<br>
  --curves `<algorithm list>` (EC)请求的TLS密钥交换算法*
  
- -d,
  
  *--data `<data>` HTTP POST数据<br>
  --data-ascii `<data>` HTTP POST ASCII数据<br>
  --data-binary `<data>` HTTP POST二进制数据<br>
  --data-raw `<data>` HTTP POST数据，'@'允许<br>
  --data-urlencode `<data>` HTTP POST数据URL编码<br>
  --delegation `<LEVEL>` GSS-API委托权限<br>
  --digest 使用HTTP摘要身份验证*
  
- -q,
  
  *--disable 禁用 .curlrc<br>
  --disable-eprt 禁用EPRT或LPRT的使用<br>
  --disable-epsv 禁用EPSV的使用<br>
  --disallow-username-in-url 不允许URL中的用户名<br>
  --dns-interface `<interface>` 用于DNS请求的接口<br>
  --dns-ipv4-addr `<address>` 用于DNS请求的IPv4地址<br>
  --dns-ipv6-addr `<address>` 用于DNS请求的IPv6地址<br>
  --dns-servers `<addresses>` DNS服务器地址<br>
  --doh-cert-status 通过OCSP-staple验证DoH服务器证书的状态<br>
  --doh-insecure 允许不安全的DoH服务器连接<br>
  --doh-url `<URL>` 通过DoH解析主机名*
  
- -D,
  
  *--dump-header `<filename>` 将接收到的头写入`<filename>`<br>
  --egd-file `<file>` 用于随机数据的EGD套接字路径<br>
  --engine `<name>` 使用的加密引擎<br>
  --etag-compare `<file>` 将文件中的ETag作为自定义头部传递<br>
  --etag-save `<file>` 从请求中解析ETag并保存到文件中<br>
  --expect100-timeout `<seconds>` 等待100-continue的最长时间*
  
- -f,
  
  *--fail 在HTTP错误时立即终止并且没有输出<br>
  --fail-early 在第一个传输错误时终止，不继续<br>
  --fail-with-body 在HTTP错误但保存正文<br>
  --false-start 启用TLS False Start*
  
- -F,
  
  *--form `<name=content>` 指定多部分MIME数据<br>
  --form-escape 使用反斜杠转义多部分表单字段/文件名<br>
  --form-string `<name=string>` 指定多部分MIME数据<br>
  --ftp-account `<data>` 帐号数据字符串<br>
  --ftp-alternative-to-user `<command>` 用于替代USER `[name]`的字符串<br>
  --ftp-create-dirs 如果不存在则创建远程目录<br>
  --ftp-method `<method>` 控制CWD使用<br>
  --ftp-pasv 使用PASV/EPSV而不是PORT*
  
- -P,
  
  *--ftp-port `<address>` 使用PORT而不是PASV<br>
  --ftp-pret 在PASV之前发送PRET<br>
  --ftp-skip-pasv-ip 跳过PASV的IP地址<br>
  --ftp-ssl-ccc 在身份验证后发送CCC<br>
  --ftp-ssl-ccc-mode `<active/passive>` 设置CCC模式<br>
  --ftp-ssl-control 要求FTP登录时使用SSL/TLS；传输时清楚*
  
- -G,
  
  *--get 将POST数据放入URL并使用GET*
  
- -g,
  
  *--globoff 禁用使用{}和[]的URL序列和范围<br>
  --happy-eyeballs-timeout-ms `<milliseconds>` 尝试IPv6之前的时间<br>
  --haproxy-clientip 在HAProxy PROXY协议v1头中设置客户端IP<br>
  --haproxy-protocol 发送HAProxy PROXY协议v1头*
  
- -I,
  
  *--head 只显示文档信息*
  
- -H,
  
  *--header header/@file 将自定义头部传递给服务器*
  
- -h,
  
  *--help `<category>` 获取命令的帮助<br>
  --hostpubmd5 `<md5>` 可接受的主机公钥的MD5哈希<br>
  --hostpubsha256 `<sha256>` 可接受的主机公钥的SHA256哈希<br>
  --hsts `<file name>` 使用此缓存文件启用HSTS<br>
  --http0.9 允许 HTTP 0.9 响应*
  
- -0,
  
  *--http1.0 使用 HTTP 1.0<br>
  --http1.1 使用 HTTP 1.1<br>
  --http2 使用 HTTP/2<br>
  --http2-prior-knowledge 使用 HTTP 2，而不是 HTTP/1.1 升级<br>
  --http3 使用 HTTP v3<br>
  --http3-only 仅使用 HTTP v3<br>
  --ignore-content-length 忽略远程资源的大小*
  
- -i,
  
  *--include 在输出中包含协议响应头部*
  
- -k,
  
  *--insecure 允许不安全的服务器连接<br>
  --interface `<name>` 使用网络界面（或地址）<br>
  --ipfs-gateway `<URL>` IPFS的网关*
  
- -4,
  
  *--ipv4 将名称解析为IPv4地址*
  
- -6,
  
  *--ipv6 将名称解析为IPv6地址<br>
  --json `<data>` HTTP POST JSON*
  
- -j,
  
  *--junk-session-cookies 忽略从文件中读取的会话cookie<br>
  --keepalive-time `<seconds>` 保持连接活动的时间间隔<br>
  --key `<key>` 私钥文件名<br>
  --key-type `<type>` 私钥文件类型(DER/PEM/ENG)<br>
  --krb `<level>` 启用Kerberos，使用的安全级别<br>
  --libcurl `<file>` 将此命令行的等效libcurl代码转储到此文件<br>
  --limit-rate `<speed>` 限制传输速度为速率*
  
- -l,
  
  *--list-only 仅列表模式<br>
  --local-port `<num/range>` 强制使用RANGE进行本地端口号*

- -L,
  
  *--location 跟随重定向<br>
  --location-trusted 类似于--location，并将身份验证发送到其他主机<br>
  --login-options `<options>` 服务器登录选项<br>
  --mail-auth `<address>` 原始电子邮件的发件人地址<br>
  --mail-from `<address>` 发送邮件给该地址<br>
  --mail-rcpt `<address>` 发送邮件到该地址<br>
  --mail-rcpt-allowfails 允许某些收件人的RCPT TO命令失败*
  
- -M,
  
  *--manual 显示完整手册<br>
  --max-filesize `<bytes>` 下载的最大文件大小<br>
  --max-redirs `<num>` 允许的最大重定向次数*
  
- -m,
  
  *--max-time `<fractional seconds>` 传输的最大时间<br>
  --metalink 将给定的URL视为metalink XML文件<br>
  --negotiate 使用HTTP Negotiate (SPNEGO)身份验证*
  
- -n,
  
  *--netrc 读取 .netrc 获取用户名和密码<br>
  --netrc-file `<filename>` 指定用于netrc的文件<br>
  --netrc-optional 使用 .netrc 或 URL -:,<br>
  --next 使下一个URL使用其单独的选项集<br>
  --no-alpn 禁用ALPN TLS扩展*
  
- -N,
  
  *--no-buffer 禁用输出流的缓冲<br>
  --no-clobber 不覆盖已存在的文件<br>
  --no-keepalive 禁用连接上的TCP keepalive<br>
  --no-npn 禁用NPN TLS扩展<br>
  --no-progress-meter 不显示进度条<br>
  --no-sessionid 禁用SSL会话ID重用<br>
  --noproxy `<no-proxy-list>` 不使用代理的主机列表<br>
  --ntlm 使用HTTP NTLM身份验证<br>
  --ntlm-wb 使用带有Winbind的HTTP NTLM身份验证<br>
  --oauth2-bearer `<token>` OAuth 2 Bearer Token*
  
- -o,
  
  *--output `<file>` 将输出写入文件而不是标准输出<br>
  --output-dir `<dir>` 文件保存目录*
  
- -Z,
  
  *--parallel 并行执行传输<br>
  --parallel-immediate 不等待多路复用（使用--parallel）<br>
  --parallel-max `<num>` 并行传输的最大并发数<br>
  --pass `<phrase>` 私钥的密码<br>
  --path-as-is 不压缩URL路径中的..序列<br>
  --pinnedpubkey `<hashes>` FILE/HASHES 用于验证对等体的公钥<br>
  --post301 不在跟踪301之后切换到GET<br>
  --post302 不在跟踪302之后切换到GET<br>
  --post303 不在跟踪303之后切换到GET<br>
  --preproxy `[protocol://]host[:port]` 首先使用此代理*
  
- -#,
  
  *--progress-bar 显示传输进度条<br>
  --proto `<protocols>` 启用/禁用协议<br>
  --proto-default `<protocol>` 为缺少协议的任何URL使用协议<br>
  --proto-redir `<protocols>` 在重定向上启用/禁用协议*
  
- -x,
  
  *--proxy `[protocol://]host[:port]` 使用此代理<br>
  --proxy-anyauth 选择任意代理身份验证方法<br>
  --proxy-basic 在代理上使用基本身份验证<br>
  --proxy-ca-native 使用本地操作系统中的CA证书验证代理<br>
  --proxy-cacert `<file>` 使用此CA证书验证代理对等体<br>
  --proxy-capath `<dir>` 使用此CA目录验证代理对等体<br>
  --proxy-cert `<cert[:passwd]>` 为HTTPS代理设置客户端证书<br>
  --proxy-cert-type `<type>` 用于HTTPS代理的客户端证书类型<br>
  --proxy-ciphers `<list>` 用于代理的SSL密码<br>
  --proxy-crlfile `<file>` 设置代理的CRL列表<br>
  --proxy-digest 在代理上使用摘要身份验证<br>
  --proxy-header header/@file 将自定义头部传递给代理<br>
  --proxy-http2 使用HTTPS代理的HTTP/2<br>
  --proxy-insecure 在不验证代理的情况下进行HTTPS代理连接<br>
  --proxy-key `<key>` HTTPS代理的私钥<br>
  --proxy-key-type `<type>` HTTPS代理的私钥文件类型<br>
  --proxy-negotiate 在代理上使用HTTP Negotiate (SPNEGO)身份验证<br>
  --proxy-ntlm 在代理上使用NTLM身份验证<br>
  --proxy-pass `<phrase>` HTTPS代理的私钥密码<br>
  --proxy-pinnedpubkey `<hashes>` FILE/HASHES 用于验证代理的公钥<br>
  --proxy-service-name `<name>` SPNEGO代理服务名称<br>
  --proxy-ssl-allow-beast 允许HTTPS代理上的安全漏洞<br>
  --proxy-ssl-auto-client-cert 使用自动客户端证书代理(Schannel)<br>
  --proxy-tls13-ciphers `<ciphersuite list>` TLS 1.3代理密码套件<br>
  --proxy-tlsauthtype `<type>` HTTPS代理的TLS身份验证类型<br>
  --proxy-tlspassword `<string>` HTTPS代理的TLS密码<br>
  --proxy-tlsuser `<name>` HTTPS代理的TLS用户名<br>
  --proxy-tlsv1 使用TLSv1连接到HTTPS代理*
  
- -U,

  *--proxy-user user:password 代理用户和密码<br>
  --proxy1.0 `<host[:port]>` 使用给定端口上的HTTP/1.0代理*
  
- -p,
  
  *--proxytunnel 通过HTTP代理隧道操作（使用CONNECT）<br>
  --pubkey `<key>` SSH公钥文件名*
  
- -Q,
  
  *--quote `<command>` 在传输前向服务器发送命令<br>
  --random-file `<file>` 从文件中读取随机数据*
  
- -r,
  
  *--range `<range>` 仅获取范围内的字节<br>
  --rate `<max request rate>` 串行传输的请求速率<br>
  --raw 执行HTTP "raw"，不进行传输解码*
  
- -e,
  
  *--referer `<URL>` 引用链接*
  
- -J,
  
  *--remote-header-name 使用头文件提供的文件名*

- -O,
  
  *--remote-name 将输出写入命名为远程文件的文件<br>
  --remote-name-all 对所有URL使用远程文件名*
  
- -R,
  
  *--remote-time 设置本地输出的远程文件的时间<br>
  --remove-on-error 在出现错误时删除输出文件*
  
- -X,
  
  *--request `<method>` 指定要使用的请求方法<br>
  --request-target `<path>` 指定此请求的目标<br>
  --resolve `<[+]host:port:addr[,addr]...>` 将主机+端口解析为此地址<br>
  --retry `<num>` 在遇到临时问题时重试请求<br>
  --retry-all-errors 重试所有错误（与--retry一起使用）<br>
  --retry-connrefused 在遇到连接被拒绝时重试（与--retry一起使用）<br>
  --retry-delay `<seconds>` 重试之间的等待时间<br>
  --retry-max-time `<seconds>` 仅在此时间段内重试<br>
  --sasl-authzid `<identity>` SASL PLAIN身份验证的身份<br>
  --sasl-ir 启用SASL身份验证的初始响应<br>
  --service-name `<name>` SPNEGO服务名称*
  
- -S,
  
  *--show-error 甚至在使用-s时显示错误*
  
- -s,
  
  *--silent 静默模式<br>
  --socks4 `<host[:port]>` 使用给定主机+端口的SOCKS4代理<br>
  --socks4a `<host[:port]>` 使用给定主机+端口的SOCKS4a代理<br>
  --socks5 `<host[:port]>` 使用给定主机+端口的SOCKS5代理<br>
  --socks5-basic 为SOCKS5代理启用用户名/密码身份验证<br>
  --socks5-gssapi 为SOCKS5代理启用GSS-API身份验证<br>
  --socks5-gssapi-nec 兼容NEC SOCKS5服务器<br>
  --socks5-gssapi-service `<name>` SOCKS5代理的GSS-API服务名称<br>
  --socks5-hostname `<host[:port]>` SOCKS5代理，将主机名传递给代理*
  
- -Y,
  
  *--speed-limit `<speed>` 停止比此速度慢的传输*
  
- -y,
  
  *--speed-time `<seconds>` 在此时间后触发 'speed-limit' 中止 --ssl 尝试SSL/TLS<br>
  --ssl-allow-beast 允许改进互操作性的安全漏洞<br>
  --ssl-auto-client-cert 使用自动客户端证书（Schannel）<br>
  --ssl-no-revoke 禁用证书吊销检查（Schannel）<br>
  --ssl-reqd 要求SSL/TLS<br>
  --ssl-revoke-best-effort 忽略缺少/离线证书CRL分发点（Schannel）*
  
- -2,
  
  *--sslv2 使用SSLv2*
  
- -3,
  
  *--sslv3 使用SSLv3<br>
  --stderr `<file>` 将stderr重定向到文件<br>
  --styled-output 启用HTTP头部的样式化输出<br>
  --suppress-connect-headers 忽略代理CONNECT响应头部<br>
  --tcp-fastopen 使用TCP Fast Open<br>
  --tcp-nodelay 使用TCP_NODELAY选项*
  
- -t,
  
  *--telnet-option <opt=val> 设置telnet选项<br>
  --tftp-blksize `<value>` 设置TFTP BLKSIZE选项<br>
  --tftp-no-options 不发送任何TFTP选项*
  
- -z,
  
  *--time-cond `<time>` 基于时间条件进行传输<br>
  --tls-max `<VERSION>` 设置允许的最大TLS版本<br>
  --tls13-ciphers `<ciphersuite list>` 使用的TLS 1.3密码套件<br>
  --tlsauthtype `<type>` TLS认证类型<br>
  --tlspassword `<string>` TLS密码<br>
  --tlsuser `<name>` TLS用户名*
  
- -1,
  
  *--tlsv1 使用TLSv1.0或更高版本<br>
  --tlsv1.0 使用TLSv1.0或更高版本<br>
  --tlsv1.1 使用TLSv1.1或更高版本<br>
  --tlsv1.2 使用TLSv1.2或更高版本<br>
  --tlsv1.3 使用TLSv1.3或更高版本<br>
  --tr-encoding 请求使用压缩传输编码<br>
  --trace `<file>` 将调试跟踪输出写入文件<br>
  --trace-ascii `<file>` 类似于--trace，但无十六进制输出<br>
  --trace-config `<string>` 在跟踪/详细输出中记录的详细信息<br>
  --trace-ids 将传输和连接标识符添加到跟踪/详细输出中<br>
  --trace-time 在跟踪/详细输出中添加时间戳<br>
  --unix-socket `<path>` 通过此Unix域套接字连接*
  
- -T,
  
  *--upload-file `<file>` 将本地文件传输到目标位置<br>
  --url `<url>` 要操作的URL<br>
  --url-query `<data>` 添加URL查询部分*
  
- -B,
  
  *--use-ascii 使用ASCII/文本传输*
  
- -u,
  
  *--user user:password 服务器用户名和密码*
  
- -A,
  
  *--user-agent `<name>` 发送User-Agent `<name>`到服务器<br>
  --variable <[%]name=text/@file> 设置变量*
  
- -v,
  
  *--verbose 使操作更冗长*
  
- -V,
  
  *--version 显示版本号并退出*
  
- -w,
  
  *--write-out `<format>` 完成后使用输出格式<br>
  --xattr 将元数据存储在扩展文件属性中*

#### 下面我们来试试 😎

文档太复杂太多了，那我们如何来 `c` `url`呢？2个 demo 你就明白啦~

- 我们给 `baidu.com` 发一个 `GET` 请求（注意一下 `windows` 系统只能用 `"` 来标记字符串哟~）

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/7860f3ff-fd14-4966-b781-22ec37d1ecde)

得到下图：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/dbfe00bd-0012-4fa4-acdb-45617ca8f001)

- 我们再给我本地项目的注册接口发一个 `POST` 请求

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/a0086802-2d61-4631-8693-cb02a0a43058)

得到下图：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/87321f3b-9923-4341-8ebc-36960dca95f9)

demo 就这俩吧~ 吃饭去~

------------------------------------------------

😊okk~
CURL 功能非常强大，随手就能发起请求，希望能够帮到各位，如有纰漏，欢迎指正~
