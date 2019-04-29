# @sweet/server

## 开发环境下运行服务

### 使用方法

```javascript
import webpack from 'webpack';
import devServer from '@sweet/server/lib/sevServer';

devServer({
  compiler,
  httpPort,
  httpsPort,
  serverRender,
  serverRenderFile,
  renderType
});
```

### 配置

* compiler `{ object }` : webpack的compiler。
* httpPort `{ number }` : http端口号，默认为5050。
* httpsPort `{ number }` : https端口号，默认为5051。
* serverRender `{ boolean }` : 开启服务器端渲染
* serverRenderFile `{ string }` : 服务器端渲染的主模块文件。默认为`buildServer/server.js`。
* renderType `{ string }` : html使用的渲染模板，`ejs`或`nunjucks`。默认为`ejs`。

## 生产环境下运行服务

### 使用方法

```javascript
import webpack from 'webpack';
import proServer from '@sweet/server/lib/proServer';

proServer({
  httpPort,
  httpsPort,
  serverRoot,
  serverRender,
  serverRenderFile,
  renderType
});
```

### 配置

* httpPort `{ number }` : http端口号，默认为5052。
* httpsPort `{ number }` : https端口号，默认为5053。
* serverRoot `{ string }` : 生产环境下的服务器静态文件入口。默认为`build`。
* serverRender `{ boolean }` : 开启服务器端渲染
* serverRenderFile `{ string }` : 服务器端渲染的主模块文件。默认为`buildServer/server.js`。
* renderType `{ string }` : html使用的渲染模板。默认为`ejs`。

## 关于https证书

证书放在目录下会自动生效。
开发环境下的证书安装，参考[https://github.com/FiloSottile/mkcert](https://github.com/FiloSottile/mkcert)。

* 开发环境下的证书，命名为`dev.*`，放在当前目录。
* 生产环境下的证书，命名为`server.*`，放在当前目录。