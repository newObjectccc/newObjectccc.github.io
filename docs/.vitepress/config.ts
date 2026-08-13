import { glob } from "glob";
import { defineConfig } from "vitepress";

export default defineConfig({
  head: [
    // 显式 icon + 版本号，冲掉浏览器在迁移窗口期缓存的旧图标
    ["link", { rel: "icon", href: "/favicon.ico?v=2" }],
    // PWA：可安装（主屏幕图标、独立窗口）；SW 只注册不缓存，秘密空间内容绝不落盘
    ["link", { rel: "manifest", href: "/manifest.webmanifest" }],
    ["meta", { name: "theme-color", content: "#0b0f0c" }],
    ["link", { rel: "apple-touch-icon", href: "/apple-touch-icon.png" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" }],
    ["meta", { name: "apple-mobile-web-app-title", content: "秘密空间" }],
    [
      "script",
      {},
      `if ("serviceWorker" in navigator) { window.addEventListener("load", function () { navigator.serviceWorker.register("/sw.js"); }); }`,
    ],
    // 秘密空间主题类在首帧渲染前就挂上，避免 Vue 挂载前的默认主题白闪
    [
      "script",
      {},
      `if (location.pathname.indexOf("/secret") === 0) { document.documentElement.classList.add("secret-garden"); }`,
    ],
    ["link", { rel: "preconnect", href: "https://api.iconify.design" }],
    ["link", { rel: "preconnect", href: "https://github.com" }],
    [
      "script",
      {},
      `
      window.onload = function() {
        var comment = document.createComment(' Google tag (gtag.js) ');
        var scriptAnalyze = document.createElement('script');
        var scriptAds = document.createElement('script');
        var scriptAnalytics = document.createElement('script');
        scriptAnalytics.innerHTML = 'window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag("js", new Date()); gtag("config", "G-T1JKRSN104");';
        scriptAnalyze.src = 'https://www.googletagmanager.com/gtag/js?id=G-T1JKRSN104';
        scriptAds.crossorigin = 'anonymous';
        scriptAds.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7527956407511986';
        document.head.appendChild(comment);
        document.head.appendChild(scriptAnalyze);
        document.head.appendChild(scriptAnalytics);
        document.head.appendChild(scriptAds);
      };
    `,
    ],
  ],
  title: "Vesper's site",
  description: "Vesper vitepress",
  lastUpdated: !process.env.DOCKER_BUILD,
  themeConfig: {
    logo: "/favicon.ico?v=2",
    nav: [
      { text: "主页", link: "/" },
      { text: "文章", link: "/main" },
      { text: "自建模板库", link: "/自建模板库/next-generation-web-project" },
      { text: "Vtabs", link: "/vtabs" },
      { text: "BeautyCode", link: "/beautycode" },
      { text: "Bup", link: "/buildp" },
      { text: "V2g", link: "/videotogif" },
      { text: "Aix", link: "/aix" },
      { text: "成师", link: "/chengshi" },
      { text: "择野少年", link: "/qyqm" },
      { text: "秘密空间", link: "/secret/" },
    ],
    outline: "deep",
    search: {
      provider: "local",
    },
    sidebar: {
      // 秘密空间不显示侧边栏，也不参与主站 prev/next 串联
      "/secret/": [],
      "/": glob
        .sync("docs/*/*.md")
        // 秘密空间不进侧边栏：避免日记标题在主站页面暴露，页面间靠入口页导航
        .filter((tar) => !tar.startsWith("docs/secret/"))
        .reduce((acc: any, tar) => {
          const pathArr = tar.split(/[\\/]/);
          const text = pathArr.pop()?.replace(".md", "");
          let group = acc.find((item: any) => item.text === pathArr[1]);
          if (!group) {
            const len = acc.push({
              text: pathArr[1],
              items: [],
              collapsed: true,
              base: `/${pathArr[1]}/`,
            });
            group = acc[len - 1];
          }
          group.items.push({ text, link: `${text}.md` });
          return acc;
        }, []),
    },
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/newObjectccc/newObjectccc.github.io",
      },
      {
        icon: "twitter",
        link: "https://twitter.com/cccxy10086",
      },
    ],
  },
});
