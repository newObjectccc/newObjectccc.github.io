// Public portfolio content, based on the owner's resume and shipped products.
// Keep unverified implementation details and customer data out of this file.
export const projects = [
  {
    id: "wander",
    number: "01",
    name: "Wander China",
    subtitle: "让下一段旅程，从好奇开始。",
    category: "personal",
    categoryLabel: "个人产品",
    status: "闭源 · 已上线",
    kind: "travel",
    url: "https://travel.qyqmedu.com/",
    label: "探索 Wander China",
    description:
      "中国旅行探索与 AI 行程规划应用。从一张可交互的立体地图出发，把景点、兴趣和旅行灵感，变成可以编辑的每日安排。",
    role: "个人开发",
    tags: ["Next.js", "3D 交互", "AI 旅行助手", "中英文"],
    note: "From a little curiosity to a real journey.",
    points: [
      [
        "地图，也是入口",
        "中国与城市两级 3D 地图，支持旋转、缩放、景点探索与详情联动。以成都作为首个开放探索的城市。",
      ],
      [
        "AI 融入产品流程",
        "旅行助手 Bao 根据旅行天数、节奏与兴趣生成行程草稿，先预览，再由用户确认应用。",
      ],
      [
        "把灵感变成安排",
        "景点分类与收藏、多日行程编排、中英文界面，连接目的地探索与实际旅行计划。",
      ],
    ],
    images: [],
  },
  {
    id: "nst",
    number: "02",
    name: "牛市通",
    subtitle: "把信息，组织成研究。",
    category: "delivery",
    categoryLabel: "商业交付",
    status: "独立开发 · 已交付",
    kind: "research",
    url: "https://nst.qyqmedu.com/",
    label: "访问牛市通",
    description:
      "面向研究工作的 AI 工作台。将行情数据、资讯、监控与研究任务放在同一条工作流中，连接从发现线索到研究归档的过程。",
    role: "独立全栈开发",
    tags: ["Next.js", "NestJS", "Python / FastAPI", "Turborepo"],
    note: "已获得 10 万元个人开发报酬。",
    points: [
      [
        "完整的研究工作台",
        "实现标的池、资讯聚合、监控规则、AI 研究、任务看板和研究归档。",
      ],
      [
        "数据与 AI 协同",
        "使用 Python / FastAPI 与 AKShare 提供行情、历史和财务数据服务，并实现数据转换与缓存。",
      ],
      [
        "全栈工程交付",
        "Next.js + NestJS 构建前后端，Turborepo / pnpm 管理 Monorepo，Prisma / PostgreSQL 与 Redis 支撑数据存储。",
      ],
    ],
    images: [],
  },
  {
    id: "aibanxue",
    number: "03",
    name: "爱伴学",
    subtitle: "让教学与陪伴，发生连接。",
    category: "delivery",
    categoryLabel: "商业交付",
    status: "独立开发 · 已交付",
    kind: "education",
    url: "https://aibanxue.qyqmedu.com/",
    label: "访问爱伴学",
    description:
      "面向教师与家长的教育业务平台。从排课、备课到课堂和学习报告，让 Web、App 与微信小程序衔接成完整的教学体验。",
    role: "独立全栈与多端开发",
    tags: ["Next.js", "React Native / Expo", "微信小程序", "AI SDK"],
    note: "One learning experience. Across every screen.",
    points: [
      [
        "围绕课堂的业务系统",
        "基于 Next.js、Prisma / PostgreSQL 实现排课、备课、课堂工作台和学习报告。",
      ],
      [
        "AI 成为教学助手",
        "以 SSE 同步课堂状态，结合 AI SDK 工具调用支持教师助手，以及备课和报告草稿。",
      ],
      [
        "多端协同交付",
        "Web / PWA、React Native / Expo 教师 App、微信原生家长小程序，复杂课堂流程通过 WebView 复用。",
      ],
    ],
    images: [],
  },
  {
    id: "chengshi",
    number: "04",
    name: "成师 TTT",
    subtitle: "让每一次练习，都有回响。",
    category: "delivery",
    categoryLabel: "商业交付",
    status: "独立开发 · 已交付",
    kind: "community",
    url: "https://chengshi.qyqmedu.com/",
    label: "访问成师",
    description:
      "讲吾堂学员打卡社区。移动端优先的 PWA，把课程、作业打卡、话题讨论与成长记录连在一起。",
    role: "独立全栈开发",
    tags: ["Next.js", "PWA", "WebSocket", "Web Push"],
    note: "Small practices. Lasting connections.",
    points: [
      [
        "学习与社区",
        "基于 Next.js、Prisma / PostgreSQL 实现社区内容、课程、消息和运营管理。",
      ],
      [
        "移动端优先",
        "围绕手机使用场景设计 PWA，以 WebSocket 支持实时交互，结合 Web Push 提供消息推送。",
      ],
      [
        "记录成长",
        "集成 AI 辅助功能、月度报告及 3D 社区交互，连接学习记录与社区活动。",
      ],
    ],
    images: ["/chengshi.png", "/chengshi-leaderboard.png"],
  },
  {
    id: "qyqm",
    number: "05",
    name: "择野少年",
    subtitle: "为好奇心，留一片旷野。",
    category: "delivery",
    categoryLabel: "商业交付",
    status: "独立开发 · 已交付",
    kind: "growth",
    url: "https://qyqmedu.com/",
    label: "访问择野少年",
    description:
      "面向青少年成长、学习与教育活动的线上平台，让生涯探索、学习力测评、学习工具和线下活动有一个共同的入口。",
    role: "独立开发与交付",
    tags: ["Web 应用", "AI 学习工具", "教育产品"],
    note: "A place for the beautifully curious.",
    points: [
      ["成长探索", "提供生涯探索、学习力测评、学习游戏及活动展示、报名入口。"],
      ["学习工具", "集成 AI 学习工具，覆盖拍照问答、题目练习等学习场景。"],
      [
        "从开发到上线",
        "独立完成商业项目开发与交付，围绕教育业务组织产品功能。",
      ],
    ],
    images: [
      "/qyqm.png",
      "/qyqm-events.png",
      "/qyqm-tools.png",
      "/qyqm-assessments.png",
    ],
  },
];

