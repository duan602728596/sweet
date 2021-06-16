# @sweet-milktea/milktea-vite

## 使用

## 如何使用

1. 在工程目录下创建`.sweetrc.js`或`sweet.config.mjs`文件，然后通过cli工具运行。（支持typescript，即`.sweetrc.ts`或`sweet.config.ts`文件）

2. 在node内运行函数。

```javascript
import {
  config as viteConfig, // vite开发环境配置
  build as viteBuild,   // vite生产环境配置
  serverRenderBuild     // vite SSR生产环境配置
} from '@sweet-milktea/milktea-vite';

// sweetConfig { SweetConfig | string | null | undefined }: 覆盖文件，优先级最高
// mode { string }: 开发模式 development，生产模式 production
const vite = await viteConfig({
  // 配置项
  sweetConfig: null,
  mode: 'development'
});
```

## 配置文件`.sweetrc.js`说明

### 使用方法

根目录下创建`.sweetrc.js`文件。代码如下所示：

```javascript
module.exports = {
  ... // 配置
};
```

或

```javascript
module.exports = function(info) {
  return {
    ... // 配置
  };
};
```

### 配置项

* mode `{ string }` : 开发模式还是生产模式
* frame `{ string }` : 值为`react`或`vue`，是否为react或vue模式，并自动修改默认配置，添加plugin
* vite `{ object }` : vite配置，会合并到默认配置中
* chainVite `{ Function }` : 通过扩展或修改vite配置
* typescript(ts) `{ object }` : typescript配置
  * configFile `{ string }` : typescript的配置文件
  * tsChecker `{ boolean }` : 设置为false时，关闭vite-plugin-checker插件注入

下面的配置是关于服务器端渲染的

* severEntry `{ any }` : 服务器端的文件入口（参考vite的SSR）

### 关于vue

如果使用vue，需要手动安装`@vitejs/plugin-vue`、`@vitejs/plugin-vue-jsx`、`@vue/compiler-sfc`(vue3)。

### 关于typescript

使用typescript，需要手动安装`typescript`。   

### info

info是当前环境的信息。

* info.environment：当前环境，可能的值为`client`、`server`。分别为编译dll文件、编译浏览器端代码、编译node端代码。

## [api、服务器端渲染](https://github.com/duan602728596/sweet/blob/master/packages/server/README.md)

## 使用typescript

在项目内添加`tsconfig.json`文件。