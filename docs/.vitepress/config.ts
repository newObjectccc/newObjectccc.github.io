import { glob } from "glob";
import { defineConfig } from "vitepress";

export default defineConfig({
  head: [
    [
      "script",
      {
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7527956407511986",
        async: "true",
        crossorigin: "anonymous",
      },
    ],
    ["link", { rel: "preconnect", href: "https://api.iconify.design" }],
    ["link", { rel: "preconnect", href: "https://github.com" }],
    [
      "script",
      {},
      `
      (function() {
        var comment = document.createComment(' Google tag (gtag.js) ');
        document.head.appendChild(comment);
      })();
    `,
    ],
    [
      "script",
      {
        async: "true",
        src: "https://www.googletagmanager.com/gtag/js?id=G-T1JKRSN104",
      },
    ],
    [
      "script",
      {},
      `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-T1JKRSN104');
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
