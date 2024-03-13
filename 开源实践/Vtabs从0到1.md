# 开源实践（Chrome Extension）

## 🚀Chrome Extension Vtabs 的从0到1过程

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

本来我一直依赖用的是Chrome，当我一早在Arc内测时send了email，收到回复后，我发现只支持macOS，然我不得不继续使用Chrome，然后因为发现Edge的layer调试视图比Chrome流畅，我又转投Edge，这之后我发现Edge的vertical tabs很好用，我甚至没有关注在调度和内存占用上哪个更优，就因为这点转投了Edge，但是有一个痛点就是我几乎所有平台账号都依赖Google，而Microsoft的账号注册一直让我头大，所以我想在Chrome中开发一个支持Vertical tabs的插件，其实有了一些其他作者的插件，但我大致浏览了一下，功能强的要收费，免费的又做的太随意，竟然还有win98的复古感，于是我还是决定自己造一个吧，毕竟又花不了多少时间（不过我在做完之后又看到了一些免费且还不错的）。

这是Edge的：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/22ad86ee-8b2e-43d1-a334-ea4bc343dec4)

这是Chrome插件商店里的：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/1dc1a22e-5b2f-459b-a9b2-3a1ffeef179e)

#### 2. *项目规划和准备阶段*📌

开发Chrome Extension需要的准备其实也很简单：

1. web前端工程师一名，（如果你的插件需要和后端交互）全栈工程师会更好。
2. Chrome Extension 开发文档。[跳转去收藏](https://developer.chrome.com/?hl=zh-cn)
3. 初步了解Manifest.json及Chrome Extension App项目。[适合初学者的谷歌插件模板](https://github.com/newObjectccc/chrome-extension-boilerplate)
4. 知道怎么在Chrome浏览器中进入插件管理页面。
    - `chrome://extensions/`地址栏输入即可
5. 知道如何加载你的插件。
    - 这里是以`chrome-extension-boilerplate`为例，点击下图按钮，加载你的资源，比如dist目录：

    ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/f07d6586-efd3-423d-8b01-368ed9349646)

6. 知道如何打开插件调试工具。
    - 在插件管理页面加载后，打开插件，即可看到，如果你有SeviceWorker则可能会有2个检查视图，如下图：

   ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/2fe1030b-178e-45a5-b19a-aa187e724f32)

#### 3. *项目的创建和初始化*📌

以下我都是以`chrome-extension-boilerplate`为例，因为他足够简单，开箱即用，非常适合入门。

环境要求：

- node >= 20
- pnpm >= 8

开始使用：

1. git clone <https://github.com/newObjectccc/chrome-extension-boilerplate.git>
2. pnpm install
3. pnpm start

#### 4. *功能开发和迭代*📌

一开始我就明确了我的需求，即我的初衷，就是需要一个垂直的tabs进行管理，因为垂直的tabs，就算是开的比较多，也能够看到完整的title信息，剩下的就只需要根据需求寻找技术实现了，然后有坑踩坑，很幸运的是，我这个需求比较简单，所以一路上都没遇到什么坑。

- 垂直Tabs面板：Chrome Developer 文档里面我找到 sidePanel 的开发，就很满足我的需求。（需要在minifest.json中获取权限，最终你发布的时候，chrome是从minifest里面给你授权的）
- tabs管理：当然就是先看Tabs的所有Api啦，还是Chrome Developer 文档，一搜便有。

##### 迭代想法的萌生

有些想法你可能一开始并没有，但是你开发开发着就会出现了：

- 好看一点的UI：因为我使用的React，所以我用的`NextUI`（官网地址就不贴了，在我github主页分享里面有）
- 丝滑的动画：`framer-motion`非常强大且好用，谁用谁知道（官网也在我github主页）
- 拖拽库：`react-beautiful-dnd`不多介绍了，足够出名了（官网也在我主页）

#### 5. *社区参与和反馈*📌

开源的思考是来源于，我想让`Vtabs`仅仅是一个开始，大家完全可以根据自己的需求定制自己的`Vtabs`，比如你可能先带UI分组的功能，或者你想置顶几个小工具网页之类，但我并不是一个`Indie Hacker`（敬佩那些有大魄力和能力超群的大佬去实践独立开发者这一条路，甚至有些大佬完全就是开源贡献，从不收费），没有太多时间维护，只是空有开源社区的爱好，于是我将`Vtabs`开源。

- 于是我声明了`Apache2.0`开源协议。
- 并且声明了`CODE_OF_CONDUCT.md`和`CONTRIBUTING.md`来说明如何贡献。
- 并在issue区留出来一些功能思考。

#### 6. *总结和展望*📌

开源社区是每一个程序员都应该参与共建的，我也希望我在力所能及的地方，贡献自己一点微薄的力量，同时也能不停的磨砺自己，在开源社区留下自己的代码，也让我感受到一丝声明的意义。

最后贴上我的开源偶像:

[![Sindre Sorhus](https://github.com/sindresorhus.png?size=50)](https://github.com/sindresorhus)
[Sindre Sorhus](https://github.com/sindresorhus)
