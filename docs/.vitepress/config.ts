import { glob } from "glob";
import { defineConfig } from "vitepress";

export default defineConfig({
  head: [
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
        docment.head.appendChild(scriptAnalytics);
        document.head.appendChild(scriptAds);
      };
    `,
    ],
  ],
  title: "Vesper's site",
  description: "Vesper vitepress",
  lastUpdated: true,
  themeConfig: {
    logo: "/favicon.ico",
    nav: [
      { text: "主页", link: "/" },
      { text: "文章", link: "/main" },
      { text: "自建模板库", link: "/自建模板库/next-generation-web-project" },
      { text: "Vtabs", link: "/vtabs" },
      { text: "BeautyCode", link: "/beautycode" },
      { text: "Bup", link: "/buildp" },
      { text: "V2g", link: "/videotogif" },
    ],
    outline: "deep",
    search: {
      provider: "local",
    },
    sidebar: glob.sync("docs/*/*.md").reduce((acc: any, tar) => {
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
