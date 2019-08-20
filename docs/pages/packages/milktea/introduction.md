# @sweet-milktea/milktea

milktea用来创建一个webpack的配置。

## 如何使用

1. 在工程目录下创建`.sweetrc.js`或`sweet.config.js`文件，然后通过cli工具运行。

```javascript
module.exports = {
  ... // 配置
};
```

2. 在node内运行函数。

```javascript
import webpack from 'webpack';
import {
  dll as dllConfig,        // dll编译配置
  config as webpackConfig, // webpack配置
  serverRenderConfig,      // webpack服务器端渲染配置
  callback                 // webpack的回调函数
} from '@sweet-milktea/milktea';

// mode { string }: 开发模式 development，生产模式 production
const mode = 'development';

const compiler = webpack(webpackConfig({
  // 配置项
}, mode));

compiler.run(callback);
```

## 环境变量

内置了环境变量，根据环境变量判断不同的编译环境。

* `process.env.SWEET_SERVER_RENDER`：判断当前环境是否为服务器端渲染。

## 使用typescript

在项目内添加`tsconfig.json`文件。