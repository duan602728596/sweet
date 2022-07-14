# @sweet-milktea/milktea

## 使用

## 如何使用

1. 在工程目录下创建`.sweetrc.js`或`sweet.config.mjs`文件，然后通过cli工具运行。（支持typescript，即`.sweetrc.ts`或`sweet.config.ts`文件）

2. 在node内运行函数。

```javascript
import webpack from 'webpack';
import {
  dll as dllConfig,        // dll编译配置
  config as webpackConfig, // webpack配置
  serverRenderConfig,      // webpack服务器端渲染配置
  callback,                // webpack的回调函数
  callbackOnlyError        // webpack的回调函数（只显示错误信息）
} from '@sweet-milktea/milktea';

// sweetConfig { SweetConfig | string | null | undefined }: webpack配置，覆盖文件，优先级最高
// mode { string }: 开发模式 development，生产模式 production
// webpackLog { 'progress' | 'stats' }: 日志输出类型。progress：进度条，stats：传统的输出方式。默认为progress
// hot { boolean }: 添加webpack.HotModuleReplacementPlugin插件，开启热更新功能
// socket { 'sockjs' | 'ws' }: socket类型。默认为`sockjs`，也可以配置为`ws`。
const compiler = webpack(
  await webpackConfig({
    // 配置项
    sweetConfig: null,
    mode: 'development',
    webpackLog: 'progress',
    hot: true,
    socket: 'sockjs'
  })
);

compiler.run(callback);
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
* dll `{ Array<string> }` : 配置需要编译的dll模块
* context `{ string }` : 基础目录，绝对路径
* entry `{ any }` : 文件入口（参考webpack）
* output `{ any }` : 文件出口（参考webpack）
* alias `{ object }` : 模块别名（参考webpack）
* externals `{ object }` : 外部扩展（参考webpack）
* resolve `{ object }` : 解析（参考webpack）
* devtool `{ string }`: 设置SourceMap的类型
* rules `{ Array<object> }` : 自定义规则
* noParse `RegExp | Array<RegExp> | Function` : 防止解析任何与给定正则表达式相匹配的文件（参考webpack）
* plugins `{ Array<any> }` : 自定义webpack插件
* javascript `{ object }` : javascript配置
    * targets `{ object }` : 配置@babel/preset-env的编译目标
    * ecmascript `{ boolean }` : 是否编译到ecmascript的最新语法（即不使用@babel/preset-env，通常适用于node、nwjs和electron）
    * polyfill `{ boolean }` : 使用babel-plugin-polyfill-{name}相关插件
    * typescript `{ boolean }` : 是否使用typescript编译（即使用@babel/preset-typescript）
    * presets `{ Array<any> }` : 自定义presets
    * plugins `{ Array<any> }` : 自定义plugins
    * exclude `{ RegExp }` : exclude规则
    * include `{ RegExp }` : include规则
* typescript `{ object }` : typescript配置
    * configFile `{ string }` : typescript的配置文件
    * presets `{ Array<any> }` : 自定义babel的presets
    * plugins `{ Array<any> }` : 自定义babel的plugins
    * exclude `{ RegExp }` : exclude规则
    * include `{ RegExp }` : include规则
    * forkTsCheckerWebpackPlugin `{ boolean }` : 设置为false时，关闭fork-ts-checker-webpack-plugin插件注入
* sass `{ object }` : sass配置
    * modules `{ boolean }` : 开启css-in-modules
    * exclude `{ RegExp }` : exclude规则
    * include `{ RegExp }` : include规则
    * additionalData `{ string | Function }` : 注入sass变量（参考sass-loader）
* less `{ object }` : less配置
    * modules `{ boolean }` : 开启css-in-modules
    * exclude `{ RegExp }` : exclude规则
    * include `{ RegExp }` : include规则
    * modifyVars `{ object }` : 注入less变量（参考less-loader）
    * additionalData `{ string | Function }` : （参考less-loader）
* html `{ Array<object> }` : html配置（默认使用pug）
    * template `{ string }` : html模板文件地址
    * 其他`html-webpack-plugin`的配置
* frame `{ string }` : 值为`react`或`vue`，是否为react或vue模式，并自动注入loaders和plugins
* chainWebpack `{ Function }` : 通过`webpack-chain`的API扩展或修改webpack配置
* filesMap `{ boolean | object }` : 输出`filesMap.json`文件，记录了文件的映射
* hot `{ boolean }` : 添加**webpack.HotModuleReplacementPlugin**插件，开启热更新功能

下面的配置是关于服务器端渲染的

* serverRender `{ boolean }` : 是否开启服务器端渲染
* severEntry `{ any }` : 服务器端的文件入口（参考webpack）
* serverOutput `{ any }` : 服务器端文件出口（参考webpack）
* serverExternals `{ object }` : 服务器端的外部扩展（参考webpack）
* serverDevtool `{ string }` : 服务器端的SourceMap的类型（参考webpack）
* serverChainWebpack`{ Function }` : 通过`webpack-chain`的API扩展或修改SSR的webpack配置

### 关于vue

如果使用vue，需要手动安装`@vue/babel-plugin-jsx`(vue3)、`vue-loader`、`vue-svg-loader@0.17.0-beta.1`、`@vue/compiler-sfc`(vue3)。

### 关于typescript

使用typescript，需要手动安装`typescript`和`ts-loader`。   
如果`js.typescript`为`true`，则不会配置ts-loader，且ts配置无效。因为这时typescript编译使用的是babel。

### info

info是当前环境的信息。

* info.environment：当前环境，可能的值为`dll`、`client`、`server`。分别为编译dll文件、编译浏览器端代码、编译node端代码。

## javascript

以`.ignore.js`结尾的文件不会被babel编译。   
这是由于`new Worker(new URL('./worker.js', import.meta.url))`语法会被babel编译，导致webpack无法解析文件入口，所以添加了忽略的文件类型。

## 引入svg

在react或vue项目中，如果svg文件匹配`*.component.svg`，则文件作为组件引入，否则作为图片地址引入。

```javascript
import svgUrl from './image.svg';
import SvgComponent from './image.component.svg';
// svgUrl：svg的图片地址
// SvgComponent：svg作为vue组件
export default function(props) {
  return [
    <img key="0" src={ svgUrl } />,
    <SvgComponent key="1" />
  ];
}
```

## [api、服务器端渲染](https://github.com/duan602728596/sweet/blob/master/packages/server/README.md)

## 环境变量

内置了环境变量，根据环境变量判断不同的编译环境。

* `process.env.SWEET_SERVER_RENDER`：判断当前环境是否为服务器端渲染。

## 使用typescript

在项目内添加`tsconfig.json`文件。