export const tools = [
  {
    name: "Vtabs",
    type: "Chrome extension",
    status: "开源",
    description: "在 Side Panel 中，把浏览器标签页整理成清晰的垂直视图。",
    tags: ["Side Panel", "Framer Motion", "拖拽交互"],
    image: "/vtabs.png",
    url: "https://github.com/newObjectccc/vtabs",
    live: "https://chromewebstore.google.com/detail/vtabs/ldjlkpemhoddnoedhbebgdncegooejim",
  },
  {
    name: "BeautyCode",
    type: "VS Code extension",
    status: "开源",
    description: "不离开编辑器，把代码变成值得分享的图片。",
    tags: ["Shiki", "代码高亮", "主题"],
    image: "/beautycode.png",
    url: "https://github.com/newObjectccc/beautyCode",
    live: "https://marketplace.visualstudio.com/items?itemName=Vesper.beautycode",
  },
  {
    name: "Buildp",
    type: "Command-line tool",
    status: "开源",
    description: "将前端工程化工具与预设配置，装进一个命令行工具。",
    tags: ["Commander.js", "prompts", "工程化"],
    image: "/buildp.png",
    url: "https://github.com/newObjectccc/bup",
    live: "https://www.npmjs.com/package/buildp",
  },
  {
    name: "Video2Gif",
    type: "Browser tool",
    status: "开源",
    description: "在浏览器里完成视频采样、逐帧编辑与 GIF 编码。",
    tags: ["Canvas", "gifenc", "Interact.js"],
    image: "/vtog.gif",
    url: "https://github.com/newObjectccc/video_to_gif",
  },
  {
    name: "Aix Extools",
    type: "Chrome extension",
    status: "未开源",
    description: "从翻译开始，把场景化的 AI 辅助功能带进浏览器。",
    tags: ["原生 JavaScript", "OOP / AOP", "AI"],
    image: "/aix.png",
    live: "https://chromewebstore.google.com/detail/aix-extools/folndjfdlidgbjgmlainjmoodlfggoog",
  },
  {
    name: "Chrome Launcher",
    type: "Vite plugin",
    status: "开源",
    description: "把 Chrome 启动与调试配置接入扩展开发流程。",
    tags: ["Vite", "chrome-launcher", "CDP"],
    live: "https://www.npmjs.com/package/vite-plugin-chrome-launcher",
  },
];

