# @sweet-milktea/server

## 开发环境下运行服务

### 使用方法

```javascript
import webpack from 'webpack';
import devServer from '@sweet-milktea/server/devServer';

devServer({
  compiler,
  httpPort,
  httpsPort,
  serverRender,
  serverRenderFile,
  renderType,
  serverChain
});
```

### 配置

* compiler `{ object }` : webpack的compiler。
* httpPort `{ number }` : http端口号，默认为5050。
* httpsPort `{ number }` : https端口号，默认为5051。
* serverRender `{ boolean }` : 开启服务器端渲染
* serverRenderFile `{ string }` : 服务器端渲染的主模块文件。默认为`dist-server/server.js`。
* renderType `{ string }` : html使用的渲染模板，`ejs`或`nunjucks`。默认为`ejs`。
* serverChain `{ (app: Koa) => void }` : 扩展koa中间件配置。

## 生产环境下运行服务

### 使用方法

```javascript
import webpack from 'webpack';
import proServer from '@sweet-milktea/server/proServer';

proServer({
  httpPort,
  httpsPort,
  serverRoot,
  serverRender,
  serverRenderFile,
  renderType,
  log,
  serverChain
});
```

### 配置

* httpPort `{ number }` : http端口号，默认为80。
* httpsPort `{ number }` : https端口号，默认为443。
* serverRoot `{ string }` : 生产环境下的服务器静态文件入口。默认为`dist`。
* serverRender `{ boolean }` : 开启服务器端渲染
* serverRenderFile `{ string }` : 服务器端渲染的主模块文件。默认为`dist-server/server.js`。
* renderType `{ string }` : html使用的渲染模板。默认为`ejs`。
* log `{ object }` : 日志配置。
  * type `{ 'file' | 'http' }` : 日志类型，本地*file* 或 远程接口*http*。
  * pm2 `{ boolean }` : 服务是否在pm2状态下运行。
  * url `{ string }` : 日志的远程接口。
* serverChain `{ (app: Koa) => void }` : 扩展koa中间件配置。

## 关于https证书

证书放在目录下会自动生效。
开发环境下的证书安装，参考[https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)。

* 开发环境下的证书，命名为`dev.*`，放在当前目录。
* 生产环境下的证书，命名为`server.*`，放在当前目录。