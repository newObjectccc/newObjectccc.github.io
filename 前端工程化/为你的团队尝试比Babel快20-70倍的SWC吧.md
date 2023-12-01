#

## 🔥你应该了解的SWC: Speedy Web Compiler

一提起 Babel 相信大家都不会陌生，你的 `javascript compiler`，但是自从 `Rust` 大火以后，前端生态也发生了天翻覆地的变化，我们这次聊的就是重大的变化之一。

> 一个或许比 Babel 更优的选择

而事实上，很多你所熟知的开源库和框架都在拥抱 `SWC`

here we go！

更多信息请移步⬇️
[SWC的官网 https://swc.rs/](https://swc.rs/)✅

本篇文章我会以《怎么基于SWC开发去掉代码中`console.log`的`js`demo》的视角来带你领略 `SWC` 的魅力

⚠️ 阅读本文的前置知识：

- `AST(Abstract Syntax Tree)`：抽象语法树
- `Compiler pipeline`：编译的一个基础工作流（SWC还有一个 `minify` 的 pipeline）
- `Node fs system`：Node 的文件系统（一丢丢就好）

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/ce48ebda-3b54-4761-bf5e-8f41dd1258e6)

### 正文开始👉

------------------------------------------------

#### 什么是 SWC 📌

> SWC是一个可扩展的基于Rust的平台，用于下一代快速开发工具。它被Next.js、Parcel和Deno等工具以及Vercel、字节跳动、腾讯、Shopify等公司使用。
SWC可用于编译和打包。在编译方面，它接收使用现代JavaScript特性编写的JavaScript/TypeScript文件，并输出符合所有主流浏览器支持的有效代码。
**SWC is 20x faster than Babel on a single thread and 70x faster on four cores.**

#### 开始 📌

- 先打开 `bash` 窗口，创建一个项目目录，并用 `VSCode` 启动项目

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/4f0b1fde-be4e-4296-acc3-efb7e645fa3b)

- 接着安装依赖 `@swc/core`

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/716d6d38-988a-4999-9e56-441991ec0a6b)

- 接着创建 `src` 目录，并创建 `input.js`，和 `swc.js`，创建完成后的目录如下

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/3351fc21-aac3-49a9-b133-1f1c21b90f20)

- 然后在 `input.js` 中输入以下代码，作为后续的源代码

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/713ebc73-a474-4782-9ff1-9d30507d498c)

- 接着在 `swc.js` 中输入以下代码，引入的 `@swc/core` 和 `fs` 模块

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/3bdabb9c-c228-4243-a97d-27add2d9b8d9)

- 接着我们可以先分别感受一下 `transform` 和 `parse` 2个过程

`parse` 添加代码如下：

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/fbe0b342-824e-4151-8662-3c495f59d1c8)

`node swc.js` 输出如下：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/c9d829e8-5255-460b-be91-e824307e6ecd)

这里我想单独说一下这就是解析出来的 `Abstact Syntax Tree` ：

- **`type: 'FunctionDeclaration'`**：

  表示这是一个函数声明的节点类型。
  
- **`identifier: { ... }`**：

  这是函数声明的标识符，其中包含着名字、起始位置（就是那个 `span`）等信息。（如果你觉得不够清晰，可以 `JSON.stringify(AST, null, 2)` 输出看看）
  
- **`declare: false`**：

  表明此函数声明不是一个类型声明。

- **`params: []`**：

  表示函数参数为空数组，即此函数没有参数。

- **`decorators: []`**：

  函数装饰器列表为空数组，即此函数没有装饰器。

- **`span: { start: 1, end: 100, ctxt: 3 }`**：

  表示此函数声明在源代码中所占据的位置范围。

- **`body: { ... }`**：

  表函数体其中包着函数的抽语法结构

- **`generator: false`**：

  表示此函数不是一个 generator 函数。

- **`async: false`**：

  表示此函数不是一个异步函数。

- **`typeParameters: null`**：

  表示此函数没有指定类型参数。

- **`returnType: null`**：

  表示此函数没有指定返回类型。

---------------------------------------------------

okk~ 简单解释了一下 `AST`，我们继续 ↩️

`transform` 添加代码如下：

![carbon](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/30fe94f5-06ea-4378-9a0e-38621d820fd1)

`node swc.js` 输出如下：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/5a9bd297-43da-4273-baee-c1ef85a84ea8)

---------------------------------------------------

感受完了这俩步骤之后，我们开始来实现删除 `console.log` （如果你好奇为啥是这两步，请回看前置知识那里的图）

⚠️ 这里需要解释一下：

> `SWC` 是基于 `rust` 语言实现的，而且swc团队也希望你用 `rust`，因为这样会获得更强的性能，所以你想要真正开发插件，请用 `rust` 语言编写，并参考 swc 的[官方文档](https://swc.rs/docs/plugin/ecmascript/getting-started)

这篇文章旨在带你感受一下 `SWC`，主要目的是介绍它，所以我们这里用正则给出一个简单的 js demo 的实现：

```javascript
const swc = require('@swc/core')
const fs = require('fs')

// transform output code
async function transformCode(code) {
  const output = await swc.transform(code, {
    isModule: true,
    jsc: {
      parser: {
        syntax: "ecmascript"
      }
    }
  })
  return output
}

// generate AST
async function generateAST(code) {
  const module = await swc.parse(code, {
    syntax: "ecmascript",
    comments: false,
    script: true,
    target: 'es3',
    isModule: false,
  })
  return module
}

const code = fs.readFileSync('src/input.js', "utf-8")

async function removeConsole() {
  const {code} = await transformCode(code)
  return res.replace(/console\.log\(.*?\);?/g, "")
}

removeConsole().then(ret => console.log(ret))
```

执行 `node swc.js`

不出意外你会在控制台看到以下输出：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/b38cb1c8-ec10-4863-b679-35f442c5c58d)

到此我们也就实现了删除 `console.log`

⛔ ps：特别警告小机灵鬼们，别拿这个方案去混kpi哈！你会被开除的！相信我！

------------------------------------------------

😊okk~ 快去尝试为你的团队构建基于 `swc` 的生态工具吧~ 记得是参考官网用 `rust` 编写哦~
