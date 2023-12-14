#

## 🚀通过源码敷衍地学习Rust一丢丢的基础语法

相信有很多小伙伴都有想过要在 JavaScript 和 TypeScript 之外再学一门新编程语言，但是翻开冗长的语言学习又瞬间被劝退。

这次我们目的不是学会，而是图快速，敷衍式的学习，当你抱着学会的目的学习却难以开始时，为何不考虑"敷衍"自己呢？难道敷衍真的学不到东西了吗？

本文章观点仅代表我个人的方法论，并非普世的学习方法，请勿对号入座！

此文只适合想了解Rust的同学简单做个语法体验，不适合高段位同学，毕竟笔者也才学了 Rust 2天就心血来潮想记录一下而已...

以下内容仅适合没有了解过`Rust`的小伙伴，做体验，了解，并不适合真正入门`Rust`语言，请知悉。

另外，因为我是前端，所以我会尽量用前端的iterm来讲述，需要八股面试的同学请直接退出本文。

here we go！🚀

ps：以下是基于前几周发现的 Rust 开源项目 `ast-grep` 的一个rs文件源码的阅读，希望深入的同学请去到 [github](https://github.com/ast-grep/ast-grep) 主页~

### 正文开始👉

------------------------------------------------

我选取了一个较为简单的rs文件，地址是：[https://github.com/ast-grep/ast-grep/blob/main/crates/core/src/lib.rs](https://github.com/ast-grep/ast-grep/blob/main/crates/core/src/lib.rs>)，我会按照代码顺序及源码作者的代码组织形式来做大概的`Rust`语法讲解，有基础的同学可自行理解代码逻辑。

```rust
pub mod language;
pub mod matcher;
pub mod meta_var;
pub mod ops;
pub mod replacer;
pub mod source;
pub mod traversal;

#[doc(hidden)]
pub mod pinned;

mod match_tree;
mod node;

pub use language::Language;
pub use matcher::{Matcher, NodeMatch, Pattern, PatternError};
pub use node::Node;
pub use source::{Doc, StrDoc};

#[doc(hidden)]
pub use node::DisplayContext;

use replacer::Replacer;

use node::Root;
use source::{Edit, TSParseError};

```

1. 形如`pub mod <xxx>`的代码，都是在声明一个公共模块。`pub` 是 public 的意思，`mod` 是 module 的意思
这是 `Rust` 里面声明公共模块的关键字，如果不加 `pub` 默认是私有的。
2. 形如`#[doc(hidden)]`的部分并非注释，而是显式的声明以下函数或模块不会在标准文档中显示的，这里文档类似于`jsDoc`中的注释，其他语言的`///`。
3. 形如`<xxx>::<yyy>`的代码，是表示某个模块中的某个属性的访问，除此之外，`Rust`项目的目录文件路径也是`::`来访问的，类似于`js`中的`/`。
4. 形如`pub use <xxx>::<Yyy>`的部分，表示引入`<xxx>`模块内的`<Yyy>`结构体（类似js中对象），成为当前模块的成员。`use`的作用就可以让你在当前模块中直接通过`<Yyy>`访问该成员。
5. 形如`<xxx>::{<Yyy>, <Zzz>}`的部分，是表示引入`<xxx>`模块的`<Yyy>, <Zzz>`结构体，有点像ES6的解构赋值。

```#[derive(Clone)]
pub struct AstGrep<D: Doc> {
  #[doc(hidden)]
  pub inner: Root<D>,
}
impl<D: Doc> AstGrep<D> {
  pub fn root(&self) -> Node<D> {
    self.inner.root()
  }

  pub fn edit(&mut self, edit: Edit<D::Source>) -> Result<&mut Self, TSParseError> {
    self.inner.do_edit(edit)?;
    Ok(self)
  }

  pub fn replace<M: Matcher<D::Lang>, R: Replacer<D>>(
    &mut self,
    pattern: M,
    replacer: R,
  ) -> Result<bool, TSParseError> {
    if let Some(edit) = self.root().replace(pattern, replacer) {
      self.edit(edit)?;
      Ok(true)
    } else {
      Ok(false)
    }
  }

  pub fn lang(&self) -> &D::Lang {
    self.inner.lang()
  }

  /// Use this method to avoid expensive string encoding overhead
  /// TODO: add more documents on what is happening
  pub fn doc(d: D) -> Self {
    Self {
      inner: Root::doc(d),
    }
  }
}

impl<L: Language> AstGrep<StrDoc<L>> {
  pub fn new<S: AsRef<str>>(src: S, lang: L) -> Self {
    Self {
      inner: Root::new(src.as_ref(), lang),
    }
  }

  /*
  pub fn customized<C: Content>(content: C, lang: L) -> Result<Self, TSParseError> {
    Ok(Self {
      inner: Root::customized(content, lang)?,
    })
  }
  */
  pub fn source(&self) -> &str {
    self.inner.doc.get_source().as_str()
  }

  pub fn generate(self) -> String {
    self.inner.doc.src
  }
}

#[cfg(test)]
mod test {
  use super::*;
  use language::Tsx;
  use ops::Op;

  pub type Result = std::result::Result<(), TSParseError>;

  #[test]
  fn test_replace() -> Result {
    let mut ast_grep = Tsx.ast_grep("var a = 1; let b = 2;");
    ast_grep.replace("var $A = $B", "let $A = $B")?;
    let source = ast_grep.generate();
    assert_eq!(source, "let a = 1; let b = 2;"); // note the semicolon
    Ok(())
  }

  #[test]
  fn test_replace_by_rule() -> Result {
    let rule = Op::either("let a = 123").or("let b = 456");
    let mut ast_grep = Tsx.ast_grep("let a = 123");
    let replaced = ast_grep.replace(rule, "console.log('it works!')")?;
    assert!(replaced);
    let source = ast_grep.generate();
    assert_eq!(source, "console.log('it works!')");
    Ok(())
  }

  #[test]
  fn test_replace_unnamed_node() -> Result {
    // ++ and -- is unnamed node in tree-sitter javascript
    let mut ast_grep = Tsx.ast_grep("c++");
    ast_grep.replace("$A++", "$A--")?;
    let source = ast_grep.generate();
    assert_eq!(source, "c--");
    Ok(())
  }

  #[test]
  fn test_replace_trivia() -> Result {
    let mut ast_grep = Tsx.ast_grep("var a = 1 /*haha*/;");
    ast_grep.replace("var $A = $B", "let $A = $B")?;
    let source = ast_grep.generate();
    assert_eq!(source, "let a = 1 /*haha*/;"); // semicolon

    let mut ast_grep = Tsx.ast_grep("var a = 1; /*haha*/");
    ast_grep.replace("var $A = $B", "let $A = $B")?;
    let source = ast_grep.generate();
    assert_eq!(source, "let a = 1; /*haha*/");
    Ok(())
  }

  #[test]
  fn test_replace_trivia_with_skipped() -> Result {
    let mut ast_grep = Tsx.ast_grep("return foo(1, 2,) /*haha*/;");
    ast_grep.replace("return foo($A, $B)", "return bar($A, $B)")?;
    let source = ast_grep.generate();
    assert_eq!(source, "return bar(1, 2) /*haha*/;"); // semicolon
    Ok(())
  }
}rust

```

1. 形如`#[derive(Clone)]`的代码，是为了显式声明以下结构体可以被克隆，它是`rust`里面的“宏”，有点像`js`中的`JSON.stringify`，只是它的写法更像是装饰器语法，他其实是帮结构体实现了`Clone` trail 的 `clone()` 方法，下面这样。

```rust
impl Clone for AstGrep<D> {
  fn clone(&self) -> Self {
    AstGrep {
      inner: self.inner.clone(),
    }
  }
}
```

2. 形如`pub struct <Xxx<A: Abc>>`的代码，表示定义了一个`<Xxx>`公共结构体。
3. 形如`<Xxx<A: Abc>>`的代码，表示这个`<Xxx>`结构体泛型参数`A`必须是`Abc`的类型，这里和`ts`非常相似。
4. 形如`pub <xxx>: Root<D>,`的代码，表示声明一个`<xxx>`的“域”，“域”是指结构体或枚举类型的成员，可以是变量，方法或者其他类型，这里定义了“域”的类型是`Root<D>`。
5. 形如`impl<D: Doc> AstGrep<D> {}`的部分，是指对`AstGrep<D>`结构体的实现，可以简单的把`struct`理解为`ts`中的`interface`，把`impl`理解为`ts`中的`implememt`。
5. 形如`pub fn <xxx_yyy_zzz>(&self) -> Node<D> {}`的代码，是声明了一个名为`<xxx_yyy_zzz>`的公共函数, `->`是指函数返回值类型，`&self`是对于实例的引用，类似于`js`中的`this`，需要注意一下`&`符号，他是引用的意思，意味着不可变，涉及`Rust`语言中“所有权”的解释，这里不展开。
6. 形如`&mut <xxx>`的代码，是指引用`<xxx>`变量，并且是可变，可修改的。
7. 扩展一下，形如`let mut <xxx>`"mut"加在变量名的前面，意味着这个变量是可变的。
8. 扩展一下, `Rust`中的`{}`中的代码如果直接写表达式或字面量，是会返回结果的。比如 `if x>1 { true } else { false }`
9. 代码里有一些形如`<xxx>(a)?`的代码，这个`?`需要和`Ok(<xxx>)`联系起来，是因为函数返回值为`Result<A, B>`类型，`A`就是`Ok(<xxx>)`的返回值`<xxx>`，`B`就是那个带`?`的地方执行出错会抛出错误，不得不说`Rust`处理`try, catch`是真的优雅。

------------------------------------------------

😊okk~ 今天的敷衍就到这儿吧~
