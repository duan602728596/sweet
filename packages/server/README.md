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
  serverChain,
  httpsKey,
  httpsCert,
  useBabelRegister
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
* httpsKey `{ string }` : 配置https的证书（*.key）。
* httpsCert `{ string }` : 配置https的证书（*.crt）。
* useBabelRegister `{ boolean }` : 是否使用`@babel/register`来加载api文件和controllers文件。默认开启。
* controllersDir `{ string }` : 重新定义的controllers的目录。
* apiFile `{ string }` : 重新定义的api文件。
* proxyFile `{ string }` : 重新定义的proxy文件。

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
  serverChain,
  httpsKey,
  httpsCert,
  useBabelRegister
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
* httpsKey `{ string }` : 配置https的证书（*.key）。
* httpsCert `{ string }` : 配置https的证书（*.crt）。
* useBabelRegister `{ boolean }` : 是否使用`@babel/register`来加载api文件和controllers文件。默认开启。
* controllersDir `{ string }` : 重新定义的controllers的目录。
* apiFile `{ string }` : 重新定义的api文件。
* proxyFile `{ string }` : 重新定义的proxy文件。

## sweetOptions

你可以在任何中间件内通过`ctx.sweetOptions`拿到当前服务的配置。

## api

创建一个`api/api.js`文件，代码如下

```javascript
module.exports = function(router, sweetOptions, app) {
  // 在这里面创建你的函数
  router.get('/path', /* ...your_functions */);
};
```

## 服务器端渲染

服务器端渲染需要你创建`controllers`文件夹，文件夹里面的规则为: 你的路由中的 **“/”** 替换为 **“.”**，或者为文件夹。比如`/Path/PathFile`，则需要创建`/Path.PathFile.js`文件或`/Path/PathFile.js`文件。   

在文件内，需要创建如下代码:

```javascript
module.exports = async function(ctx, sweetOptions) {
  return {
    initialState, // 返回初始化的state
    ...           // 你要返回的其他数据
  };
}
```

在pug或html模板中，使用`<%- key %>`来标记占位的数据。其中`<%- render %>`表示服务器端渲染的数据，`<%- initialState %>`表示初始化数据，其他的占位数据同理。参考*ejs*。   

如果路由找不到对应的interface文件，会自动寻找`default.js`文件。你可以创建这个文件作为默认的interface文件。

入口文件为：

```javascript
function server(url, context = {}, initialState = {}) {
  return ''; // 返回字符串、stream对象或Promise
}

export default server;
```

在入口文件内，你可以通过`context.routePath`拿到当前真实的path。

## 代理

创建一个`proxy/proxy.js`或`proxy/proxy.json`文件，代码配置参考[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

```javascript
module.exports = function(sweetOptions, app) {
  return {
    '/route': {
      target: 'http://127.0.0.1',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': ''
      }
    }
  };
};
```

## 关于https证书

证书放在目录下会自动生效。
开发环境下的证书安装，参考[https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)。

* 开发环境下的证书，命名为`dev.*`，放在当前目录。
* 生产环境下的证书，命名为`server.*`，放在当前目录。