---
layout: home
hero:
  name: 成师
  text: TTT 学员打卡分享社区 PWA 应用
  tagline: 类 X(Twitter) 移动端社交应用，专为培训班学员打卡练习和分享交流设计。
  image:
    src: /chengshi-leaderboard.png
    alt: 成师
  actions:
    - theme: brand
      text: 在线体验
      link: https://chengshi.qyqmedu.com
      blank: true
features:
  - title: 信息流
    icon: <img width="36" src="https://api.iconify.design/fluent:feed-20-filled.svg" alt="feed">
    details: 学员发帖分享，支持文字/图片/音频/视频多媒体内容
  - title: 话题打卡
    icon: <img width="36" src="https://api.iconify.design/fluent:checkbox-checked-20-filled.svg" alt="checkin">
    details: 通过发帖关联话题完成打卡，自动记录连续天数，支持官方和用户自建话题
  - title: 社交互动
    icon: <img width="36" src="https://api.iconify.design/fluent:chat-bubbles-question-20-filled.svg" alt="social">
    details: 支持评论、点赞、@提及，温暖的「抱抱」与「摸摸头」互动方式
  - title: 排行榜
    icon: <img width="36" src="https://api.iconify.design/fluent:trophy-20-filled.svg" alt="leaderboard">
    details: 连续打卡排行榜、按话题打卡排行，激励学员持续坚持
  - title: PWA 支持
    icon: <img width="36" src="https://api.iconify.design/logos:pwa.svg" alt="pwa">
    details: 完整 PWA 体验，可安装到桌面，媲美原生 App 的使用感受
  - title: 技术栈
    icon: <img width="36" src="https://api.iconify.design/devicon:nextjs.svg" alt="nextjs">
    details: Next.js 15 · TypeScript · Prisma · PostgreSQL · Tailwind CSS v4 · shadcn/ui
---

## 项目介绍

**成师（Chengshi）** 是为 TTT（Train The Trainer）培训课程学员打造的打卡分享社区，界面风格类似 X(Twitter)，专为移动端设计并支持 PWA 安装。

### 核心功能

| 功能模块 | 描述 |
|----------|------|
| 信息流 | 学员发帖，支持文字、图片、音频、视频 |
| 话题系统 | #话题 关联打卡题目，支持官方和用户自建话题 |
| 打卡系统 | 通过发帖关联话题完成打卡，自动统计连续天数 |
| 互动系统 | 评论、点赞、@提及、抱抱、摸摸头 |
| 排行榜 | 连续打卡排行 & 话题维度排行 |
| 认证系统 | 邀请码注册 + 手机验证码/密码双登录方式 |

### 技术亮点

- **Next.js App Router** 全栈架构，API 路由与前端同仓库
- **HOF 中间件链**：`withAuth()` · `withBodyValidation()` · `withErrorHandler()` 组合鉴权与验证
- **Prisma + PostgreSQL** 数据层，类型安全的数据库操作
- **Tailwind CSS v4 + shadcn/ui** 现代组件化 UI
- **腾讯云 COS** 多媒体文件存储，短信验证码服务
- **PWA** 完整离线支持与桌面安装能力

---

<div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-top: 24px;">
  <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 280px;" src="/chengshi.png" alt="成师 - 信息流">
  <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 280px;" src="/chengshi-leaderboard.png" alt="成师 - 排行榜">
</div>
