# @sweet-milktea/server-log

生产环境下的日志扩展。

## 使用方法

```javascript
import serverLog from '@sweet-milktea/server-log';

const { accessLogger, logger } = serverLog(type, {
  pm2,
  basicPath,
  url
});
```

## 参数

* type `{ 'file' | 'http' }` : 日志类型，本地*file* 或 远程接口*http*。
* options `{ object }` : 配置项。
  * pm2 `{ boolean }` : 服务是否在pm2状态下运行。
  * basicPath `{ string }` : *.logs*文件夹在本地的目录。
  * url `{ string }` : 日志的远程接口。

## 返回值

* accessLogger `{ Function }` : Koa日志中间件。
* logger `{ object }` : 创建日志方法。方法参考[log4js](https://github.com/log4js-node/log4js-node)。