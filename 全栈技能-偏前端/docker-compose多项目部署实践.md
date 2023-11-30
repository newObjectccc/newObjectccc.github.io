#

## 🚀docker-compose多项目部署实践

相信有很多小伙伴有对 Docker 和 docker-compose 的部署有点疑惑，本文会以我自己的一个项目部署案例来讲述。

*这是我们的粗略架构*:

- ApiGateway也是用 Nestjs
- Nginx 做负载均衡
- 后端Services是用 Nestjs

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/602e3994-1e9a-4292-88d5-7de9bce4852b)

here we go！🚀

ps：以下是基于 docker-compose 哟，如果你没有 docker 和 docker-compose 的前置知识，请适当了解一下再看，不过相信我，就算你不熟悉，只要你会安装 docker 和 docker-compose 就可以。
![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/46e2d9d3-e0b2-461a-a124-a6883c4c9720)

### 正文开始👉

------------------------------------------------

#### 1. 首先在我们的后端项目根目录下创建 Dockerfile

```javascriptv
version: '3'
services:
  cqbackend:
    image: registry.cn-chengdu.aliyuncs.com/gitee-docker/cq-backend:latest
    ports:
      - '3000:3000'
    depends_on:
      - db
  cqbackend2:
    image: registry.cn-chengdu.aliyuncs.com/gitee-docker/cq-backend:latest
    ports:
      - '3001:3001'
    depends_on:
      - db
  cqbackend3:
    image: registry.cn-chengdu.aliyuncs.com/gitee-docker/cq-backend:latest
    ports:
      - '3002:3002'
    depends_on:
      - db
  cqbackend4:
    image: registry.cn-chengdu.aliyuncs.com/gitee-docker/cq-backend:latest
    ports:
      - '3003:3003'
    depends_on:
      - db
  nginx:
    image: nginx
    ports:
      - '81:81'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - cqapigateway
      - cqbackend
      - cqbackend2
      - cqbackend3
      - cqbackend4
  cqapigateway:
    image: registry.cn-chengdu.aliyuncs.com/gitee-docker/cq-apigateway:latest
    ports:
      - '80:80'
    depends_on:
      - cqbackend
  db:
    image: mysql:latest
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: kch_database
    volumes:
      - db-data:/var/lib/mysql
volumes:
  db-data:

```

------------------------------------------------

😊okk~ 赶紧去部署你的多应用吧~
