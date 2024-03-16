import { glob } from "glob";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Vesper's Articles",
  description: "Vesper vitepress",
  themeConfig: {
    logo: "https://avatars.githubusercontent.com/u/42132586?v=4",
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "主页", link: "/" }],
    outline: "deep",
    search: {
      provider: "local",
    },
    // carbonAds: {
    //   code: "your-carbon-code",
    //   placement: "your-carbon-placement",
    // },
    sidebar: [
      {
        items: glob.sync("docs/*/*.md").map((item) => {
          const pathArr = item.split("/");
          const text = pathArr.pop()?.replace(".md", "");
          return {
            text,
            link: `/${pathArr.pop()}/${text}`,
          };
        }),
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/newObjectccc/newObjectccc.github.io",
      },
    ],
  },
});
