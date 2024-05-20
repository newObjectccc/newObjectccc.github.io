---
layout: doc
---

# chrome-extension-boilerplate

[Repo Link](https://github.com/newObjectccc/chrome-extension-boilerplate)

## 基于 React18，TypeScript，Vite，NextUI 的 Manifest Version 3 的谷歌浏览器插件开发木板

[English](https://github.com/newObjectccc/chrome-extension-boilerplate) | 简体中文

## 功能

- ✨ 通过监控你的src目录下的代码触发编译更新dist代码
- 💥 基于Vite@5.1
- 💫 使用NextUI@2.2
- 🧨 使用Manifest V3.
- 💖 使用TypeScript
- 💥 基于Vite@5.1

## 使用说明

1. ```git clone git@github.com:newObjectccc/chrome-extension-boilerplate.git```
2. ```pnpm install```
3. ```pnpm dev```

> [!important]
> 请注意！模板会自动加载你的extension. 当代码更新后，dist代码虽然重新编译了，但是在chrome://extensions界面仍然需要手动刷新插件。

**构建时会根据`src/manifest.js`去生成对应的`manifest.json`，你可以在`vite.config.ts`里看到会动态生成`content_script`，如有需要可以自行配置。**

> [!warning]
> 建议把对应的资源写在对应的目录下。

整个项目结构

```js
src
├── background 
├── content 
├── popup 
├── sidepanel 
└── manifest.js 扩展程序清单
```

打包后

```js
dist
├── background 对应插件主线程
├── content 对应插件内容脚本
├── popup 对应插件弹出页面
├── sidepanel 对应插件sidepanel
└── manifest.json 由manifest生成而来
```

> [!warning]
> 如果你的插件涉及到`content_script`，浏览器不会让你加载外部包，这里建议修改打包配置并用原生`js`操作你的视图，如果你确实有非常复杂的视图需求，建议使用`iife`格式打包，并且通过`manualChunks: (id) => string`的设置（如果你的项目只涉及一个入口文件，那么可以忽略manualChunks，设置一下`format: 'iife'`即可，详细设置请参阅[vite文档](https://vitejs.dev/guide/build.html#chunking-strategy)或者[rollup文档](https://rollupjs.org/configuration-options/#output-manualchunks)），把所有的相关依赖打到同一个`js` `bundle`文件中，并且在技术选型上建议使用较小的构建产物的框架，如Vue，unocss等， 并且如果你熟悉`web component`，其实会非常适合做`content_script`通过注入js来画ui的场景需求。

如果你在做`content_script`这种需求开发时，想拆分你的模块，以便后续维护，可以参考以下示例的设置：

目录结构如下：

![image](https://github.com/newObjectccc/chrome-extension-boilerplate/assets/42132586/4e4f14d8-66ed-4ac4-aa42-064a5ca95864)

`content_script`主入口:
```js
// content.js
import { initSelectionListener } from './pageListener';
```

拆分一个js模块: `pageLinster.js`

![code2](https://github.com/newObjectccc/chrome-extension-boilerplate/assets/42132586/79c8dc07-52a5-4b06-953b-25af5edebbb1)

把content相关资源打包成一个bundle`vite.config.ts`:

![code1](https://github.com/newObjectccc/chrome-extension-boilerplate/assets/42132586/1be5b2d4-19f0-49f3-9b73-6c88e730a451)

或者你也可以多个bundle，但如果是多个bundle，建议用shadowDOM做隔离环境，并把每个bundle的导出打包为全局变量，引入时直接引入全局变量。

## 参考文档

[Chrome开发文档](https://developer.chrome.com/docs?hl=zh-cn)
