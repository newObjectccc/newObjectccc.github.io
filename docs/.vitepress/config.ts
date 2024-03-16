import { glob } from "glob";
import { defineConfig } from "vitepress";

console.log(glob.sync("docs/**/*.md"));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "My Blog",
  description: "My Blog bu vitepress",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],

    sidebar: [
      {
        // items: [
        //   {
        //     text: "docker-compose多项目自动化部署实践",
        //     link: "/全栈技能-偏前端/docker-compose多项目自动化部署实践",
        //   },
        // ],
        items: glob.sync("docs/**/*.md").map((item) => {
          const text = (item.split("/").pop() as string).replace(".md", "");
          return {
            text,
            link: `/${text}`,
          };
        }),
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
