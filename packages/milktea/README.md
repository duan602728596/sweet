# @sweet-milktea/milktea

## 使用

1. 方法1：在工程目录下创建`.sweetrc.js`或`sweet.config.js`文件，然后通过cli工具运行。

2. 方法2：直接在node内运行函数。

```javascript
import webpack from 'webpack';
import {
  dll as dllConfig,        // dll编译配置
  config as webpackConfig, // webpack配置
  serverRenderConfig,      // webpack服务器端渲染配置
  callback                 // webpack的回调函数
} from '@sweet-milktea/milktea';

// mode`{ string }` : 开发模式`development`还是生产模式`production`
const mode = 'development';

const compiler = webpack(webpackConfig({
  // 配置项
}, mode));

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

### 配置项

* mode `{ string }` : 开发模式还是生产模式
* dll `{ Array<string> }` : 配置需要编译的dll模块
* entry `{ any }` : 文件入口（参考webpack）
* output `{ any }` : 文件出口（参考webpack）
* externals `{ object }` : 外部扩展（参考webpack）
* resolve `{ object }` : 解析（参考webpack）
* devtool `{ string }`: 设置SourceMap的类型
* loaders: 重写loaders的默认规则
  * js `{ object }` : 重写默认的javascript规则
  * ts `{ object }` : 重写默认的typescript规则
  * sass `{ object }` : 重写默认的sass规则
  * css `{ object }` : 重写默认的css规则
  * favicon `{ object }` : 重写网站图标的规则
  * fontFile `{ object }` : 重写字体文件的规则
  * html `{ object }` : 重写html的规则，默认为pug
  * image `{ object }` : 重写图片文件的规则
  * svg `{ object }` : 重写svg的规则
  * vue `{ object }` : 重写vue的规则
* rules `{ Array<object> }` : 自定义规则
* noParse `RegExp | Array<RegExp> | Function` : 防止解析任何与给定正则表达式相匹配的文件（参考webpack）
* plugins `{ Array<any> }` : 自定义插件
* js `{ object }` : javascript配置
  * targets `{ object }` : 配置@babel/preset-env的编译目标
  * ecmascript `{ boolean }` : 是否编译到ecmascript的最新语法（即不使用@babel/preset-env，通常适用于node、nwjs和electron）
  * presets `{ Array<any> }` : 自定义presets
  * plugins `{ Array<any> }` : 自定义plugins
  * resetPresets `{ Array<any> }` : 重写presets
  * resetPlugins `{ Array<any> }` : 重写plugins
  * exclude `{ RegExp }` : exclude规则
  * include `{ RegExp }` : include规则
* ts `{ object }` : typescript配置
  * presets `{ Array<any> }` : 自定义babel的presets
  * plugins `{ Array<any> }` : 自定义babel的plugins
  * exclude `{ RegExp }` : exclude规则
  * include `{ RegExp }` : include规则
* sass `{ object }` : sass配置
  * publicPath `{ string }`
  * modules `{ boolean }` : 开启css-in-modules
  * exclude `{ RegExp }` : exclude规则
  * include `{ RegExp }` : include规则
  * data `{ string | Function }` : 注入sass变量（参考sass-loader）
  * localIdentName `{ string }` : 配置localIdentName（参考css-loader）
  * getLocalIdent `{ Function }` : 配置getLocalIdent（参考css-loader）
* css `{ object }` : css配置（默认使用less）
  * publicPath `{ string }`
  * modules `{ boolean }` : 开启css-in-modules
  * exclude `{ RegExp }` : exclude规则
  * include `{ RegExp }` : include规则
  * modifyVars `{ object }` : 注入less变量（参考less-loader）
  * localIdentName `{ string }` : 配置localIdentName（参考css-loader）
  * getLocalIdent `{ Function }` : 配置getLocalIdent（参考css-loader）
* html `{ Array<object> }` : html配置（默认使用pug）
  * template `{ string }` : html模板文件地址
  * excludeChunks `{ Array<string> }` : 不包括的入口
* frame `{ string }` : 值为`react`或`vue`，是否为react或vue模式，并自动注入loaders和plugins
* chainWebpack `{ Function }` : 通过`webpack-chain`的API扩展或修改webpack配置
* filesMap `{ boolean | object }` : 输出`filesMap.json`文件，记录了文件的映射。

下面的配置是关于服务器端渲染的

* serverRender `{ boolean }` : 是否开启服务器端渲染
* severEntry `{ any }` : 服务器端的文件入口（参考webpack）
* serverOutput `{ any }` : 服务器端文件出口（参考webpack）

## [api、服务器端渲染](https://github.com/duan602728596/sweet/blob/master/packages/server/README.md)

## 环境变量

内置了环境变量，根据环境变量判断不同的编译环境。

* `process.env.SWEET_SERVER_RENDER`：判断当前环境是否为服务器端渲染。

## 使用typescript

在项目内添加`tsconfig.json`文件。

## 关于node-sass

node-sass如果安装失败，可以先到[https://github.com/sass/node-sass/releases](https://github.com/sass/node-sass/releases)下载**binding.node**文件，然后将该文件添加到**SASS_BINARY_PATH**环境变量内。