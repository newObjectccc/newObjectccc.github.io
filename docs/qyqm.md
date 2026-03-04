---
layout: home
hero:
  name: 择野少年
  text: AI 驱动的青少年教育 SaaS 平台
  tagline: 涵盖 AI 工具矩阵、研学活动、测评体系、会员系统与微信生态集成，包含 H5 移动端与 Admin 后台两套前端界面。
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
    details: 拍照解题（Gemini 视觉）、英语口语练习（6大场景）、知识测验、编程思维拼图、AI 对话、学习打卡、成绩计算、升学指南，全部带配额管理
  - title: 研学活动管理
    icon: <img width="36" src="https://api.iconify.design/fluent:calendar-agenda-24-filled.svg" alt="events">
    details: 活动 CRUD、场地管理、讲师管理、报名表单、名额控制，支持会员专属活动与免费报名权益，在线报名 + 状态追踪
  - title: 测评档案系统
    icon: <img width="36" src="https://api.iconify.design/fluent:clipboard-pulse-24-filled.svg" alt="assessment">
    details: 学习测评（多元智能/16型特质）、自我探索（超能力发现器）、职业测评（RIASEC兴趣雷达）、性格测评，AI 辅助生成报告
  - title: 会员权益体系
    icon: <img width="36" src="https://api.iconify.design/fluent:diamond-24-filled.svg" alt="member">
    details: 执灯权益体系，AI 功能配额分配，加油包购买，Admin 可手动授予权益，会员专享内容 / 活动 / 测评
  - title: 知识胶囊
    icon: <img width="36" src="https://api.iconify.design/fluent:video-clip-24-filled.svg" alt="capsule">
    details: 会员专享短视频内容库，数学/物理/化学等学科知识点精讲，AI 辅助生成描述
  - title: 执灯内参
    icon: <img width="36" src="https://api.iconify.design/fluent:news-24-filled.svg" alt="articles">
    details: 面向家长的深度教育资讯，双减政策解读、升学攻略、教育白名单竞赛指南等优质内容
  - title: Cassette Futurism 设计系统
    icon: <img width="36" src="https://api.iconify.design/fluent:phone-24-filled.svg" alt="h5">
    details: 自研磁带未来主义风格，切角边框、CRT 扫描线、发光动效、橙色主题，科技感与复古感融合的独特移动端体验
  - title: Admin 后台
    icon: <img width="36" src="https://api.iconify.design/fluent:shield-person-24-filled.svg" alt="admin">
    details: 完整的内容管理后台，活动/讲师/场地/会员/动态表单/微信公众号/RBAC 权限全模块管理
  - title: 微信生态集成
    icon: <img width="36" src="https://api.iconify.design/simple-icons:wechat.svg" alt="wechat">
    details: 微信公众号管理、图文素材库、群发/预览/发布，微信 OAuth 登录，微信支付集成
---

## 项目介绍

**择野少年（QYQM）** 是一个面向青少年的教育 SaaS 平台，服务青少年生涯规划与教育探索，包含 **H5 移动端**与 **Admin 管理后台**两套前端界面，使用 Next.js App Router 全栈一体化开发。

### 核心功能模块

| 模块 | 描述 |
|------|------|
| AI 工具矩阵 | 拍照解题、英语口语(6场景)、知识测验、编程思维、AI对话、学习打卡等，各功能独立配额 |
| 研学活动管理 | 活动/场地/讲师全生命周期，在线报名，名额控制，Excel 导出 |
| 测评档案 | 学习/自我/职业/性格四类测评，AI 生成报告，结果持久化 |
| 会员体系 | 执灯权益，AI 配额，加油包，支付与权益记录 |
| 知识胶囊 | 短视频内容库，会员专享，学科精讲 |
| 往期相册 | 活动相册，Masonry 瀑布流展示 |
| 执灯内参 | 家长教育资讯文章 |
| 动态表单 | 可视化构建器，拖拽排序，8 种字段类型，二维码分享 |
| 微信集成 | 公众号内容管理，OAuth 登录，素材库，群发与预览 |
| RBAC 权限系统 | 角色-菜单-按钮三级权限，Redis 缓存，HOF 中间件 |
| 咨询预约 | 动态服务类型，时间窗口管理，用户预约流程 |

### 技术亮点

- **Next.js 15 App Router** 全栈架构，DTO → Service → Route 清晰分层
- **HOF 中间件链**：`withAdminAuth()` · `withValidation()` · `withErrorHandler()` 函数式组合
- **Gemini + AI SDK** 多模态 AI 能力，拍照解题支持数学/物理/化学/生物图片识别
- **LangGraph** AI 工具编排，复杂对话流程管理
- **Cassette Futurism** 自研 H5 设计系统，`clip-path` 切角 + CRT 扫描线 + 发光动效
- **Redis** 权限缓存、微信 Token 缓存，降低数据库压力
- **Prisma + PostgreSQL** 类型安全的数据层
- **OpenSpec** 变更规划工作流，大功能先写 Proposal 再实现
- **PWA** 支持，可安装到桌面

### AI 功能全景

```
AI 工具矩阵
├── 拍照解题     → Gemini Vision，上传图片 AI 解题（数学/物理/化学/生物）
├── 英语口语     → 6 大场景（餐厅/机场/求职/购物/看诊/自定义）AI 语音对话
├── 知识测验     → 选题 → AI 出题 → 作答 → AI 评分 + 知识点解析
├── 编程思维     → 流程图拼图（程序设计入门，AI 辅助提示）
├── AI 对话     → 苏格拉底式提问，思维训练
├── 学习打卡     → 打卡记录 + AI 激励
├── 成绩计算     → 分数换算工具
└── 升学指南     → AI 辅助升学建议
```

---

### 页面截图

<div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; margin-bottom: 24px;">
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">H5 首页</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm.png" alt="首页">
  </div>
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">研学活动</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-events.png" alt="研学活动">
  </div>
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">AI 工具矩阵</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-tools.png" alt="AI工具">
  </div>
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">测评档案</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-assessments.png" alt="测评">
  </div>
</div>

<div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">拍照解题</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-ai-solver.png" alt="拍照解题">
  </div>
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">英语口语练习</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-english.png" alt="口语练习">
  </div>
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">知识测验</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-quiz.png" alt="知识测验">
  </div>
  <div style="text-align: center">
    <p style="margin: 0 0 8px; font-size: 13px; color: #888;">编程思维拼图</p>
    <img style="border: 1px solid #e5e7eb; border-radius: 12px; width: 200px;" src="/qyqm-flow.png" alt="编程思维">
  </div>
</div>
