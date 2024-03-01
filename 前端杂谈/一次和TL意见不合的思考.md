#

## 🔥一次与TL的碰撞

一次CR会议上，有团队同学的代码被TL质疑。

- 背景：
  在React中，当state本身是数组时，对于state进行删除操作时，对于怎么合理使用js数组api以达到最优性能问题，即下图所示case：
![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/95a2f1e0-d790-4f7a-be3e-0b2ddf3b3ace)

TL: 要求改用 Array.prototype.findIndex + Array.prototype.splice，因为性能更好。
我：应该保留 Array.prototype.filter，从代码来看，在setState这里性能更好。

后来在TL私下找我，要求我写一篇报告，于是我在内部写了这样的一个 benchmark 报告。

------------------------------------------------

## 内部报告

- 本benchmark的关注点有以下几点：
    1. 因为React的setState是默认做的深比较，所以我们会关注在成功改变state并触发视图更新为基准。
    2. 同时我们也期望大家单独认识一下这2个方案，仅在JavaScript常见2个runtime下的执行耗时。

### 开始之前提醒

  若你对于js中数组原型链上这3个api还不是很了解的话，建议上MDN恶补一下，本文不会介绍过于基础的概念。
  
### 声明

  每个benchmark案例，均会测试多次，并不是一次执行的结果，但所有运行平台均为 x86 平台，并没有在 arm 架构平台上进行测试，请知悉。
  
### 测试开始

  模拟 setState 有效更新：

  1. 第一个案例对比，chrome浏览器：
  以下给出执行案例，数值越大，耗时越久，性能越差:

  ```javascript
  const arr = new Array(100000).fill('1');
  // splice
  function fn1() {
    const b = window.performance.now(); // 开始计时
    const idx = arr.findIndex((i) => i === '1');
    arr.splice(idx, 1);
    [...arr]; // 如果这里不明白为什么，建议了解一下 React 中 setState 为什么是默认深比较
    console.log(window.performance.now() - b); // 执行结束计算差值
  }
  // filter
  function fn2() {
    const b = window.performance.now(); // 开始计时
    arr.filter((i) => i !== '1');
    console.log(window.performance.now() - b); // 执行结束计算差值
  }
  
  fn2();
  // 1.2999999523162842
  fn1();
  // 5.100000023841858
  ```

  ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/ece17d2a-58e1-406d-a14a-b60ca4901d2a)
  
  **当前结论：** *浏览器环境下，要setState，在删除数组数据上，即便是最有利于findIndex + splice组合的方案下，filter性能依旧优于findIndex + splice。（最有利是指实际算法时间复杂度是O(1)，即遍历到第一个元素即停止的情况）*
  2. 第二个案例对比，node环境：
  以下给出执行案例，duration数值越大，耗时越久，性能越差:

  ```javascript
  const { performance, PerformanceObserver } = require('perf_hooks');
  
  // const performFn2 = performance.timerify(fn2);
  const performFn1 = performance.timerify(fn1);
  
  const obs = new PerformanceObserver((list) => {
    console.log(list.getEntries()[0]);
  });
  
  obs.observe({ entryTypes: ['function'] });
  
  const arr = new Array(100000).fill('1');
  function fn1() {
    const idx = arr.findIndex((i) => i === '1');
    arr.splice(idx, 1);
    [...arr];
    console.log('fn1 end');
  }
  function fn2() {
    arr.filter((i) => i !== '1');
    console.log('fn2 end');
  }
  
  // performFn2();
  performFn1();
  
  // >node test.js
  // fn1 end
  // PerformanceEntry {
  //   name: 'fn1',
  //   entryType: 'function',
  //   startTime: 47.575900077819824,
  //   duration: 7.042899966239929,
  //   detail: []
  // }
  
  // >node test.js
  // fn2 end
  // PerformanceEntry {
  //   name: 'fn2',
  //   entryType: 'function',
  //   startTime: 43.3853999376297,
  //   duration: 7.89139997959137,
  //   detail: []
  // }
  ```

  ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/f2c89955-2f6f-44a4-bbde-0070a8bb7f09)
  
  **当前结论：** *node环境下，也就是说SSR（Server-Side Rendering）情况下，要setState，在删除数组数据上，findIndex + splice 和 filter 相比，稍稍领先千分之一秒左右，不过同样是以对 splice 方案最有利的情况测试的，经测试10w数组长度，当实际时间复杂度在O(50000)的时候，splice的方案反而比filter多千分之一秒左右耗时，这里我也给出测试案例，见以下代码。*
  
  ```javascript
  const { performance, PerformanceObserver } = require('perf_hooks');
  
  // const performFn2 = performance.timerify(fn2);
  const performFn1 = performance.timerify(fn1);
  
  const obs = new PerformanceObserver((list) => {
    console.log(list.getEntries()[0]);
    // console.log(list.getEntries()[1]);
  });
  
  obs.observe({ entryTypes: ['function'] });
  
  const arr = new Array(100000).fill('1');
  arr.splice(49999, 0, '2');
  
  function fn1() {
    const idx = arr.findIndex((i) => i === '2');
    arr.splice(idx, 1);
    [...arr];
    console.log('fn1 end');
  }
  function fn2() {
    arr.filter((i) => i !== '1');
    console.log('fn2 end');
  }
  
  // performFn2();
  performFn1();
  
  // >node test.js
  // fn2 end
  // PerformanceEntry {
  //   name: 'fn2',
  //   entryType: 'function',
  //   startTime: 44.771600008010864,
  //   duration: 8.134600043296814,
  //   detail: []
  // }
  
  // >node test.js
  // fn1 end
  // PerformanceEntry {
  //   name: 'fn1',
  //   entryType: 'function',
  //   startTime: 45.54419994354248,
  //   duration: 9.378000020980835,
  //   detail: []
  // }
  ```

  ![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/03bcf4a0-485d-446a-b265-e7989754ec65)
  
  **最终只能得出条件性结论：** *综合测试结果来看，不论是CSR还是SSR，只要是需要在删除数组元素并用于React更新视图的场景下，都优先选择filter更好。*
  
  > 💡然而几乎没有什么东西是绝对的，特别需要注意一下的是，传入filter的比较函数本身也是有性能消耗的，假如你这个比较函数本身比较耗性能，那么并不建议你用filter。

