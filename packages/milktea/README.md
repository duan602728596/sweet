# @sweet/milkteaModule

## 使用

1. 创建`.sweet.config.js`文件

2. node调用

```javascript
import webpack from 'webpack';
import milkteaModule from '@sweet/milkteaModule';

// mode`{ string }`: 开发模式`development`还是生产模式`production`
const mode: string = 'development';

const compiler: Object = webpack(milkteaModule.config(mode));
compiler.run(milkteaModule.callback);
```

## 配置文件`.sweet.config.js`说明

* entry`{ any }`: 文件入口（参考webpack）
* output`{ any }`: 文件出口，参考webpack
* externals`{ any }`: 外部扩展，参考webpack
* loaders: 重写loaders的默认规则
  * js`{ Object }`: 重写默认的js规则
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
  * ecmascript`{ boolean }`: 是否编译到ecmascript的最新语法（通常适用于nwjs和electron）
  * presets`{ Array }`: 自定义presets
  * plugins`{ Array }`: 自定义plugins
  * otherPresets`{ Array }`: 重写presets
  * otherPlugins`{ Array }`: 重写plugins
  * exclude`{ RegExp }`: 重写exclude规则
* css: css配置
  * publicPath`{ string }`
  * modules`{ boolean }`开启css-in-modules
  * exclude`{ RegExp }`: 重写exclude规则
* html: html配置
  * template`{ string }`: html模板，默认为pug
* file: 文件配置
  * emitFile`{ boolean }`: 是否生成文件
* frame`{ ?string }`: 值为`null`或`react`或`vue`，是否为react或vue模式，并自动注入loader和plugin
