---
layout: doc
---

# NGWP

[Repo Link](https://github.com/newObjectccc/NGWP)

基于rust工具链的下一代WEB项目模板，建议直接参考[rsbuild官方文档](https://www.rspack.dev/zh/)

> [!IMPORTANT]
> 我还没正式用过，还在搭建中，暂时请勿用于企业环境。

## 环境

- node >= 20
- pnpm >= 8

## 功能

- ✨ 轻量的工程化配置（零业务封装）
- 💥 开箱即用的React + Tailwindcss + Typescript配置
- 💫 基于Rsbuild的超爽开发及构建体验
- 🧨 基于Oxlint的超快代码规范检测
- 💖 基于git-cliff的自定义changlog版本管理

## 安装依赖

```bash
git clone https://github.com/newObjectccc/NGWP.git
```

```bash
pnpm install
```

## 启动项目

启动开发环境，此环境下Rsbuild会自动设置`process.env.NODE_ENV`环境变量为`development`

```bash
pnpm dev
```

为生产环境打包，此环境下Rsbuild会自动设置`process.env.NODE_ENV`环境变量为`production`

```bash
pnpm build
```

本地预览生产环境打包产物，类似于生产环境包，本地部署。

```bash
pnpm preview
```

你可以很方便的在开发或生产环境下访问环境变量

```javascript
  console.log('process.env.NODE_ENV:',process.env.NODE_ENV);
  // 生产环境下为 production
  // 开发环境下为 development
```

## 使用技巧

### 静态资源前缀 `process.env.ASSET_PREFIX`

你可以在 client 代码中使用 process.env.ASSET_PREFIX 来访问静态资源的前缀。

在开发环境下，它等同于 dev.assetPrefix 设置的值。
在生产环境下，它等同于 output.assetPrefix 设置的值。
Rsbuild 会自动移除 assetPrefix 尾部的斜线符号，以便于进行字符串拼接。
比如，我们通过 output.copy 配置，将 static/icon.png 图片拷贝到 dist 目录下：

```javascript
export default {
  dev: {
    assetPrefix: '/',
  },
  output: {
    copy: [{ from: './static', to: 'static' }],
    assetPrefix: 'https://example.com',
  },
};
```

此时，我们可以在 client 代码中通过以下方式来拼接图片 URL：

```javascript
const Image = <img src={`${process.env.ASSET_PREFIX}/static/icon.png`} />;
```

在开发环境，以上代码会被编译为：

```javascript
const Image = <img src={`/static/icon.png`} />;
```

在生产环境，以上代码会被编译为：

```javascript
const Image = <img src={`https://example.com/static/icon.png`} />;
```

*如果你需要定义更多的环境变量，你可以直接创建.env文件，当项目根目录存在 .env 文件时，Rsbuild 会自动使用 dotenv 来加载这些环境变量，并添加到当前 Node.js 进程中。*

Rsbuild 支持读取以下 env 文件：(如果同时存在下面的多个文件，那么多个文件都会被读取，并且表格下方的文件具有更高的优先级。)

|文件名|描述|
|-------------|--------------|
|`.env`|在所有场景下默认加载。|
|`.env.local`|.env 文件的本地用法，需要添加到 .gitignore 中。|
|`.env.development`|当 process.env.NODE_ENV 为 'development' 时读取。|
|`.env.production`|当 process.env.NODE_ENV 为 'production' 时读取。|
|`.env.development.local`|.env.development 文件的本地用法，需要添加到 .gitignore 中。|
|`.env.production.local`|.env.production 文件的本地用法，需要添加到 .gitignore 中。|

请注意，如果你需要在你的客户端代码中使用环境变量，请在变量名前加上`PUBLIC_`前缀，比如：

```yaml
PUBLIC_NAME=jack // 客户端可直接访问
PASSWORD=123  // 客户端访问时为 undefined
```

更多关于环境变量的详情，请参考rsbuild官网。

### Type Check 插件

此模板已集成了该插件，并有详细注释

`fork-ts-checker-webpack-plugin` 的类型检查逻辑与 `TypeScript` 原生的 `tsc` 命令基本一致，它会自动读取 `tsconfig.json` 中的配置项，也可以通过 Type Check 插件提供的配置项来修改默认行为。

插件在开发环境和生产环境下的行为有以下差异：

- 在开发环境构建时，类型错误不会阻塞构建流程，只会在 terminal 中输出错误日志。
- 在生产环境构建时，类型错误会导致构建失败，以保证生产环境代码的稳定性。

### Check Syntax 插件

此模板已集成了该插件，并有详细注释

注册 `Check Syntax` 插件后，Rsbuild 会在生产环境构建后进行语法检测。
当 Rsbuild 在构建产物中检测到不兼容的高级语法后，会将错误日志打印在终端，并退出当前构建流程
目前语法检测是基于 `AST parser` 来实现的，每次检测时，只能找出文件中的第一个不兼容语法。如果一个文件中存在多个不兼容语法，你需要修复已发现的语法，并重新执行检测

- 如果你希望降级该语法，以保证代码具备良好的兼容性，可以通过 `source.include` 配置来编译相应的模块。
- 如果你不希望降级该语法，可以调整项目的 `browserslist` 范围，调整至与该语法相匹配的范围。
- 如果你不希望对某些产物进行语法检查，可用 `checkSyntax.exclude` 配置排除要检查的文件。

### Image Compress 插件

此模板已集成该插件，并有详细注释

Image Compress 插件会将项目中用到的图片资源进行压缩处理，进而在图片视觉观感不受影响的同时减小产物体积。
压缩器的具体配置项请参考 [@napi-rs/image](https://image.napi.rs/docs)
