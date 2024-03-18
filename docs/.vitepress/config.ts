import { glob } from "glob";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vesper's site",
  description: "Vesper vitepress",
  lastUpdated: true,
  themeConfig: {
    logo: "https://avatars.githubusercontent.com/u/42132586?v=4",
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "主页", link: "/" },
      { text: "文章", link: "/main" },
      { text: "自建模板库", link: "/自建模板库/next-generation-web-project" },
      { text: "Vtabs", link: "/vtabs" },
      { text: "BeautyCode", link: "/beautycode" },
      { text: "Bup", link: "/buildp" },
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
