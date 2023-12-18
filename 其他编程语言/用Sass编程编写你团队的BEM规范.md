#

## 🚀用Sass编程编写你团队的BEM规范

相信有很多小伙伴都有想过要在 JavaScript 和 TypeScript 之外再学一门新编程语言，但是翻开冗长的语言学习又瞬间被劝退。

作为前端小伙伴，入门便需要会3门语言（HTML，CSS，JavaScript），但是随着门槛越来越高，还有一些领域特定语言（Domain-Specific Language），比如Sass，Less等等，随着BEM的css最佳实践的普及，大家也开始在用`nav__span--currentShow`的方式在命名`class`，
在你的 `.scss` 中会出现如下代码：

```sass
.tab {
  color: blue;
  &__input {
    color: red;
    &--active {
      color: white;
    }
  }
}
```

或许目前你觉得还好，但是如果有更多的 `Element`，更多的 `Modifier` 呢？

```sass
.tab {
  color: blue;
  &__input {
    color: red;
    &--active {
      color: white;
    }
  }
  &__div {
    color: #444;
    &--active {
      color: #333;
    }
    &--show {
      color: #222;
    }
  }
  /** 等等很多 */
}
```

你既然会 `Sass, Less` 这些 `DSL`，为啥不封装一个更友好的使用方式呢？

今天我们就以 `BEM` 做一个简单的 `Sass` 入门，意在抛砖引玉，让你发现，原来你可以为你的团队做的更多~

### 正文开始👉

------------------------------------------------

以下文章会假设你有 `Sass` 语言基础，如果你还没有清楚，也别怕，我们用到的也就一点点简单语法，这里简单列举一下：

1. `@mixin 变量名`: *定义混合指令。*
2. `$变量名: 变量值`: *定义变量和值。*
3. `#{$变量}`: *插值表达式，会编译成 **“$变量”** 的结果。*
4. `@if 表达式 {} @else if 表达式 {} @else {}`: *条件控制语句。*
5. `@include 变量名`: *调用定义的`@mixin`*

或许有熟悉 `Sass` 语法的小伙伴会有疑问为什么不用 `@extend`，这里不多做解释，感兴趣的同学[💡可以看这里](https://www.sass.hk/skill/sass143.html)

接下来咱们直接上代码：

先定义咱们的 `@mixin bem`

```sass
// 用 @mixin 在 sass 主文件或工具文件中定义 bem
@mixin bem($blk, $ele: "", $mod: "") {
  @if $mod != "" {
    .#{$blk} {
      &__#{$ele} {
          &--#{$mod} {
            @content;
          }
      }
    }
  } @else if $ele != "" {
    .#{$blk} {
      &__#{$ele} {
        @content;
      }
    }
  } @else {
    .#{$blk} {
      @content;
    }
  }
}
```

在你需要使用的地方引入并用 `@include bem` 调用，别忘记按`Block`,`Element`,`Modifier`的顺序传入参数~

```sass

body {
  background: #333;
}
// 在你需要使用的地方使用
@include bem("tab") {color: blue;}
@include bem("tab", "input") {color: red;}
@include bem("tab", "input", "active") {color: white;}

```

这里我们需要注意一下细节:
`Sass` 中你需要使用可选参数时，直接给出默认值就好，否则是必传参数

编译出来的结果如下：

```css
body {
  background: #333;
}
.tab {
  color: blue;
}
.tab__input {
  color: red;
}
.tab__input--active {
  color: white;
}
```

为了方便各位调试（推荐使用`codepen`），这里给出`Html`代码：

```html
<html>
  <body>
     <div class="tab tab__input tab__input--active">从右往左依次删掉class试试</div>
  </body>
</html>
```

------------------------------------------------

😊okk~ 快去封装你的 `BEM` 吧，今天就水到这儿~
