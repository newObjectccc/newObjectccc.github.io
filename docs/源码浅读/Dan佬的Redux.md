# **【偷裤衩】Dan佬的Redux**

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

### 开始

废话不多说，我们直接从项目入口开始，Redux 的 Repo 不算复杂，就不详细介绍了。

直接来到 `src/index.ts`，我过滤掉了一些导出的类型模块。

图1

可以从导出的一些模块中，看到`Redux`的一些大概功能，这次我们会主要看`createStore`模块。

图2

下面代码，我们去到`createStore.ts`，我删掉了一些跟主逻辑无关的代码，比如：`if`判断分支，大部分是为了抛出错误。（和主逻辑无关，并不代表不重要，反而在正常编码中非常依赖这些`if`分支给程序做鲁棒性的建设，只是这里我们不用关注）

图3

#### 简单的思维拆解

`createStore`函数内部有以下6个变量定义：

- `let currentReducer = reducer`
- `let currentState`
- `let currentListeners = new Map()`
- `let nextListeners = currentListeners`
- `let listenerIdCounter = 0`
- `let isDispatching = false`

`createStore`函数内部有以下6个方法定义：

- `function ensureCanMutateNextListeners`
- `function getState`
- `function subscribe`
- `function dispatch`
- `function replaceReducer`
- `function observable`

`createStore`函数最终导出一个`store`对象：

```ts:line-numbers {1}
  const store = {
    dispatch: dispatch as Dispatch<A>,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  } as unknown as Store<S, A, StateExt> & Ext
  return store
```

#### 事实上的内容

事实上我们只需要搞清楚这一个函数是怎么运行的，也就差不多搞懂了 `redux` 的核心之一，你没有看错，`redux` 的 `createStore` 就是这么简洁高效。

#### 深入理解

```ts:line-numbers {1}
function ensureCanMutateNextListeners() {
  if (nextListeners === currentListeners) {  // [!code focus]
    nextListeners = new Map()  // [!code focus]
    currentListeners.forEach((listener, key) => {
      nextListeners.set(key, listener)
    })
  }
}
```

::: details 点我查看`ensureCanMutateNextListeners`函数定义解读
可以看到`ensureCanMutateNextListeners`函数内部的`if`分支当`currentListeners`和`nextListeners`严格相等时会执行，而`if`代码执行后`nextListeners = new Map()`，然后把当前的`Listeners`都添加到里面去，后续在`dispatch`方法那里会被赋值`currentListeners = nextListeners`，也就是把下一个监听者复制到当前监听者，因为在`dispatch`的时候也就会调用`listeners`里面的每一个`listener`方法，也就是告诉每一个监听者内部状态的变化。
:::

```ts:line-numbers {1}
function subscribe(listener: () => void) {
  let isSubscribed = true

  ensureCanMutateNextListeners()  // [!code focus]
  const listenerId = listenerIdCounter++
  nextListeners.set(listenerId, listener)

  return function unsubscribe() {

    isSubscribed = false

    ensureCanMutateNextListeners()  // [!code focus]
    nextListeners.delete(listenerId)
    currentListeners = null
  }
}
```

::: details 点我查看`subscribe`函数定义以及`ensureCanMutateNextListeners`函数的调用解读
而该函数的调用是在`subscribe`函数内，和`subscribe`函数返回值`unsubscribe`函数内分别被调用了一次，就如同它的函数名一样，只是为了确保可以修改`nextListeners`这个变量，因为在`subscribe`调用时需要把传入的`listener`加入到`nextListeners`里面去，而在`unsubscribe`里要进行删除对应的`listener`的操作，这里可以注意一下，巧妙的利用闭包，实现了`unsubscribe`函数，真是无处不在的闭包啊。
:::

```ts:line-numbers {1}
function getState(): S {
  /* 我知道这个函数有点脱裤子放屁，
   * 但是其实这里有个 if 判断，
   * 提升程序鲁棒性，被我省略了而已
   */
  return currentState as S
}
```

::: details 点我查看`getState`函数定义解读
这个`getStatue`相对简单，主要是为了安全返回`currentState`。
:::

```ts:line-numbers {1}
function observable() {
  const outerSubscribe = subscribe // [!code highlight]
  return {
    subscribe(observer: unknown) {
      function observeState() {
        const observerAsObserver = observer as Observer<S>
        if (observerAsObserver.next) {
          observerAsObserver.next(getState())
        }
      }

      observeState()
      const unsubscribe = outerSubscribe(observeState) // [!code highlight]
      return { unsubscribe }
    },

    [$$observable]() {
      return this
    }
  }
}
```

::: details 点我查看`observable`函数定义解读
`observable`函数把上下文中的`subscribe`函数在其内部**rename**，然后返回了一个包含一个新的`subscribe`方法的对象，这个方法接受一个观察者`observer`，又在方法内部定义了一个`observerState`的函数并执行，该函数实际上就是为了在你订阅（调用`subscribe`）的时候，主动触发一次观察者（`observer`）的`next`方法，并传入当前上下文中的`currentState`，总结来说也就是订阅的时候就获取一次当前的state，最后利用`outerSubscribe`（上下文中的`subscribe`）真正完成订阅这个操作，最后通过引用传递导出取消订阅的函数，外部用的，其实就是`observable`函数导出的这个对象。
:::

```ts:line-numbers {1}
function dispatch(action: A) {
  try {
    isDispatching = true
    currentState = currentReducer(currentState, action)
  } finally {
    isDispatching = false
  }

  const listeners = (currentListeners = nextListeners)
  listeners.forEach(listener => {
    listener()
  })
  return action
}
```

::: details 点我查看`dispatch`函数定义解读
`dispatch`这里首先会尝试调用`currentReducer`（`createStore`传入的第一个参数），并且传入当前的状态和操作类型（`currentState`和调用`dispatch`时传入的`action`），然后把`currentReducer`的返回值赋值给当前的状态（`currentState`），接着定义了`listeners`，把`nextListeners`赋值给`currentListeners`和`listeners`，然后遍历触发`listener`通知状态更新（这里有发布订阅的思想）。
:::

```ts:line-numbers {1}
function replaceReducer(nextReducer: Reducer<S, A>): void {
  currentReducer = nextReducer as unknown as Reducer<S, A, PreloadedState>
  dispatch({ type: ActionTypes.REPLACE } as A)
}
```

::: details 点我查看`replaceReducer`函数定义解读
`replaceReducer`函数的逻辑也不复杂，主要是为了替换当前的**reducer**，并且在把传入的**reducer**（函数传入的`nextReducer`）赋值给当前上下文中的**reducer**（原本`createStore`调用时传入的**reducer**），然后手动触发一次`dispatch`方法，以触发更新状态和通知观察者的整个逻辑。
:::

---

以上就是`createStore`的主要逻辑了，可以看到整个的实现充斥了非常多的闭包，`scope chain`等`js`特性的利用，设计模式主要是观察者模式（`subscribe`函数，以及`observable`函数）和发布订阅模式（`dispatch`中的`forEach`调用，派发更新通知），当然了，`Redux`的核心模块不止`createStore`，还有中间件的思想（`applyMiddleware`），还有合并**reducer**等。我们下次继续吧~

---

🖥️写在最后：

*以上就是这期【偷裤衩】的全部内容了，阅读源码就像是读书，沿着各个源码作者的编码思路进行探索的过程，这有助于帮助自己偷师百家，成为仙道巅峰之人。*
