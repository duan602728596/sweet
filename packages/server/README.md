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
  useBabelRegister,
  redirectToHttps,
  socket
});
```

### 热替换

你可以使用函数来包装入口文件。

```javascript
import hotClientEntry from '@sweet-milktea/server/hotClientEntry';

export default {
  entry: hotClientEntry({
    index: [path.join(__dirname, 'src/index.js')]
  })
};
```

或者自行包装入口。

```javascript
export default {
  entry: {
    index: [
      path.join(__dirname, 'src/index.js'),
      '@sweet-milktea/server/client/default?hot=true',
      'webpack/hot/dev-server'
    ]
  }
};
```

### 配置

* compiler `{ object }` : webpack的compiler。
* httpPort `{ number }` : http端口号，默认为5050。
* httpsPort `{ number }` : https端口号，默认为5051。
* serverRender `{ boolean }` : 开启服务器端渲染。
* serverRenderRoot { string }: 服务器端渲染的文件夹。默认为`dist-server`。
* serverRenderFile `{ string }` : 服务器端渲染的主模块文件。默认为`server.mjs`。
* renderType `{ string }` : html使用的渲染模板，`ejs`或`nunjucks`。默认为`ejs`。**如果使用`nunjucks`，请自行下载依赖**。
* serverChain `{ (app: Koa) => Promise<void> }` : 扩展koa中间件配置。
* httpsKey `{ string }` : 配置https的证书（*.key）。
* httpsCert `{ string }` : 配置https的证书（*.crt）。
* useBabelRegister `{ boolean }` : 是否使用`@babel/register`来加载api文件和controllers文件。默认开启。
* controllersDir `{ string }` : 重新定义的controllers的目录。
* apiFile `{ string }` : 重新定义的api文件。
* proxyFile `{ string }` : 重新定义的proxy文件。
* redirectToHttps `{ boolean }` : 开启https的情况下，重定向http到https。
* socket `{ 'sockjs' | 'ws' }` : socket类型。默认为`sockjs`，也可以配置为`ws`。

## 生产环境下运行服务

### 使用方法

```javascript
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
  useBabelRegister,
  redirectToHttps
});
```

### 配置

* httpPort `{ number }` : http端口号，默认为80。
* httpsPort `{ number }` : https端口号，默认为443。
* serverRoot `{ string }` : 生产环境下的服务器静态文件入口。默认为`dist`。
* serverRender `{ boolean }` : 开启服务器端渲染。
* serverRenderRoot { string }: 服务器端渲染的文件夹。默认为`dist-server`。
* serverRenderFile `{ string }` : 服务器端渲染的主模块文件。默认为`server.mjs`。
* renderType `{ string }` : html使用的渲染模板，`ejs`或`nunjucks`。默认为`ejs`。**如果使用`nunjucks`，请自行下载依赖**。
* log `{ object }` : 日志配置。
    * type `{ 'file' | 'http' }` : 日志类型，本地*file* 或 远程接口*http*。
    * pm2 `{ boolean }` : 服务是否在pm2状态下运行。
    * url `{ string }` : 日志的远程接口。
* serverChain `{ (app: Koa) => Promise<void> }` : 扩展koa中间件配置。
* httpsKey `{ string }` : 配置https的证书（*.key）。
* httpsCert `{ string }` : 配置https的证书（*.crt）。
* useBabelRegister `{ boolean }` : 是否使用`@babel/register`来加载api文件和controllers文件。默认开启。
* controllersDir `{ string }` : 重新定义的controllers的目录。
* apiFile `{ string }` : 重新定义的api文件。
* proxyFile `{ string }` : 重新定义的proxy文件。
* redirectToHttps `{ boolean }` : 开启https的情况下，重定向http到https。

## sweetOptions

你可以在任何中间件内通过`ctx.state.sweetOptions`或`ctx.sweetOptions`（预废弃）拿到当前服务的配置。

## 服务器端渲染

服务器端渲染需要你创建`controllers`文件夹，里面创建各个路由的js或ts文件。   

在文件内，需要创建如下代码:

```javascript
export default {
  url: '/Path/To',
  async handler(ctx, sweetOptions) {
    return {
      initialState, // 返回初始化的state
      ...           // 你要返回的其他数据
    };
  }
};
```

url为需要匹配的路由，参考*path-to-regexp*。`/(.*)`或`(.*)`匹配所有路由。handler为当前路由匹配时执行的方法。   

在pug或html模板中，使用`<%- key %>`来标记占位的数据。其中`<%- render %>`表示服务器端渲染的数据，
`<%- initialState %>`表示初始化数据，其他的占位数据同理。参考*ejs*。   

入口文件为：

```javascript
function server(url, context = {}, initialState = {}) {
  return ''; // 返回字符串、stream对象或Promise
}

export default server;
```

在入口文件内，你可以通过`context.routePath`拿到当前真实的path。

## api

创建一个`api/api.ts`或`api/api.js`文件，代码如下

```javascript
module.exports = function(router, sweetOptions, app) {
  // 在这里面创建你的函数
  router.get('/path', /* ...your_functions */);
};
```

## 代理

创建一个`proxy/proxy.ts`、`proxy/proxy.js`或`proxy/proxy.json`文件，
代码配置参考[http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware)

```javascript
module.exports = function(sweetOptions, app) {
  return {
    '/proxy': {
      target: 'http://127.0.0.1',
      changeOrigin: true,
      pathRewrite: {
        '^/proxy': ''
      }
    }
  };
};
```

## mock

创建一个`mock/mock.ts`或`mock/mock.js`文件，代码如下

```javascript
module.exports = {
  // 使用方法
  'GET /mock/data': { data: [1, 2] },
  
  // 省略请求方法时，默认的请求方法为GET
  '/mock/data': { data: [1, 2] },
  
  // 支持自定义函数，API 参考 koa 和 @koa/router
  'POST /mock/data': (ctx, next) => ctx.body = 'ok'
};

// 或者返回一个函数

module.exports = function() {
  return {
    'GET /mock/data': { data: [1, 2] }
  };
};
```

## 关于https证书

证书放在目录下会自动生效。
开发环境下的证书安装，参考[https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)。

* 开发环境下的证书，命名为`dev.*`，放在当前目录。
* 生产环境下的证书，命名为`server.*`，放在当前目录。