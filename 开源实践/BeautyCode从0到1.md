# 开源实践（VS Code Extension）

## VSCode Extension BeautyCode 的从0到1过程

> 开源实践系列是为了记录笔者的每一个开源项目的实践过程，希望能给一些准备入门开源实践的小伙伴一些浅浅的帮助。

因为都是开源实践的历程回顾，每一个开源实践我基本都会以以下结构来进行记录：

1. *项目的初衷和背景*
2. *项目规划和准备阶段*
3. *项目的创建和初始化*
4. *功能开发和迭代*
5. *社区参与和反馈*
6. *总结和展望*

### 正文开始👉

----------------

#### 1. *项目的初衷和背景*📌

我写这个插件的灵感是来源于Carbon和Shiki，初衷是因为Carbon是网页版本，需要我把代码粘贴到网页，并且有一些收费主题，免费的主题也不是很好看，于是我打算自己写一个。

这是Carbon的：

#### 2. *项目规划和准备阶段*📌

开发VSCode Extension需要的准备其实也很简单：

1. web前端工程师一名，（如果你的插件需要和后端交互）全栈工程师会更好。
2. VSCode Extension 开发文档。[基于VSCode的一些API的开源封装，作者也是一个厉害的开源大佬](https://vscode-use-docs.netlify.app/)
3. 初步了解Mpackage.json及VSCode Extension App项目配置。[适合初学者的VSC插件模板](https://github.com/newObjectccc/vscode-extension-boilerplate)
4. 知道怎么在VSCode中运行插件调试窗口。
    - `F5`开启debug模式即可，`vscode-extension-boilerplate`的`.vscode`文件中已经配置好了。
5. 知道如何调试你的插件。
    - 这里是以`vscode-extension-boilerplate`为例：

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/f07d6586-efd3-423d-8b01-368ed9349646)

#### 3. *项目的创建和初始化*📌

以下我都是以`vscode-extension-boilerplate`为例，因为他足够简单，开箱即用，非常适合入门。

环境要求：

- node >= 20
- pnpm >= 8

开始使用：

1. git clone <https://github.com/newObjectccc/vscode-extension-boilerplate.git>
2. pnpm install （特别注意，在你打包你的vsc插件之前，请用npm install，或者pnpm recursive-install，详情请自行了解pnpm和npm在安装依赖上的区别）
3. pnpm watch

#### 4. *功能开发和迭代*📌

这个插件的功能很简单，我只想要一个不用离开VSCode就可以导出漂亮的代码块，最好能支持多个语言和多个主题，梳理一下之后我需要完成以下功能点。

- 注册一个生成代码块的命令：
- 从用户编辑区的选中，获取代码，当前语言：
- 打开新窗口，根据选中代码生成代码块预览：
- 切换主题和语言：
- 导出图片：

##### 迭代想法的萌生

这里记录一下我在开发中蹦出来的一些想法，虽然也被我否了。。。

- 代码块周边透明度自定义？（50%刚刚好，感觉没必要给个自定义了。。。本来我就懒！）
- 代码区域是否可编辑？（本来就在vscode内部，感觉有点鸡肋）
- 是否可以支持多种字体？（字体文件一般不小，且好看的也收费，所以我当时就否了）

#### 5. *社区参与和反馈*📌

开源且免费是因为，我不希望`Carbon`收费，所以我自然也不收费，开源是为了给社区贡献一点点的VSCode入门知识。

- 于是我声明了`MIT`开源协议。

#### 6. *总结和展望*📌

开源社区是每一个程序员都应该参与共建的，我也希望我在力所能及的地方，贡献自己一点微薄的力量，同时也能不停的磨砺自己，在开源社区留下自己的代码，也让我感受到一丝生命的意义。

最后贴上我的开源偶像:

[![Sindre Sorhus](https://github.com/sindresorhus.png?size=50)](https://github.com/sindresorhus)
[Sindre Sorhus](https://github.com/sindresorhus)
