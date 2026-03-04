---
layout: home
hero:
  name: 择野少年
  text: AI 驱动的青少年教育平台
  tagline: 全栈 Next.js 教育 SaaS，涵盖活动管理、AI 工具矩阵、会员体系与微信生态集成，含 Admin 后台与 H5 移动端。
  image:
    src: /qyqm.png
    alt: 择野少年
  actions:
    - theme: brand
      text: H5 在线体验
      link: https://qyqmedu.com
      blank: true
    - theme: alt
      text: Admin 后台
      link: https://qyqmedu.com/admin
      blank: true
features:
  - title: AI 工具矩阵
    icon: <img width="36" src="https://api.iconify.design/fluent:bot-sparkle-24-filled.svg" alt="ai">
    details: 拍照解题（Gemini 3 视觉）、英语口语练习、知识点测验、AI PPT 生成、解谜游戏，全部带配额管理
  - title: 活动与报名管理
    icon: <img width="36" src="https://api.iconify.design/fluent:calendar-agenda-24-filled.svg" alt="events">
    details: 活动 CRUD、场地管理、讲师管理、报名表单、名额控制，支持会员免费报名权益
  - title: 会员体系
    icon: <img width="36" src="https://api.iconify.design/fluent:diamond-24-filled.svg" alt="member">
    details: 多等级会员、AI 功能配额分配、加油包购买、支付系统集成，Admin 可手动授予权益
  - title: 动态表单
    icon: <img width="36" src="https://api.iconify.design/fluent:form-multiple-24-filled.svg" alt="form">
    details: 拖拽式表单构建器，支持 8 种字段类型、有效期控制、名额上限、提交数据导出
  - title: 微信生态集成
    icon: <img width="36" src="https://api.iconify.design/simple-icons:wechat.svg" alt="wechat">
    details: 微信公众号管理、草稿箱、图文素材、群发/预览/发布，微信 OAuth 登录
  - title: Cassette Futurism 设计系统
    icon: <img width="36" src="https://api.iconify.design/fluent:phone-24-filled.svg" alt="h5">
    details: H5 端自研磁带未来主义风格，切角边框、CRT 扫描线、发光效果，科技感十足的移动端体验
  - title: RBAC 权限系统
    icon: <img width="36" src="https://api.iconify.design/fluent:shield-person-24-filled.svg" alt="rbac">
    details: 角色-资源-按钮级三级权限管理，HOF 中间件链实现路由级鉴权，Redis 缓存权限数据
  - title: 知识胶囊 & 测评
    icon: <img width="36" src="https://api.iconify.design/fluent:learning-app-24-filled.svg" alt="learn">
    details: 视频胶囊内容库（仅会员可见）、AI 辅助测评生成与评分，结果自动保存
  - title: 技术栈
    icon: <img width="36" src="https://api.iconify.design/devicon:nextjs.svg" alt="nextjs">
    details: Next.js 15 App Router · TypeScript · Prisma · PostgreSQL · Redis · LangGraph · AI SDK · Tailwind CSS v4 · shadcn/ui
---

## 项目介绍

**择野少年（QYQM）** 是一个面向青少年的教育 SaaS 平台，包含 **Admin 管理后台**和 **H5 移动端**两个前端界面，使用 Next.js App Router 全栈一体化开发。

### 核心功能模块

| 模块 | 描述 |
|------|------|
| AI 工具矩阵 | 拍照解题、英语口语、知识测验、AI PPT、解谜游戏，各功能独立配额 |
| 活动管理 | 活动/场地/讲师全生命周期，报名系统，名额控制，Excel 导出 |
| 会员体系 | 多等级会员，AI 使用配额，加油包，支付与权益记录 |
| 动态表单 | 可视化构建器，拖拽排序，8 种字段，二维码分享，提交数据管理 |
| 微信集成 | 公众号内容管理，OAuth 登录，素材库，群发与预览 |
| 权限系统 | 角色、菜单、按钮三级 RBAC，Redis 缓存，HOF 中间件 |
| 咨询预约 | 动态服务类型，时间窗口管理，用户预约流程 |
| 知识胶囊 | 视频内容库，会员专享，AI 辅助生成描述 |

### 技术亮点

- **Next.js App Router** 全栈架构，API 路由与前端同仓库，清晰的 DTO → Service → Route 分层
- **HOF 中间件链**：`withAdminAuth()` · `withValidation()` · `withErrorHandler()` 函数式组合
- **LangGraph + AI SDK** 双模式 AI 编排，工具调用支持多模态（Gemini 3 视觉）
- **Cassette Futurism** 自研 H5 设计系统，clip-path 切角 + CRT 扫描线 + 发光动效
- **Redis** 权限缓存、微信 Token 缓存，降低数据库压力
- **Prisma + PostgreSQL** 类型安全的数据层，完整迁移历史
- **OpenSpec** 变更规划工作流，大功能先写 Proposal 再实现

### AI 功能架构

```
lib/ai/
├── shared/        # 前后端通用：常量、类型、Assistant 配置
├── prompts/       # Prompt 模板独立管理
├── server/
│   ├── handlers/  # AI SDK 模式（新）：photo-solver, quiz, ppt...
│   ├── graphs/    # LangGraph 模式（渐进淘汰）
│   ├── tools/     # LangChain Tools
│   └── utils/     # LLM 工厂、消息转换、配额守卫
```

---

<img style="border: 1px solid #e5e7eb; border-radius: 12px; max-width: 375px; display: block; margin: 0 auto;" src="/qyqm.png" alt="择野少年截图">
