#

## 🔥字节新出oxlint都在推但没人讲怎么尝鲜，那就我来献丑吧~

`oxlint` 我就不多介绍了，你只需要知道速度超级快就行了，他们自研了一套 `oxc tree` 规范来替换，`estree` 的 `js` 的 `AST` 规范，说是更加契合，手贱的我，选择给公司项目上了一波，如他官网所说并非为了替换 `eslint`，而是为了优化开发体验。

先摆个观点，`Oxlint` 真的很快， 但确实如官方所说并非为了取代 `ESlint`，但他的发展路子未来的确是大概率会取代的，只要规则越来越多，并且支持自己的配置文件（`--help`中有说实验性的支持`.eslintrc.*`但是我实测还不行），或者干脆就完全支持`eslint`，哪怕`90%`。

另外，对于前端生态来说，用`rust`早就不是一个趋势了，早点学起来吧各位~

如果你又想享受`rust`带来的速率，又想获取更好的体验，其实可以试试`Biome`，我实测过2800+文件下只比`oxlint`慢了1~2秒左右，支持的规则更多，并且也支持代码风格的`format`，可能他想把 `eslint，prettier` 一网打尽。

here we go！

本文我们只简单聊聊如何结合 `lint-staged` 来使用~

更多信息请移步⬇️
[Oxlint的官网 https://oxc-project.github.io/](https://oxc-project.github.io/)✅

### 正文开始👉

------------------------------------------------

#### 开始 📌

我这里直接用了我之前开发的一款很多bug的开源脚手架`bup`来进行安装`lint-staged`，后续会直接支持`oxlint`。（欢迎大家一起来写bug哈~）

`bup`会自动为你安装`husky, lint-staged`依赖和做基础配置，等待安装配置完成后：

![1](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/739e2e85-d6cf-4d0e-96ec-c8e12040c4fa)

我们只需要找到`.lintstagedrc.*`配置文件，做如下修改即可：

![2](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/0bd0b0d8-9e27-40c9-8bc9-4b724a1c7976)

这样当我们每次提交代码时，会自动执行`oxlint`为我们检测：

这里需要注意一点是，默认情况下`warning`并不会抛出错误，停止后续代码提交，如果你想让`warning`抛出错误，请一定要添加`--max-warnings=1`的入参。

------------------------------------------------

😊okk~ 今天就水到这儿，快去尝鲜 `oxlint` 吧~