聪明的小伙伴应该能意识到，splice方案落后的关键点在于 ```[...arr]``` 这行代码，之所以这样做，是因为你需要满足React更新视图的深比较规则，必须给一个新数组，而splice是直接改变原数组，内存地址根本没有改变，深比较的时候，React只会认为你没有改变state，也就不会更新视图，而filter是会返回一个新数组的，所以正中React的state浅比较的点，所以这个case，filter险胜。

**最终，还并没有完结**

💡💡💡因为还有一个黑魔法！！！那就是`Array.prototype.concat`这个因为其功能被严重低估的API，这个API很强大，强大到可以强势逆转咱们上面的结论，我们都知道其实单论splice和filter的性能，那一定是splice更好的，但是因为是需要去setState所以需要一个新数组，那么splice就势必要多一个创建新数组的操作，我们之前使用的是大家最常用的`[...arr]`，但是如果你考虑用`concat`，那么一切会变得不一样，看下图。

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/a0771fec-639f-4908-8246-3becde6aa4b6)

差距如此之大，同样是返回一个新数组，但是当你有创建一个新数组的需求的时候，第一时间大概率不会想到用`concat`，然而对于返回一个新数组，他的性能是如此的出色，所以我愿意称它为黑魔法~

------------------------------------------------

## 但是我有更多思考（没有在内部报告中体现）

  1. 首先是关于在会上我直接反驳TL的行为，我觉得技术圈子就应该有技术圈子的氛围，在我看来这种反驳是良性的。
  2. 个人认为对于CR，关注点可以不用纠结到这种ms级别，在真正成为瓶颈前，我认为CR关注的重心应该是代码的可读性，鲁棒性，组织规范等（就好像大家都知道js中倒叙的for循环最快，但是少有开源库会采用呢？更多的还是forEach，while之类，反而开源库往往代码可读性会高很多）。
  3. 在下来同事讨论过程中，我发现大部分的同事都没有意识到我和TL纠结的点，以致于这次冲突几乎就是我俩自嗨。

1，2两点，我仅仅阐释自己的看法，关于第3点，我想借此文多写一点：

### 首先我想简单说说这两个数组原型链上的api（Array.prototype.findIndex就不说了，我的关注点不在这里。）

