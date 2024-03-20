# Caddy入门实践（written by go）

## 入门Caddy的从0到1

> 开源实践系列是为了记录笔者的每一个开源项目的实践过程，希望能给一些准备入门开源实践的小伙伴一些浅浅的帮助。

因为偶然间了解到Caddy，回想起被Nginx配置折磨的夜晚，我决定试试Caddy，试了之后，它真的我哭死！

1. 自动且免费的TLS，基于Let’s Encrypt 或 ZeroSSL（光是这一点，我就太推荐了）
2. 超级，超级，超级简单的配置（简单到离谱）
3. 可扩展的Plugin系统（超级强大的可扩展性，比如：fastcgi）

> [caddy官网](https://caddyserver.com/)

### 正文开始👉

为了试试caddy，再加上国内的原因，访问我的站点很不方便，所以我索性用vitepress迁移了我的站点，刚好了多了一篇素材。

----------------

#### 1. *先买个云服务器用于部署*📌

我自己是用的腾讯的轻量应用服务器：

图1

选购时需要注意以下2点：

1. 选择Ubuntu系统下预设Docker的版本，他会内置Docker和docker-compose，并且会设置腾讯镜像源，原因如下：
    - docker hub的使用想必不用我多说，非常折磨人，不配置源，构建经常可能失败。
    - 如果你按照我后续步骤搭建，那么最好使用和我相同的系统环境，有一定服务器折腾基础的同学除外。
2. 如果你不打算icp备案，那么请一定要购买香港或者国外的服务器，你不用太过担心延迟问题，并不会很离谱。

图2

#### 2. *准备服务器环境*

1. 进入服务器控制台，登录进去

图6

2. 在管理员权限下安装lua和nvm
    - 进入管理员权限

    ```bash
    sudo su
    ```

    - 更新apt

    ```bash
    sudo apt update
    ```

    - 安装lua5.3（用于执行lua脚本，因为我部署脚本是lua写的）

    ```bash
    sudo apt install lua5.3
    ```

    - 安装nvm（用于安装新版本node）

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
    ```

    - 应用一下环境变量

    ```bash
    source ~/.bashrc
    ```

    - 安装20版本的node（用户运行node服务）

    ```bash
    nvm install node --lts
    ```

    - 安装pm2（用于搭建cd服务）

    ```bash
    npm install -g pm2
    ```

#### 3. *再买个域名*📌

> [!TIP]
> 如果你在腾讯购买了服务器，请尽量不要到其他平台去购买域名，相对比较麻烦，特别当你想要进行icp备案等操作时。

图3

#### 4. *然后迁移到 Vitepress*📌

> [!TIP]
> 我必须迁移，而你可以直接根据[Vitepress官方文档](https://vitepress.dev/zh/)开始新项目。

1. 先创建package.json
    `npm init -y`
2. 安装glob和vitepress
    `pnpm add -D glob vitepress@latest`
3. 根据向导初始化vitepress
    `pnpm vitepress init`
4. 把所有文章都copy到docs
5. 把vitepress跑起来
    `pnpm docs:dev`

#### 5. *简单处理一下部署配置文件*📌

1. 部署配置
    - 我用的docker-compose来部署caddy服务器，docker-compose.yml配置如下：

    ```yml
    services:
    caddy:
        image: caddy:2.7.6-alpine
        restart: unless-stopped
        ports:
        - "80:80"
        - "443:443"
        - "443:443/udp"
        volumes:
        - ./Caddyfile:/etc/caddy/Caddyfile
        - ./docs/.vitepress/dist:/srv
        - caddy_data:/data
        - caddy_config:/config

    volumes:
    caddy_data:
    caddy_config:
    ```

2. Caddy服务器配置
    - 创建一个`Caddyfile`配置文件，配置如下：
    - 配置你的域名，这里我的是`vesper.host`
    - 配置你的服务器根文件路径，我在docker-compose里面已经把静态资源都配置了到了当前路径，所以直接默认就可以了`file_server`

    ```text
    vesper.host

    file_server
    ```

#### 6. *搞一个简单cicd流程*📌

1. 搞一个lua部署脚本

    ```lua
    #!/usr/bin/env lua

    local os = require("os")
    local repo_path = "~/newObjectccc.github.io"
    local repo_url = "https://github.com/newObjectccc/newObjectccc.github.io.git"

    if os.execute("cd " .. repo_path .. " 2>/dev/null") then
        -- 如果仓库存在，拉取最新的代码
        os.execute("cd " .. repo_path .. " && git pull origin main")
    else
        -- 如果仓库不存在，克隆仓库
        os.execute("git clone " .. repo_url .. " " .. repo_path)
    end

    os.execute("cd " .. repo_path .. " && npm install && npm run docs:build")
    os.execute("cd " .. repo_path .. " && docker-compose up -d")
    ```

2. 创建一个github workflow
    - 在项目根目录下新建`.github/workflows/deploy.yml`
    - 输入部署逻辑代码，如下（secrets.SECRET_KEY需要你在github仓库里设置）：

    ```yml

    name: Deploy

    on:
    push:
        branches:
        - main

    jobs:
    deploy:
        runs-on: ubuntu-latest

    steps:
        - name: Send deploy request
            run: curl -X POST -H "Content-Type application/json" 
                    -d '{"secretKey":"${{ secrets.SECRET_KEY}}"}' 
                    http://vesper.host:3000/deploy
    ```

3. 去github仓库创建环境变量SECRET_KEY
    - 设置一下`Name（key）`和`Secret（value）`即可

4. 服务器上新建一个node服务器用于cd流程
    - 创建一个项目文件夹

    ```bash
    mkdir deploy_server
    ```

    - 创建`package.json`

    ```bash
    npm init -y
    ```

    - 添加esm声明

    ```js
    {
        "name": "newobjectccc.github.io",
        "version": "1.0.0",
        "main": "index.js", // [!code focus]
        "type": "module",
    }
    ```

    - 创建 server.mjs

    ```js
    // server.mjs
    import { createServer } from 'http';
    import { exec } from 'child_process';

    const SECRET_KEY = 'your-secret-key';  // 替换成你自己的 secret key（github上那个）

    const server = createServer((req, res) => {
        if (req.url === '/deploy' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const postBody = JSON.parse(body);
                if (postBody.secretKey === SECRET_KEY) {
                    exec('lua ~/newObjectccc.github.io/deploy.lua', (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                        console.log(`stdout: ${stdout}`);
                        console.error(`stderr: ${stderr}`);
                    });
                    res.end('Deployment script has been executed.\n');
                } else {
                    res.end('Invalid secret key.\n');
                }
            });
        } else {
            res.end('Invalid request.\n');
        }
    });

    server.listen(3000, '0.0.0.0', () => {
        console.log('3000 listening!')
    });
    ```
