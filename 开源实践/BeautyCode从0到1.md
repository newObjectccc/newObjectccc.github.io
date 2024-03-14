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

[a162cd02-155b-4fd7-89dc-4a5843637e58.webm](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/9785a6a8-4c62-4ba3-a789-a33ddb25f09d)

【在VSCode中导出漂亮的代码图！】 https://www.bilibili.com/video/BV16w4m1d7et/?share_source=copy_web&vd_source=0ce418657874272e878c4389ba86cc13

----------------

#### 1. *项目的初衷和背景*📌

我写这个插件的灵感是来源于Carbon和Shiki，初衷是因为Carbon是网页版本，需要我把代码粘贴到网页，并且有一些收费主题，免费的主题也不是很好看，于是我打算自己写一个。

这是Carbon的：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/a85d1659-6a6e-4ea5-b12a-0e8098ca43e1)

#### 2. *项目规划和准备阶段*📌

开发VSCode Extension需要的准备其实也很简单：

1. web前端工程师一名，（如果你的插件需要和后端交互）全栈工程师会更好。
2. VSCode Extension 开发文档。[基于VSCode的一些API的开源封装，作者也是一个厉害的开源大佬](https://vscode-use-docs.netlify.app/)
3. 初步了解Mpackage.json及VSCode Extension App项目配置。[适合初学者的VSC插件模板](https://github.com/newObjectccc/vscode-extension-boilerplate)
4. 知道怎么在VSCode中运行插件调试窗口。
    - `F5`开启debug模式即可，`vscode-extension-boilerplate`的`.vscode`文件中已经配置好了。
5. 知道如何调试你的插件。
    - 这里是以`vscode-extension-boilerplate`为例：
   
    在F5开始debug模式之后，弹出的vsc窗口中点击帮助菜单
   
    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/96f65559-9b49-4271-ba46-ce45655b03fb)

    在弹出的菜单里选择`Toggle Developer Tools`

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/c723a174-7839-4944-b98a-0ac63d9c5775)

    然后弹出的调试页面想必不用我多介绍了吧，各位应该非常熟悉了（Linux用户应该是直接在窗口右边展示，功能一样的）

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/0f6331eb-d111-4363-9ccd-e11e6f37f0d8)


#### 3. *项目的创建和初始化*📌

以下我都是以`vscode-extension-boilerplate`为例，因为他足够简单，开箱即用，非常适合入门。

环境要求：

- node >= 20
- pnpm >= 8

开始使用：

1. git clone <https://github.com/newObjectccc/vscode-extension-boilerplate.git>
2. pnpm install （特别注意，在你打包你的vsc插件之前，请用npm install，或者pnpm recursive-install，详情请自行了解pnpm和npm在安装依赖上的区别）
3. pnpm watch 或者 F5

#### 4. *功能开发和迭代*📌

这个插件的功能很简单，我只想要一个不用离开VSCode就可以导出漂亮的代码块，最好能支持多个语言和多个主题，梳理一下之后我需要完成以下功能点。

- 注册一个生成代码块的命令：

    package.json中声明commands和keybindings

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/d82cead5-4aae-474d-950b-1e52a401b68b)

    vsc程序内注册命令

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/d5b80c40-89fd-4dc1-ad3b-5077dd07a655)

- 从用户编辑区的选中，获取代码，当前语言：

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/725ad460-1aac-4043-aa0d-0d0c0023e43c)
  
- 打开新窗口，根据选中代码生成代码块预览：

    这里我创建了一个新的webview窗口，加载了我src目录下的webview.html文件

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/bc194260-3382-4b9f-bf68-361df9477b46)

    这里需要打通extension和webview的通信，首先在extension.ts中监听webview的postMessage事件

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/25078818-fa56-46d5-bbb1-1fc8aa0f3a31)

    然后在webview.html中监听postMessage事件（因为我是当webview.html页面的onload回调中，发送事件给extension，由extension处理，传给webview选中的代码，当前语言等信息）

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/dbcd0970-3c04-458a-aa63-f6b13ac946c8)

- 切换主题和语言：

    Shiki内置了非常多的编程语言代码高亮和主题，只需要拿出来遍历即可

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/3074e5ea-3242-4623-b0ab-e9a3beb561a9)

- 导出图片：

    导出功能直接使用了html2canvas

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/23d364a8-497c-4454-8e56-cca8040f5379)

##### 踩坑

一开始我给代码块外围增加了box-shadow，但是在导出的时候，我发现box-shadow并不能被正确导出，想看看issue有没有解决方案，只是800+的issues，筛选出来40+个，看了之后都没解决，于是想自己fork下来debug，但是看了没有阴影的效果之后还是觉得其实也不错了，毕竟我是个大懒逼啊~

[html2canvas/issues #2972](https://github.com/niklasvh/html2canvas/issues/2972)

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
