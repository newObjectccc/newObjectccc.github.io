# **【偷裤衩】美团Logan库**

👉 引言：```这是一个源码共读的系列文章，我管它叫偷裤衩，顾名思义，非常形象，妙不可言，不可多言，回味无穷。```

> *ps：源码共读是一个需要反馈，才能越做越好的，可能有一些我没关注到的点，读者希望跟多解读一些什么方向或者各种其他的观点，请到Repo给我留下 `issue` 吧！非常感谢！*

1. *简单聊一下【偷裤衩】的价值：*

- **促进深入理解**: 通过集体讨论和分享经验，加深对源码的理解
- **提高编码技巧**: 学习他人的开发思路和技巧，拓宽自己的思维方式，是真的可以学到很多骚操作
- **互相学习阅读源码技巧**: 阅读源码本身也是需要一定技巧的，和经验的。
- **可能给开源社区贡献代码**: 当你阅读完源码，或途中的一些问题，可以给开源社区提issue，甚至是PR，若被维护者Merged，那你便成为了开源社区贡献者。

2. *简单聊一下【偷裤衩】的步骤：*

- **选择源码**: 选择一个对自己有价值或感兴趣的开源项目
- **分析源码结构**: 理解项目的整体架构、模块划分及依赖关系
- **解读核心代码**: 深入研究关键的核心代码实现，阅读和理解源码注释
- **提出问题和讨论**: 在共读小组中提出疑问并与其他成员进行讨论，分享自己的理解和解决方案
- **实践和改进**: 将学到的知识应用到实际项目中，并将改进的建议反馈给开源项目的维护者

okk，先简单介绍一下这次的裤衩~

### 美团Logan

<span>
    