export const experience = [
  {
    date: "现在",
    name: "上海韬墨智能科技有限公司",
    short: "韬墨智能",
    role: "全栈工程师 · 偏 FDE",
    domain: "Enterprise SaaS / AI Agent",
    summary: "走进客户现场，把企业场景变成可交付的软件。",
    details: [
      "主导大型 SaaS 项目的微前端改造与迁移，兼顾存量功能和大客户定制需求，推进前端性能、可维护性及部署发布流程优化。",
      "开展 Python / FastAPI 服务端开发；参与西门子图纸识别、TESA 知识库、TE 知识库 Agent，以及 Seksun 产品追溯项目。",
      "赴客户现场开展 FDE 工作，对接业务需求、拆解开发任务，推进定制功能实施与现场问题处理。",
    ],
    tags: ["微前端迁移", "Python / FastAPI", "企业知识库", "客户现场交付"],
  },
  {
    date: "2023.04 — 2025.02",
    name: "四川蜀信云茶信息科技有限公司（茶百道）",
    short: "茶百道",
    role: "资深前端工程师",
    domain: "Retail / Multi-platform",
    summary: "让点餐、门店运营和会员营销协同运转。",
    details: [
      "负责 C 端点餐、B 端门店管理小程序开发维护，参与中台营销促销及 POS 会员系统研发。",
      "维护基于 dumi 的前端组件库，开发 bup CLI，将内部项目工程化搭建流程封装为命令行工具。",
    ],
    tags: ["React / Vue", "uni-app", "POS", "组件与 CLI"],
  },
  {
    date: "2021.12 — 2023.04",
    name: "北京多来点信息科技有限公司（哗啦啦）",
    short: "哗啦啦",
    role: "资深前端工程师",
    domain: "SaaS / Frontend engineering",
    summary: "在复杂业务中，建立可复用的前端能力。",
    details: [
      "参与杨国福、茶百道及 POS 云会员等业务系统研发，基于 Ant Design 4 封装 BasicForm、BasicPaginationTable 等业务组件，使用率分别超过 60% 与 90%。",
      "协同 6–8 名外包开发人员开展迭代，承担 MR / Code Review、任务拆分、进度协调和 Webpack 工程优化。",
    ],
    tags: ["React", "业务组件", "Code Review", "Webpack"],
  },
  {
    date: "2020.06 — 2021.12",
    name: "重庆广域铭岛科技有限公司",
    short: "广域铭岛",
    role: "中高级前端工程师",
    domain: "Automotive / DaaS",
    summary: "为汽车制造业务构建数据应用。",
    details: [
      "基于 Vue 3、TypeScript、Vite 与 Vben，参与吉利汽车 DaaS 系统研发，开展敏捷需求迭代与业务组件封装。",
    ],
    tags: ["Vue 3", "TypeScript", "Vite", "DaaS"],
  },
  {
    date: "2017.03 — 2020.06",
    name: "重庆八进制科技有限公司",
    short: "八进制",
    role: "中级前端开发工程师",
    domain: "Web / Mini programs",
    summary: "从业务界面，到完整的开发与交付。",
    details: [
      "参与急速影音、积分商城小程序及彩聊官网研发，负责业务组件封装、任务拆分、开发进度跟进与 Webpack 打包优化。",
    ],
    tags: ["Vue", "uni-app", "Webpack", "业务研发"],
  },
];

export const capabilities = [
  {
    title: "Interfaces",
    subtitle: "界面与多端体验",
    stack:
      "React · Vue · Next.js · TypeScript · 微前端 · PWA · React Native / Expo · 微信小程序 · Electron",
    description: "把复杂业务，做成清晰、流畅的操作体验。",
  },
  {
    title: "Intelligence",
    subtitle: "AI 应用工程",
    stack:
      "LangChain · LangGraph · WeKnora · RAG · GraphRAG · Agent Harness · AI SDK",
    description: "把模型能力，接进有上下文、有工具的真实工作流。",
  },
  {
    title: "Systems",
    subtitle: "全栈与工程交付",
    stack:
      "Python / FastAPI · Node.js / NestJS · PostgreSQL · Redis · Docker · CI/CD · Monorepo",
    description: "从数据与服务到部署，在用户现场完成最后一公里。",
  },
];
