#

## 🚀你应该知道如何用Github Page部署你的博客

相信有很多小伙伴都想试着写自己的博客，分享一些自己的故事或者技术或者心情，但是不论是Next.js还是Nuxt.js，

不论是vercel还是netify，似乎都有点麻烦，我只是单纯想写个markdown咋办？今天我们就来说说咋办🎯

here we go！🚀

ps：以下是基于 `github` 哟，如果你没有 `github`，那么再见~

### 正文开始👉

------------------------------------------------

相信细心的小伙伴已经注意到了，其实我的这个仓库全都是markdown，而且也是基于GitHub Page的部署的。

#### 1. 首先打开 Github📌

- 创建一个新仓库，比如 newobjectccc.github.io 就是我的仓库名



- 然后点击生成 `launch.json` 文件，

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/4d9552a2-1c4c-47db-8ccd-29496f50ef23)

- 如果你是按的 `F5` 应该会直接弹出 `VSCode` 的命令窗，直接选择下面这个，`VSCode` 会在项目根目录下创建一个 .vscode 的文件夹，并生成 `launch.json` 文件

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/c97884b7-b29a-4682-acf0-abe8cf828cb9)

#### 2. 确认端口号📌

在我们开始 `debugger` 之前，我们需要确认 `launch.json` 文件里的端口号是否是你本地开发的端口号
  
![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/4249f7d7-a038-4016-ad96-58b895fe548f)

- 接下来就在本地跑起来你的项目，并打开你想要 `Debugger` 的 js 文件

#### 3. 开始 Debug📌

在你的文件里面打上你的小红点，并且如果你鼠标右键单击的话，可以看到还有很多功能~

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/6dd72f00-36ca-47b5-8ac7-92e57033aad8)

- 这里你还可以输入你的表达式，来设定条件断点

接下来就去触发你的函数，或者渲染方法吧

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/2140db6f-8ce5-4c06-88e0-e283975fb996)

- 当执行到了我们设定的断点的时候，我们看下面这张图

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/60807531-1756-4e12-95f4-1b0910010f93)

左边有各种监控信息，比如：

- 变量
- 监视
- 调用堆栈（当你读框架源码的时候，非常有用）
- 已载入的脚本
- 断点信息
- 事件监听断点

几乎是和浏览器一模一样，浏览器有的，他都有~

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/3b49bec4-23b4-4690-b4dc-a50e1f4c74bc)

`F5` 和 `F10` 应该都能看懂，

📌简单聊一下这俩吧：

- 假设这是你目前 `Debug` 停留的断点处是 `Function Two`

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/911416d8-0f72-406f-aad1-1c80bc451edd)

- `F11`: *会走到 `Function Three`，执行栈向下*
- `shift + F11`: *会走到 `Function One`，执行栈向上*

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/6bcad45d-c144-4601-af75-e60719b5224d)

当然了，如果向下或向上都没有了，自然就跳出了~

------------------------------------------------

😊okk~ 赶紧去Debugger你的程序吧~
