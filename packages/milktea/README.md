# @sweet/milktea

## 使用

1. 创建`sweet.config.js`文件

2. node调用

```javascript
import webpack from 'webpack';
import milktea from '@sweet/milktea';

// mode`{ string }`: 开发模式`development`还是生产模式`production`
const mode: string = 'development';

const compiler: Object = webpack(milktea.config(mode));
compiler.run(milktea.callback);
```

## 配置文件`.sweet.config.js`说明

### 使用方法

根目录下创建`.sweet.config.js`文件。代码如下所示：

```javascript
module.exports = {
  ... // 配置
};
```

### 配置

* mode`{ string }`: 开发模式还是生产模式
* entry`{ any }`: 文件入口（参考webpack）
* output`{ any }`: 文件出口（参考webpack）
* externals`{ any }`: 外部扩展（参考webpack）
* loaders: 重写loaders的默认规则
  * js`{ Object }`: 重写默认的js规则
  * sass`{ Object }`: 重写默认的sass规则
  * css`{ Object }`: 重写默认的css规则
  * favicon`{ Object }`: 重写网站图标的规则
  * fontFile`{ Object }`: 重写字体文件的规则
  * html`{ Object }`: 重写html的规则，默认为pug
  * image`{ Object }`: 重写图片文件的规则
  * svg`{ Object }`: 重写svg的规则
  * vue`{ Object }`: 重写vue的规则
* rules`{ Array }`: 自定义规则
* plugins`{ Array }`: 自定义插件
* js`{ Object }`: js配置
  * ecmascript`{ boolean }`: 是否编译到ecmascript的最新语法（即不使用@babel/preset-env，通常适用于node、nwjs和electron）
  * presets`{ Array }`: 自定义presets
  * plugins`{ Array }`: 自定义plugins
  * resetPresets`{ Array }`: 重写presets
  * resetPlugins`{ Array }`: 重写plugins
  * exclude`{ RegExp }`: exclude规则
  * include`{ RegExp }`: include规则
* sass`{ Object }`: sass配置
  * publicPath`{ string }`
  * modules`{ boolean }`开启css-in-modules
  * exclude`{ RegExp }`: exclude规则
  * include`{ RegExp }`: include规则
* css`{ Object }`: css配置（默认使用less）
  * publicPath`{ string }`
  * modules`{ boolean }`开启css-in-modules
  * exclude`{ RegExp }`: exclude规则
  * include`{ RegExp }`: include规则
  * modifyVars`{ Object }`: 注入less变量
* html`{ Array<Object> }`: html配置（默认使用pug）
  * template`{ string }`: html模板文件地址
  * excludeChunks`{ Array<string> }`: 不包括的入口
* frame`{ ?string }`: 值为`null`或`react`或`vue`，是否为react或vue模式，并自动注入loader和plugin

下面的配置是关于服务器端渲染的

* serverRender`{ boolean }`: 是否开启服务器端渲染
* severEntry`{ any }`: 服务器端的文件入口（参考webpack）
* serverOutput`{ any }`: 服务器端文件出口（参考webpack）

## 关于node-sass

node-sass如果安装失败，可以先到[https://github.com/sass/node-sass/releases](https://github.com/sass/node-sass/releases)下载**binding.node**文件，然后将该文件添加到**SASS_BINARY_PATH**环境变量内。