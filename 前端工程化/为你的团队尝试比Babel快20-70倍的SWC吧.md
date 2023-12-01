#

## 🔥你应该了解的SWC: Speedy Web Compiler

一提起 Babel 相信大家都不会陌生，你的 `javascript compiler`，但是自从 `Rust` 大火以后，前端生态也发生了天翻覆地的变化，我们这次聊的就是重大的变化之一。

> 一个或许比 Babel 更优的选择

而事实上，很多你所熟知的开源库和框架都在拥抱 `SWC`

here we go！

更多信息请移步⬇️
[SWC的官网 https://swc.rs/](https://swc.rs/)✅

本篇文章我会以《怎么基于SWC开发`javascript`去掉代码中的`console.log`》的视角来带你领略 `SWC` 的魅力

⚠️ 阅读本文的前置知识：

- `AST(Abstract Syntax Tree)`：抽象语法树

### 正文开始👉

------------------------------------------------

#### 什么是 SWC 📌

> SWC是一个可扩展的基于Rust的平台，用于下一代快速开发工具。它被Next.js、Parcel和Deno等工具以及Vercel、字节跳动、腾讯、Shopify等公司使用。
SWC可用于编译和打包。在编译方面，它接收使用现代JavaScript特性编写的JavaScript/TypeScript文件，并输出符合所有主流浏览器支持的有效代码。
**SWC is 20x faster than Babel on a single thread and 70x faster on four cores.**

#### 开始 📌

------------------------------------------------

😊okk~ 快去尝试为你的团队构建基于 `swc` 的生态工具吧~