![](https://camo.githubusercontent.com/c9414bd5708e8b65ba4384fe4d1f6779a11df3fcec79d3a818cff8a99478f7cd/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f6c6963656e73652d4d49542d627269676874677265656e2e7376673f7374796c653d666c6174)
![](https://camo.githubusercontent.com/1f37732e708ac323de48b7f41e2f575174df9ccffc177454c0221daec3ac8c4e/68747470733a2f2f696d672e736869656c64732e696f2f6769746875622f72656c656173652f4d65697475616e2d4469616e70696e672f4c6f67616e2e7376673f6d61784167653d323539323030303f7374796c653d666c61742d737175617265)
![](https://camo.githubusercontent.com/b0ad703a46e8b249ef2a969ab95b2cb361a2866ecb8fe18495a2229f5847102d/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f5052732d77656c636f6d652d627269676874677265656e2e737667)
![](https://camo.githubusercontent.com/59dd5000f9d673013198051ef2a13747fa959a18159ee53960e63f9b868dc546/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f506c6174666f726d2d253230694f53253230253743253230416e64726f69642532302d627269676874677265656e2e737667)

</span>

>Logan 是美团点评集团推出的大前端日志系统。名称是 Log 和 An 的组合，代表个体日志服务，同时也是金刚狼大叔的大名。

#### Logan总览

>Logan 开源的是一整套日志体系，包括日志的收集存储，上报分析以及可视化展示。我们提供了五个组件，包括端上日志收集存储 、iOS SDK、Android SDK、Web SDK，后端日志存储分析 Server，日志分析平台 LoganSite。并且提供了一个 Flutter 插件Flutter 插件

#### 整体架构

![image](https://github.com/newObjectccc/newObjectccc.github.io/assets/42132586/164435fb-06a3-4a22-b54f-18d1fdaa50ce)

>👉Logan仓库地址： [Logan](https://github.com/Meituan-Dianping/Logan)

我们这次要偷的目标就是 WebSDK

![](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/d64e46c33623e5c6c66f0bf09ba9a1dcf750d7a2ad8ee7b539cd2d6399b3fd039c2e76916ddc12f2251ed0c39f525fbb?pictype=scale&from=30113&version=3.3.3.3&fname=dddffff.png&size=750)

各位可以自行 clone 或者在线阅读，推荐使用非官方的 1s 阅读，
>也就是在 <https://github.com/Meituan-Dianping/Logan> 的 github 域名后加 1s 即可，like this <https://github1s.com/Meituan-Dianping/Logan>

介绍完毕，开偷😎~

### WebSDK

首先我们先看看目录结构~
![](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/bcb58f68fc99baa428a0bf6610089b911ceac116673c24ef3bbdf1b62b207a358ecb69130348d237300fbdc9fc9ae069?pictype=scale&from=30113&version=3.3.3.3&fname=xxxx.png&size=750)

- **demo**里是一个demo示例
- **img**里是一些静态资源
- **src**里是WebSdk的核心代码

>`demo`

接下来我们先看看`demo`里面是如何使用Logan的~

![](https://picabstract-preview-ftn.weiyun.com/ftn_pic_abs_v3/6fea323026083526b2c376cd626a53f56fcd47901f847e247d790ca88347d2ebee72d1bc60ed1e0723a0fb12df360764?pictype=scale&from=30113&version=3.3.3.3&fname=ssssdddd.png&size=750)

可以看到就是通过script标签注入的SDK~（js目录下就是打包后的产物）
并进行了初始化(Logan.initConfig)，定义了一些方法，都是使用Logan这个类来实现的。
okk，知道了是怎么使用的，我们再来往下看

>`src`

我们来看看核心代码，为了方便理解，我删掉了一些非核心的代码和注释

```typescript
// index.ts

import {
    LogEncryptMode,
    ReportConfig,
    GlobalConfig,
    LogConfig
} from './interface';
import Config from './global-config';
import { isValidDay } from './lib/utils';
import { ResultMsg, ReportResult } from './interface';
import LogManager from './log-manager';
import { Promise as ES6Promise } from 'es6-promise';
if (!window.Promise) {
    // @ts-ignore
    window.Promise = ES6Promise;
}
let logQueueBeforeLoad: LogConfig[] = [];

async function logAsync (logItem: LogConfig): Promise<void> {
    // No need to async import if tryTimes exceeds.
    if (LogManager.canSave()) {
        try {
            const saveLogModule = await import(
                /* webpackChunkName: "save_log" */ './save-log'
            );
            saveLogModule.default(logItem);
        } catch (e) {
            LogManager.errorTrigger();
            await (Config.get('errorHandler') as Function)(e);
        }
    } else {
        await (Config.get('errorHandler') as Function)(new Error(ResultMsg.EXCEED_TRY_TIMES));
    }
}

function logIfLoaded (logItem: LogConfig): void {
    if (
        !document.readyState ||
        (document.readyState && document.readyState === 'complete')
    ) {
        logAsync(logItem);
    } else {
        logQueueBeforeLoad.push(logItem);
    }
}

function standardLog (content: string, logType: number, encryptVersion: LogEncryptMode): never | void {
    try {
        logParamChecker(logType, LogEncryptMode.PLAIN);
    } catch (e) {
        (Config.get('errorHandler') as Function)(e);
    }
    logIfLoaded({
        logContent: logContentWrapper(content, logType),
        encryptVersion
    });
}

function onWindowLoad (): void {
    logQueueBeforeLoad.forEach(logItem => {
        logAsync(logItem);
    });
    logQueueBeforeLoad = [];
    window.removeEventListener('load', onWindowLoad);
}
window.addEventListener('load', onWindowLoad);

export function initConfig (globalConfig: GlobalConfig): void {
    Config.set(globalConfig);
}

export function log (content: string, logType: number): void {
    standardLog(content, logType, LogEncryptMode.PLAIN);
}

export function logWithEncryption (content: string, logType: number): void {
    standardLog(content, logType, LogEncryptMode.RSA);
}

export function customLog (logConfig: LogConfig): void {
    logIfLoaded({
        logContent: logConfig.logContent,
        encryptVersion: logConfig.encryptVersion
    });
}

export async function report (reportConfig: ReportConfig): Promise<ReportResult> {
    reportParamChecker(reportConfig);
    const reportLogModule = await import(
        /* webpackChunkName: "report_log" */ './report-log'
    );
    return await reportLogModule.default(reportConfig);
}

export default {
    initConfig,
    log,
    logWithEncryption,
    report,
    customLog,
    ResultMsg
};

```

我们可以看到对于log日志，大概有三类，由三个方法生成：

1. **log** 方法：一般日志
2. **logWithEncryption** 方法：加密日志
3. **customLog** 方法：自定义日志

其中1,2都是用standardLog方法来验证log日志规范的，也就是说有格式上的约束。

--------------------------

 😎除此之外，这个 index.ts 中我们还可以看到一些额外的知识：

- **知识点**：```/*webpackChunkName: "repot_log"*/```， 用于webpack分包的包名定义，可以在目录demo/js/下找到report_log.[chunkhash].js为验证。
- **知识点**: ```document.readyState```，这个属性描述了```document```的加载状态，状态变化会触发readystatechange事件，它有3个值，```loading```（加载中），```interactive```（可交互），```complete```（完成），不要和```load```事件混为一谈哈。[详情见MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState)
- **知识点**: ```const saveLogModule = await import('./report-log')```，动态引入，就是在需要的时候导入模块，但是使用需要注意一些细节，比如：1.他可能会让tree shaking失效，静态引入更容易tree shaking。2.它可以在主线程，共享工作线程或专业或专用工作线程中使用，不能在Service Worker和[worklet](https://developer.mozilla.org/en-US/docs/Web/API/Worklet)中使用。

--------------------------

接回咱们的主逻辑，其实主要就是生成log和上报log这两个方面，接上面的三类log，我们都知道关于日志上报这类的业务，必然涉及到了日志的生成和保存，上面我们已经看了log生成有3类，所以我们简单来看看Logan内部是怎么保存log的，在index.ts中我们能追溯到的代码就是```logIfLoaded```这个方法。

```typescript
// index.ts

function logIfLoaded (logItem: LogConfig): void {
    if (
        !document.readyState ||
        (document.readyState && document.readyState === 'complete')
    ) {
        logAsync(logItem);
    } else {
        logQueueBeforeLoad.push(logItem);
    }
}
```

- **知识点**：这里我聊一个看源码的一点小经验，对于很多源码中，都有```if eles```的逻辑块存在，一般如果只有```if```分支，而没有```else```分支的逻辑块，多半是用于判断一些环境类，或者验证入参是否合法之类的逻辑，一般不涉及主逻辑，所以这类咱们可以不看，相反，如果是```if else```的这种完整的逻辑块，就需要看了，这种完整的```是这个就这么做，不是这个就那么做```，的逻辑，就是会涉及主逻辑的，所以一定要看。

所以这里我们很清晰的可以看到如果是已经加载完成，就执行logAsync方法传入log数据去生成log，如果是未加载完成的状态，则把log数据存到一个数组里，等待后续去调用。

所以我们接着看logAsync方法 👉

```typescript
// index.ts

async function logAsync (logItem: LogConfig): Promise<void> {
    // No need to async import if tryTimes exceeds.
    if (LogManager.canSave()) {
        try {
            const saveLogModule = await import(
                /* webpackChunkName: "save_log" */ './save-log'
            );
            saveLogModule.default(logItem);
        } catch (e) {
            LogManager.errorTrigger();
            await (Config.get('errorHandler') as Function)(e);
        }
    } else {
        await (Config.get('errorHandler') as Function)(new Error(ResultMsg.EXCEED_TRY_TIMES));
    }
}
```

可以看到是由 saveLogModule 这个模块去执行的，```saveLogModule.default```就是这个模块的默认导出。
所以我们去到 save-log.ts

```typescript
import { LogEncryptMode, ResultMsg, LogConfig } from './interface';
import Config from './global-config';
import LoganDB from './lib/logan-db';
import LogManager from './log-manager';
import { invokeInQueue } from './logan-operation-queue';
import * as ENC_UTF8 from 'crypto-js/enc-utf8';
import * as ENC_BASE64 from 'crypto-js/enc-base64';
interface LogStringOb {
    l: string;
    iv?: string;
    k?: string;
    v?: number;
}

let LoganDBInstance: LoganDB;
function base64Encode (text: string): string {
    const textUtf8 = ENC_UTF8.parse(text);
    const textBase64 = textUtf8.toString(ENC_BASE64);
    return textBase64;
}

export default async function saveLog (logConfig: LogConfig): Promise<void> {
    try {
        if (!LogManager.canSave()) {
            throw new Error(ResultMsg.EXCEED_TRY_TIMES);
        }
        if (!LoganDB.idbIsSupported()) {
            throw new Error(ResultMsg.DB_NOT_SUPPORT);
        }
        if (!LoganDBInstance) {
            LoganDBInstance = new LoganDB(Config.get('dbName') as
                | string
                | undefined);
        }
        if (logConfig.encryptVersion === LogEncryptMode.PLAIN) {
            const logStringOb: LogStringOb = {
                l: base64Encode(logConfig.logContent)
            };
            await invokeInQueue(async () => {
                await LoganDBInstance.addLog(
                    JSON.stringify(logStringOb)
                );
            });
        } else if (logConfig.encryptVersion === LogEncryptMode.RSA) {
            const publicKey = Config.get('publicKey');
            const encryptionModule = await import(
                    /* webpackChunkName: "encryption" */ './lib/encryption'
            );
            const cipherOb = encryptionModule.encryptByRSA(
                logConfig.logContent,
                `${publicKey}`
            );
            const logStringOb: LogStringOb = {
                l: cipherOb.cipherText,
                iv: cipherOb.iv,
                k: cipherOb.secretKey,
                v: LogEncryptMode.RSA
            };
            await invokeInQueue(async () => {
                await LoganDBInstance.addLog(
                    JSON.stringify(logStringOb)
                );
            });
        } else {
            throw new Error(`encryptVersion ${logConfig.encryptVersion} is not supported.`);
        }
        await (Config.get('succHandler') as Function)(logConfig);
    } catch (e) {
        LogManager.errorTrigger();
        await (Config.get('errorHandler') as Function)(e);
    }
}

```

我这里放出了整个```save-log.ts```的代码，我们可以根据之前聊的```if else```的经验来阅读一下这部分源码，追寻一下作者的逻辑思路。

为了让各位更好的阅读源码，下面我只指出一些关键代码逻辑：

- ```LoganDBInstance.addLog```
- ```LoganDBInstance = new LoganDB(Config.get('dbName'))```

从这俩关键逻辑不难追溯到```logan-db.ts```这个文件。
这个文件用```class```声明了一个```LoganDB```的类这里我就只放出关键逻辑了```addLog```

```typescript
// logan-db.ts

async addLog (logString: string): Promise<void> {
        const logSize = sizeOf(logString);
        const now = new Date();
        const today: string = dateFormat2Day(now);
        const todayInfo: LoganLogDayItem = (await this.getLogDayInfo(
            today
        )) || {
            [LOG_DAY_TABLE_PRIMARY_KEY]: today,
            totalSize: 0,
            reportPagesInfo: {
                pageSizes: [0]
            }
        };
        if (todayInfo.totalSize + logSize > DEFAULT_SINGLE_DAY_MAX_SIZE) {
            throw new Error(ResultMsg.EXCEED_LOG_SIZE_LIMIT);
        }
        if (!todayInfo.reportPagesInfo || !todayInfo.reportPagesInfo.pageSizes) {
            todayInfo.reportPagesInfo = { pageSizes: [0] };
        }
        const currentPageSizesArr = todayInfo.reportPagesInfo.pageSizes;
        const currentPageIndex = currentPageSizesArr.length - 1;
        const currentPageSize = currentPageSizesArr[currentPageIndex];
        const needNewPage =
            currentPageSize > 0 &&
            currentPageSize + logSize > DEFAULT_SINGLE_PAGE_MAX_SIZE;
        const nextPageSizesArr = (function (): number[] {
            const arrCopy = currentPageSizesArr.slice();
            if (needNewPage) {
                arrCopy.push(logSize);
            } else {
                arrCopy[currentPageIndex] += logSize;
            }
            return arrCopy;
        })();
        const logItem: LoganLogItem = {
            [LOG_DETAIL_REPORTNAME_INDEX]: this.logReportNameFormatter(
                today,
                needNewPage ? currentPageIndex + 1 : currentPageIndex
            ),
            [LOG_DETAIL_CREATETIME_INDEX]: +now,
            logSize,
            logString
        };
        const updatedTodayInfo: LoganLogDayItem = {
            [LOG_DAY_TABLE_PRIMARY_KEY]: today,
            totalSize: todayInfo.totalSize + logSize,
            reportPagesInfo: {
                pageSizes: nextPageSizesArr
            }
        };
        // The expire time is the start of the day after 7 days.
        const durationBeforeExpired =
            DEFAULT_LOG_DURATION - (+new Date() - getStartOfDay(new Date()));
        await this.DB.addItems([
            {
                tableName: LOG_DAY_TABLE_NAME,
                item: updatedTodayInfo,
                itemDuration: durationBeforeExpired
            },
            {
                tableName: LOG_DETAIL_TABLE_NAME,
                item: logItem,
                itemDuration: durationBeforeExpired
            }
        ]);
    }
```

这里也有一些小知识点：

--------------------------

- **知识点**：```IIFE```，自执行函数块```(function(){})();```，当你需要有一个自执行的函数的时候就可以这样去写，```IIFE```也是```webpack```等打包工具在打包产出物中常用的一个模式。

```typescript
// 这是IIFE在Logan代码中的使用

const nextPageSizesArr = (function (): number[] {
    const arrCopy = currentPageSizesArr.slice();
    if (needNewPage) {
        arrCopy.push(logSize);
    } else {
        arrCopy[currentPageIndex] += logSize;
    }
    return arrCopy;
})();
```

- **知识点**：```+new Date()```，这里有个类型转换的快速写法，```+```常用于将```String```类型转换为```Number```类型，同理，将```Number```类型也可以快速转换成```String```类型，通过```+ ''```即可。比如：```1 + ''```

--------------------------

接回主逻辑，我们可以看到对log日志进行了，过期时间，分页，log数据大小等管理，存log是引用了另一个包```import { CustomDB, idbIsSupported, deleteDB } from 'idb-managed';```中的```CustomDB```就是具体存的了，这里我们就不继续去深究了，看```this.DB.addItems```的调用方式，可以大胆去猜测一下，应该是糅合了有```localStorage```的组合方案，当然了，前端本地存储的方案，绝对不止这一个，比如：```indexedDB```，还有据说即将弃用的```WebSQL```，```Service Worker```等等。

okk，了解了log生成的存储的实现，我们再来看看log上报的实现吧~😎

--------------------------

我们回到```index.ts```中，找到```report```方法，很容易追溯到```report-log.ts```模块：

```typescript
// report-log.ts

import { ReportConfig, ResultMsg, ReportResult, ReportXHROpts } from './interface';
import LoganDB from './lib/logan-db';
import {
    LoganLogDayItem,
    FormattedLogReportName,
    LOG_DAY_TABLE_PRIMARY_KEY
} from './lib/logan-db';
import Config from './global-config';
import Ajax from './lib/ajax';
import { dayFormat2Date, ONE_DAY_TIME_SPAN, dateFormat2Day } from './lib/utils';
import { invokeInQueue } from './logan-operation-queue';
let LoganDBInstance: LoganDB;

/**
 * @returns Promise<number> with reported pageIndex if this page has logs, otherwise Promise<null>.
 */
async function getLogAndSend (reportName: string, reportConfig: ReportConfig): Promise<number | null> {
    const logItems = await LoganDBInstance.getLogsByReportName(reportName);
    if (logItems.length > 0) {
        const pageIndex = LoganDBInstance.logReportNameParser(reportName).pageIndex;
        const logItemStrings = logItems
            .map(logItem => {
                return encodeURIComponent(logItem.logString);
            });
        const logReportOb = LoganDBInstance.logReportNameParser(reportName);
        const customXHROpts: ReportXHROpts = typeof reportConfig.xhrOptsFormatter === 'function' ? reportConfig.xhrOptsFormatter(logItemStrings, logReportOb.pageIndex + 1, logReportOb.logDay) : {};
        return await Ajax(
            customXHROpts.reportUrl || reportConfig.reportUrl || (Config.get('reportUrl') as string),
            customXHROpts.data || JSON.stringify({
                client: 'Web',
                webSource: `${reportConfig.webSource || ''}`,
                deviceId: reportConfig.deviceId,
                environment: `${reportConfig.environment || ''}`,
                customInfo: `${reportConfig.customInfo || ''}`,
                logPageNo: logReportOb.pageIndex + 1, // pageNo start from 1,
                fileDate: logReportOb.logDay,
                logArray: logItems
                    .map(logItem => {
                        return encodeURIComponent(logItem.logString);
                    })
                    .toString()
            }),
            customXHROpts.withCredentials ?? false,
            'POST',
            customXHROpts.headers || {
                'Content-Type': 'application/json',
                'Accept': 'application/json,text/javascript'
            }
        ).then((responseText: any) => {
            if (typeof customXHROpts.responseDealer === 'function') {
                const result = customXHROpts.responseDealer(responseText);
                if (result.resultMsg === ResultMsg.REPORT_LOG_SUCC) {
                    return pageIndex;
                } else {
                    throw new Error(result.desc);
                }
            } else {
                let response;
                try {
                    response = JSON.parse(responseText);
                } catch (e) {
                    throw new Error(`Try to parse response failed, responseText: ${responseText}`);
                }
                if (response?.code === 200) {
                    return pageIndex;
                } else {
                    throw new Error(`Server error, code: ${response?.code}`);
                }
            }
        });
    } else {
        // Resolve directly if no logs in current page.
        return Promise.resolve(null);
    }
}

export default async function reportLog (
    reportConfig: ReportConfig
): Promise<ReportResult> {
    if (!LoganDB.idbIsSupported()) {
        throw new Error(ResultMsg.DB_NOT_SUPPORT);
    } else {
        if (!LoganDBInstance) {
            LoganDBInstance = new LoganDB(Config.get('dbName') as
                | string
                | undefined);
        }
        return await invokeInQueue(async () => {
            const logDaysInfoList: LoganLogDayItem[] = await LoganDBInstance.getLogDaysInfo(
                reportConfig.fromDayString,
                reportConfig.toDayString
            );
            const logReportMap: {
                [key: string]: FormattedLogReportName[];
            } = logDaysInfoList.reduce((acc, logDayInfo: LoganLogDayItem) => {
                return {
                    [logDayInfo[
                        LOG_DAY_TABLE_PRIMARY_KEY
                    ]]: logDayInfo.reportPagesInfo ? logDayInfo.reportPagesInfo.pageSizes.map((i, pageIndex) => {
                        return LoganDBInstance.logReportNameFormatter(
                            logDayInfo[LOG_DAY_TABLE_PRIMARY_KEY],
                            pageIndex
                        );
                    }) : [],
                    ...acc
                };
            }, {});
            const reportResult: ReportResult = {};
            const startDate = dayFormat2Date(reportConfig.fromDayString);
            const endDate = dayFormat2Date(reportConfig.toDayString);
            for (
                let logTime = +startDate;
                logTime <= +endDate;
                logTime += ONE_DAY_TIME_SPAN
            ) {
                const logDay = dateFormat2Day(new Date(logTime));
                if (logReportMap[logDay] && logReportMap[logDay].length > 0) {
                    try {
                        const batchReportResults = await Promise.all(
                            logReportMap[logDay].map(reportName => {
                                return getLogAndSend(reportName, reportConfig);
                            })
                        );
                        reportResult[logDay] = { msg: ResultMsg.REPORT_LOG_SUCC };
                        try {
                            const reportedPageIndexes = batchReportResults.filter(reportedPageIndex => reportedPageIndex !== null) as number[];
                            if (reportedPageIndexes.length > 0 && reportConfig.incrementalReport) {
                                // Delete logs of reported pages after report.
                                await LoganDBInstance.incrementalDelete(logDay, reportedPageIndexes);
                            }
                        } catch (e) {
                            // Noop if deletion failed.
                        }
                    } catch (e) {
                        reportResult[logDay] = {
                            msg: ResultMsg.REPORT_LOG_FAIL,
                            desc: e.message || e.stack || JSON.stringify(e)
                        };
                    }
                } else {
                    reportResult[logDay] = { msg: ResultMsg.NO_LOG };
                }
            }
            return reportResult;
        });
    }
}
```

可以看到在```getLogAndSend```方法中，主要就是拿到Logs，转换之后，通过```Ajax```方法发送日志的，最终在utils内部有```Ajax```的实现，其实也是用```XMLHttpRequest```对象发送的。

然后我们着重来看看这里：(我删掉了很多代码，为了让结构更清晰)

```typescript
// report-log.ts

return await invokeInQueue(async () => {
  const logDaysInfoList: LoganLogDayItem[] = await LoganDBInstance.getLogDaysInfo(
      reportConfig.fromDayString,
      reportConfig.toDayString
  );
  // 用 Map 统一维护Logs的上报
  const logReportMap: {
      [key: string]: FormattedLogReportName[];
  } = logDaysInfoList.reduce((acc, logDayInfo: LoganLogDayItem) => {
      
  }, {});
  const reportResult: ReportResult = {};
  const startDate = dayFormat2Date(reportConfig.fromDayString);
  const endDate = dayFormat2Date(reportConfig.toDayString);
  // 通过Date实现切分Logs
  for (
      let logTime = +startDate;
      logTime <= +endDate;
      logTime += ONE_DAY_TIME_SPAN
  ) {
      const logDay = dateFormat2Day(new Date(logTime));
      if (logReportMap[logDay] && logReportMap[logDay].length > 0) {
        // 并行的批量上传
        const batchReportResults = await Promise.all(
            logReportMap[logDay].map(reportName => {
                return getLogAndSend(reportName, reportConfig);
            })
        );
        reportResult[logDay] = { msg: ResultMsg.REPORT_LOG_SUCC };
        // 上报成功后删除逻辑
        const reportedPageIndexes = batchReportResults.filter(reportedPageIndex => reportedPageIndex !== null) as number[];
        if (reportedPageIndexes.length > 0 && reportConfig.incrementalReport) {
            // Delete logs of reported pages after report.
            await LoganDBInstance.incrementalDelete(logDay, reportedPageIndexes);
        }
      } else {
        reportResult[logDay] = { msg: ResultMsg.NO_LOG };
      }
  }
  return reportResult;
});
```

```invokeInQueue```这里面的```asyncFn: Function```就是核心上报逻辑，可以看到几个关键的逻辑，可以用作上报SDK的借鉴和学习

- **关键一**：根据log生成的Date来决定上报顺序
- **关键二**：通过一个上报管理器```logReportMap```来管理上报
- **关键三**：并行的批量上传```Promise.all([iterable])```

当然了，这些都是连贯的逻辑哈，不是单独拧出去的。

接着我们来看看一个难点```invokeInQueue```函数的实现，我们追溯到```import { invokeInQueue } from './logan-operation-queue';logan-operation-queue.ts```：

```typescript
// logan-operation-queue.ts

const loganOperationQueue: PromiseItem[] = [];
let operationRunning: boolean = false;
interface PromiseItem {
    asyncF: Function;
    resolution: Function;
    rejection: Function;
}
async function loganOperationsRecursion (): Promise<void> {
  while (loganOperationQueue.length > 0 && !operationRunning) {
    const nextOperation = loganOperationQueue.shift() as PromiseItem;
    operationRunning = true;
    try {
        const result = await nextOperation.asyncF();
        nextOperation.resolution(result);
    } catch (e) {
        nextOperation.rejection(e);
    }
    operationRunning = false; /* eslint-disable-line */ // No need to worry require-atomic-updates here.
    loganOperationsRecursion();
  }
}
export function invokeInQueue (asyncF: Function): Promise<any> {
  return new Promise((resolve, reject) => {
      loganOperationQueue.push({
          asyncF,
          resolution: resolve,
          rejection: reject
      });
      loganOperationsRecursion();
  });
}
/** 请忽略下面这段代码 */
```

我们先看```loganOperationsRecursion```函数的执行逻辑：

- 根据```loganOperationQueue```数组是否为空和```operationRunning```是否为false来循环。
- 进入循环内，取出```loganOperationQueue```的第一个元素，注意```shift()```会减小数组长度，从而使得循环的第一个条件有跳出的可能。
- 使```operationRunning```这个状态为```true```表示正在执行
- 调用取出数组元素的```asyncF```方法，并按返回结果改变元素对应的状态。
- 使```operationRunning```这个状态为```false```表示执行完成
- 递归调用自身。

我们再来看```invokeInQueue```函数的执行逻辑：

- 创建```Promise```对象，并```return```
- 为```loganOperationQueue```队列添加元素，并把当前```Promise```对象的```resovle```和```reject```还有```invokeInQueue```本身接收的异步方法都绑在了添加的元素上。
- 执行```loganOperationsRecursion```

而当我在```report-log.ts```中调用```invokeInQueue```时，我们就可以看出在```loganOperationsRecursion```中，```await```的其实是```report-log.ts```中```reportLog```方法的执行。

okk，由此便完成了上报流程。

--------------------------

 👉Logan不仅仅是只有```WebSDK```他还支持其他端，有兴趣的小伙伴可以自行github，这里仅仅笔者浅薄的知识阅读```WebSDK```模块，期望达到抛砖引玉的效果。

--------------------------

🖥️写在最后：

*以上就是咱们这期【偷裤衩】的全部内容了，阅读源码就像是读书，沿着各个源码作者的编码思路进行探索的过程，这有助于帮助自己偷师百家，成为仙道巅峰之人。*
