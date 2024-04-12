# **【偷裤衩】Dan佬的Redux（续1）**😎

👉 引言：```这是一个源码共读的系列文章，我管它叫偷裤衩，顾名思义，非常形象，妙不可言，不可多言，回味无穷。```

1. *简单聊一下【偷裤衩】的价值：*

- **促进深入理解**: 通过集体讨论和分享经验，加深对源码的理解
- **提高编码技巧**: 学习他人的开发思路和技巧，拓宽自己的思维方式，是真的可以学到很多骚操作
- **互相学习阅读源码技巧**: 阅读源码本身也是需要一定技巧的，和经验的。
- **可能给开源社区贡献代码**: 当你阅读完源码，或途中的一些问题，可以给开源社区提issue，甚至是PR，若被维护者Merged，那你便成为了开源社区贡献者。

2. *简单聊一下【偷裤衩】的步骤：*

- **选择源码**: 选择一个对自己有价值或感兴趣的开源项目
- **分析源码结构**: 理解项目的整体架构、模块划分及依赖关系
- **解读核心代码**: 深入研究关键的核心代码实现，阅读和理解源码注释

### 开始🚀

废话不多说，续1是接《Dan佬的Redux》的，上期末尾我们聊到了`Redux`中的其他模块，`applyMiddleware`，还有`combineReducers`以及`Action`模块这些，这续1，我们就来盘一盘`applyMiddleware`。

我们直接进入`applyMiddleware.ts`，除了类型相关代码，逻辑代码仅仅30行不到，还是老规矩，我们先上源码图（由于原本代码就不多，所以我只省略了类型声明的部分）。

图1

#### 简单的思维拆解1️⃣

`applyMiddleware`的代码并不复杂，一张图就基本能概括。

图2

#### 深入理解2️⃣

```ts:line-numbers
export default function applyMiddleware(
  ...middlewares: Middleware[]
): StoreEnhancer<any> {
  return createStore => (reducer, preloadedState) => {
    const store = createStore(reducer, preloadedState)  // [!code focus]
    let dispatch: Dispatch = () => {  // [!code highlight]
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

    const middlewareAPI: MiddlewareAPI = {
      getState: store.getState,
      // 这里是传入middleware的 dispatch
      dispatch: (action, ...args) => dispatch(action, ...args) // [!code highlight]
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))  // [!code focus]
    // 这里覆写 dispatch
    dispatch = compose<typeof dispatch>(...chain)(store.dispatch)  // [!code focus]

    return {
      ...store,
      dispatch
    }
  }
}
```

::: details 点我查看`applyMiddleware`的套娃解读🔝
这里`applyMiddleware`函数接收所有的中间件函数（即`...middlewares`），特别注意一点是有一个套娃return，这里`applyMiddleware`直接返回了一个返回对象的函数的函数（`(...middlewares) => (createStore) => (reducer, preloadedState) => ({...store, dispatch})`这么个套娃法的），以便为了一层一层传入参数，并将每一层的参数闭包传入到最后的一层中进行使用，最后是用`compose`处理后的`dispatch`来复写了`applyMiddleware`中定义的`dispatch`，注意`compose`的最后一个调用，传入的原始dispatch（`store.dispatch`）。
:::

::: details 点我查看`applyMiddleware`的逻辑解读🔝
实际上`applyMiddleware`主要是通过对`createStore`返回值的覆写，把中间件应用到状态中的，在最里层，是通过调用`createStore(reducer, preloadedState)`生成状态对象（`store`），然后将状态获取方法（`getState`）和`middlewareAPI`内部定义的`dispatch`方法（注意这里并不是`createStore`返回的`dispatch`）将外层的`dispatch`传入给每一个中间件（`middleware(middlewareAPI)`），以便中间件能拿到`dispatch`的闭包引用进行相应的逻辑处理，最后将`compose`合并后的每一个中间件调用后返回的函数和最后传入原始的`store.dispatch`的函数赋值给了第一个`dispatch`，覆写了`applyMiddleware`返回值（即原始的`createStore`返回值）中的`dispatch`方法，这样也就在`createStore`返回的`dispatch`中，应用了咱们所有的中间件了。
:::

- 这里我们简单看一下`compose`方法，我删掉了一些负责鲁棒性的`if`分支。

```ts:line-numbers
export default function compose(...funcs: Function[]) {
  return funcs.reduce(
    (a, b) =>
      (...args: any) =>
        a(b(...args))
  )
}
```

::: details 点我查看`compose`的解读🔝
其实一些熟悉一些工具库或者函数式编程的小伙伴，应该对`compose`并不陌生，`compose`主要就是处理函数的合并的，这里是以一种正序调用的顺序来合并的，也就是说，咱们之前在`applyMiddleware`中通过`compose`合并后的`dispatch`就是将所有的中间件处理后返回的函数合并起来，最终由`store.dispatch`来包裹，在调用时，就会从最里面的一层开始执行，依次向外的调用（类似这样`a(b(c(d(e()))))`），也就在最终`store.dispatch`前，先正序执行了所有中间件（`middleware`）。
:::

至于中间件干了什么，我们不得而知，但是暴露给了中间件`getState`和`dispatch`的引用，而中间件也是返回一个函数回调，实际可想而知又是一个闭包的利用，最终是在`applyMiddleware`处理后返回的`dispatch`中，当调用`dispatch`时触发回调函数的，不得不说，这真的很妙~

---

以上就是`applyMiddleware`的主要逻辑了，可以看到整个的实现充斥了非常多的闭包，`scope chain`等`js`特性的利用，这次的设计便是中间件的思想，有一个小小的编程范式的利用，就是函数式编程，其中`compose`函数就很有代表性，并且中间件的思想其实也挺函数式的。后续`Redux`还有`combineReducers`等模块，我们下次继续吧~

---

🖥️写在最后：

*以上就是这期【偷裤衩】的全部内容了，阅读源码就像是读书，沿着各个源码作者的编码思路进行探索的过程，这有助于帮助自己偷师百家，成为仙道巅峰之人。*