导致我和我的TL有所分歧的，其实就是```Array.prototype.filter```和```Array.prototype.splice```的背后原理，但我俩似乎对于这个并不矛盾，他大概率只是忽略了，这是一个React，state的场景，同事需要用删除后的数组，去setState更新视图，而这一步，由于React的state在比较时是用的深比较，所以对于生成新数组这一步是省略不掉的，除非你用其他方式触发更新。

虽然这两个 api 很基础，背后原理也应该是大家都知道的，但是！！！，因为我发现其他同事比较模糊，所以还是想多写一点东西。

#### Array.prototype.filter

我只贴了简短的描述：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/99865ad1-c9b6-42ca-b092-c8b4d1a58bc9)

建议[点这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)看看MDN的具体描述。

[TC39](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.filter) 对于 Array.prototype.filter 的定义：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/a6e4392d-f68e-49a3-9bcc-053faf2e7355)

有了TC39的标准我们就可以重写一个 filter

```javascript
function filter(array, callback, thisArg) {
  if (array == null) {
    throw new TypeError('Array.prototype.filter called on null or undefined');
  }

  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }

  let res = [];
  for (let i = 0; i < array.length; i++) {
    if (Object.prototype.hasOwnProperty.call(array, i)) {
      let val = array[i];
      if (callback.call(thisArg, val, i, array)) {
        res.push(val);
      }
    }
  }
  return res;
}

filter([1,2,3,4,5],(i) => i > 2)
// [3,4,5]
```

#### Array.prototype.splice

我只贴了简短的描述：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/160bb9ee-cf10-496c-a46b-32deaaaf1258)

建议[点这里](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)看看MDN的具体描述。

[TC39](https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.splice) 对于 Array.prototype.splice 的定义：

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/206db858-cdad-4a5f-8642-7d4ac8429968)
![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/a66349ee-266d-424d-a9ff-d8870dc03b53)

有了TC39的标准我们就可以重写一个 splice

```javascript
function splice(array, start, deleteCount, ...items) {
  if (array == null) {
    throw new TypeError('Array.prototype.splice called on null or undefined');
  }

  let len = array.length;
  let relativeStart = Number(start);
  // 不能从负数开始，且不能超过数组原始长度
  let actualStart = relativeStart < 0 ? Math.max(len + relativeStart, 0) : Math.min(relativeStart, len);
  // 同样的，删除的总数如果没传，则删掉 len - actualStart 个，也就是从actualStart删到最后，如果传了也要抹平负数，
  let actualDeleteCount = deleteCount === undefined ? len - actualStart : Math.min(Math.max(Number(deleteCount), 0), len - actualStart);
  // 用于返回的Array
  let A = new Array(actualDeleteCount);
  // 删除的元素添加进返回的Array里
  for (let k = 0; k < actualDeleteCount; k++) {
    A[k] = array[actualStart + k];
  }

  // 特别注意Array.prototype.splice的第三个参数，在这里是第四个参数，是因为他的长度决定了下面的分支结构
  // items.length < actualDeleteCount 相当于是删除
  // items.length > actualDeleteCount 相当于是增加
  let itemCount = items.length;
  if (itemCount < actualDeleteCount) {
    for (let k = actualStart; k < len - actualDeleteCount; k++) {
      array[k] = array[k + actualDeleteCount];
    }
    array.length = len - actualDeleteCount + itemCount;
  } else if (itemCount > actualDeleteCount) {
    for (let k = len - actualDeleteCount; k > actualStart; k--) {
      array[k + itemCount - 1] = array[k - 1];
    }
  }

  for (let k = 0; k < items.length; k++) {
    array[actualStart + k] = items[k];
  }

  return A;
}

splice([1,2,3,4,5], 3, 1)
// [4]
```

需要提及的是，得益于JavaScript中一切皆对象的设计，V8，jsCore等引擎可以对Javascript的Array的数据结构做很多优化工作，所以一些其他语言的小伙伴可以看到，js的数组添加元素，删除元素，既不需要手动后移，也不需要手动前移起始点后面的元素，甚至数组长度是动态可修改的。

当然这个有机会我们再聊其他语言吧~

希望以上的基础补充能够帮助到你~

------------------------------------------------

😊okk~ 补完这点基础，关于这次的思考就水到这里吧~
