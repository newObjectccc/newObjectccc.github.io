# **从表单验证窥视函数式的一隅**

## 背景故事

某天我正在群里愉快的摸鱼~

- 骚胖子：我这个判断会不会挨骂？
![贴了一个图](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/2c4a0a9b42780a7a39a447b0cdf7fcf3f3fb485bb3bce1915217069f51cdbf9a5704d776c416cba7a45f7c7679133ac4?pictype=scale&from=30113&version=3.3.3.3&fname=ddd.jpg&size=750)
- 我：（不假思索）应该这么写~
![贴了一个图](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/e7d1825ca190069645780ce557212f06f75a0a2c8fe516c1268b20b51383de6be1e2e21168f818fe0f15cf3542190331?pictype=scale&from=30113&version=3.3.3.3&fname=sss.png&size=750)

我仅仅给出了一个接近函数式的代码组织形式上的示例，但是胖子也只能照猫画虎，掉入坑里，却不知道坑有多大~😎
其实他还可以做的更多~
所以我们今天就来填一下这个坑~

## 什么是函数式编程？

chatGPT给出了这样的回答：
>函数式编程是一种编程范式，主要关注使用纯函数来进行编程。在函数式编程中，函数被视为一等公民，可以像其他数据类型一样被传递、操作和组合。

----------------------------------------------------------------

我推荐一个全面学习的Repo: [https://github.com/hemanth/functional-programming-jargon](https://github.com/hemanth/functional-programming-jargon)

----------------------------------------------------------------

函数式编程的主要特征包括：

1. ⭐️**纯函数**⭐️：函数的输出只依赖于输入，不依赖于外部状态或副作用。纯函数没有可变的状态，也不会对外部状态进行修改。
2. ⭐️**不可变数据**⭐️：数据在创建后不可被修改。整个程序的数据流是通过创建新的不可变数据来实现的，而不是修改现有的数据。
3. ⭐️**高阶函数**⭐️：函数可以作为参数传递给其他函数，也可以作为返回值返回。
4. ⭐️**引用透明性**⭐️：函数的调用可以被其返回值替代，不会产生副作用。

>函数式编程的优点包括简洁性、可维护性和可测试性，它强调代码的可复用性、并发安全性和容错性。它适用于解决复杂问题和处理大规模数据集的场景，能够提高代码的可读性和可靠性。

ok，大概了解了函数式编程，我们就来看看在表单验证中如何小试牛刀。

👉注意: ```这里函数式编程范式并不是我们讨论的重点，所以如果你需要更多的函数式编程的知识，请自行google```

## 重构代码

👉再次声明: ```这里并不会全面且深入的介绍函数式编程，只是介绍一个业务中的使用```

这是第一次无脑优化过的代码：

```javascript

// 比如：Ant Design Pro 中的 Form 内置方法
function getFieldValues() {
  return {} // 假设而已
}

function validator(_, value) {
  const formStore = getFieldValues()
  checkIsTimeout(formStore)
  checkTime(formStore)
  checkIsBeyondTimeLimit(value)
}

function checkIsBeyondTimeLimit(value) {
  return new Promise((res, rej) => {
    if (!value) rej(new Error('xxx'))
    if (value.format("HH:mm").replace(/:/g, '') > 2000) rej(new Error('最早预约时间应该早于最晚预约时间'))
    res('success')
  })
}

function checkTime(store) {
  return new Promise((res, rej) => {
    if (store.earliestTakeoutDay > ) rej(new Error('最早预约时间应该早于最晚预约时间'))
    res('success')
  })
}

function checkIsTimeout(store) {
  return new Promise((res, rej) => {
    if (store.earliestTakeoutDay > store.latestTakeoutDay) rej(new Error('最早预约时间应该早于最晚预约时间'))
    res('success')
  })
}


```

接下来重构（目的：脱离业务逻辑，降低业务耦合度，以便可以高内聚，并且使之更加符合函数式编程的理念）

```javascript
/* 
 *  首先我们声明一些工具函数，
 *  这里我们不去纠结一些边界的处理，
 *  或是工具的不同实现方式了哈，
 *  因为我们的重点是窥视函数式编程的一隅，
 *  
 */

/**
 * 这里先介绍一下管道函数，他把传入的函数按顺序组合在一起，
 * 上一个函数的执行结果作为下一个函数的入参，下面会用到
 *  */
function pipeline(...fnArr) {
  return (...args) => fnArr.reduce((acc, fn) => [fn(...acc)], args)[0]
}

const splitStr = (str) => str.split(',')
const reverseArr = (arr) => arr.reverse()
const joinArr = (arr) => arr.join(',')

const reverseStringFunc = pipeline(splitStr, reverseArr, joinArr)
console.log(reverseStringFunc('1,2,3,4,5,6,7,8,9'))
// '9,8,7,6,5,4,3,2,1'
```

尝试应用到业务中

```javascript
// 函数式有时候像是把一件复杂事情拆成很多单一的简单事情
// 就像是把分子拆成原子，甚至更小
const findMax = (...rest) => Math.max(...rest.map(Number))
const findMin = (...rest) => Math.min(...rest.map(Number))
const isBiggerOrEqual = (judge) => (val) => val >= Number(judge)
const isSmallerOrEqual = (judge) => (val) => val <= Number(judge)
const rejectByError = (errMsg) => (isPass) => isPass ? isPass : Promise.reject(new Error(errMsg))

/**
 *  比如一个业务是：检测传入的参数中是否是最后一个最大
 *  我们可以用上面 5 个简单函数合并出来 N 个复杂函数
 *  通过合成出来的复杂函数，可以直接应用到表单的 validator 中去
 *  */
const checkIsLastOneBiggest = (...args) => pipeline(findMax, isBiggerOrEqual(args.at(-1)), rejectByError('所选值必须小于等于最后一个值'))(...args)
const checkIsFirstOneBiggest = (...args) => pipeline(findMax, isBiggerOrEqual(args.at(0)), rejectByError('所选值必须小于等于第一个值'))(...args)
const notLessThan2000 = pipeline(findMin, isBiggerOrEqual(2000), rejectByError('所选值不能小于2000'))
const sholdLessThan2000 = pipeline(findMax, isSmallerOrEqual(2000), rejectByError('所选值不能大于2000'))
```

好了，以上就是我今天要水的所有内容了~

```所谓留图不留种，其心可诛，既然不是啥正人君子，那咱们就敞开了说，虽然这篇文章目的不是全面和深入的介绍函数式编程，但是也比较推荐把函数式思想应用到业务中的，为此，我还推荐一个函数式编程的工具库和一个优秀的实践开源项目库```

工具库请移步 👉 [Underscore.js](https://github.com/jashkenas/underscore)
优秀实践请移步 👉 [RxJS](https://github.com/ReactiveX/rxjs)
 
> 2023/12/01 patch：今天我发现了一个JavaScript的feature，但是还在TC39的第2阶段，也就是草案阶段，但真的让人兴奋！
