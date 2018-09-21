# @sweet/milktea

## 使用

1. 创建`.sweet.config.js`文件

2. node调用

```javascript
import webpack from 'webpack';
import milktea from '@sweet/milktea';

const compiler: Object = webpack(milktea.config());
compiler.run(milktea.callback); 
```

## 配置文件`.sweet.config.js`说明

* mode: 开发模式`development`还是生产模式`production`
* entry: 文件入口
* output: 文件出口
* externals: 外部扩展
* loaders: 重写loaders的默认规则
  * js: 重写默认的js规则
  * css: 重写默认的css规则
  * favicon: 重写网站图标的规则
  * fontFile: 重写字体文件的规则
  * html: 重写html的规则，默认为pug
  * image: 重写图片文件的规则
  * svg: 重写svg的规则
  * vue: 重写vue的规则
* rules: 自定义规则
* plugins: 自定义插件
* js: 
  * presets: 自定义presets
  * plugins: 自定义plugins
  * otherPresets: 重写presets
  * otherPlugins: 重写plugins
  * exclude: 重写exclude规则
* css: css配置
  * publicPath
  * modules开启css-in-modules
  * exclude: 重写exclude规则
* html: html配置
  * template: html模板，默认为pug
* frame: 值为`null`或`react`或`vue`，是否为react或vue模式，并自动注入loader和plugin
