## @sweet-milktea/milktea api

| 配置项 | 类型 | 说明 |
| ---    | ---  | ---  |
| mode      | string        | 开发模式还是生产模式    |
| dll       | Array<string> | 配置需要编译的dll模块   |
| entry     | any           | 文件入口（参考webpack） |
| output    | any           | 文件出口（参考webpack） |
| externals | object        | 外部扩展（参考webpack） |
| resolve   | object        | 解析（参考webpack）     |
| devtool   | string        | 设置SourceMap的类型     |
| loaders   | object        | 重写loaders的默认规则   |
| - loaders.js       | object | 重写默认的javascript规则  |
| - loaders.ts       | object | 重写默认的typescript规则  |
| - loaders.sass     | object | 重写默认的sass规则        |
| - loaders.css      | object | 重写默认的css规则         |
| - loaders.favicon  | object | 重写网站图标的规则        |
| - loaders.fontFile | object | 重写字体文件的规则        |
| - loaders.html     | object | 重写html的规则，默认为pug |
| - loaders.image    | object | 重写图片文件的规则        |
| - loaders.svg      | object | 重写svg的规则             |
| - loaders.vue      | object | 重写vue的规则             |
| rules   | Array<object> | 自定义规则        |
| noParse | RegExp &#124; Array<RegExp> &#124; Function | 防止解析任何与给定正则表达式相匹配的文件（参考webpack）|
| plugins | Array<any>    | 自定义webpack插件 |
| js      | object        | javascript配置    |
| - js.targets      | object        | 配置@babel/preset-env的编译目标 |
| - js.ecmascript   | boolean       | 是否编译到ecmascript的最新语法（即不使用@babel/preset-env，通常适用于node、nwjs和electron） |
| - js.presets      | Array<any>    | 自定义presets |
| - js.plugins      | Array<any>    | 自定义plugins |
| - js.resetPresets | Array<any>  | 重写presets     |
| - js.resetPlugins | Array<any>  | 重写plugins     |
| - js.exclude      | RegExp        | exclude规则   |
| - js.include      | RegExp        | include规则   |
| ts           | object        | typescript配置 |
| - ts.presets | Array<any>    | 自定义presets  |
| - ts.plugins | Array<any>    | 自定义plugins  |
| - ts.exclude | RegExp        | exclude规则    |
| - ts.include | RegExp        | include规则    |
| sass         | object        | sass配置       |
| - sass.publicPath | string  | &nbsp; |
| - sass.modules    | boolean  | 开启css-in-modules |
| - sass.exclude    | RegExp  | exclude规则 |
| - sass.include    | RegExp  | include规则 |
| - sass.data       | string &#124; Function | 注入sass变量（参考sass-loader） |
| - sass.localIdentName | string   | 配置localIdentName（参考css-loader） |
| - sass.getLocalIdent  | Function | 配置getLocalIdent（参考css-loader）  |
| - sass.data  | string &#124; Function | 注入sass变量（参考sass-loader） |
| css          | object       | css配置 |
| - css.publicPath | string  | &nbsp; |
| - css.modules    | boolean | 开启css-in-modules |
| - css.exclude    | RegExp  | exclude规则 |
| - css.include    | RegExp  | include规则 |
| - sass.modifyVars     | object   | 注入less变量（参考less-loader）      |
| - sass.localIdentName | string   | 配置localIdentName（参考css-loader） |
| - sass.getLocalIdent  | Function | 配置getLocalIdent（参考css-loader）  |
| html | Array<object>  | html配置（默认使用pug）          |
| - html.template       | string        | html模板文件地址 |
| - html.excludeChunks  | Array<string> | 不包括的入口     |
| frame        | string   | 值为`react`或`vue`，是否为react或vue模式，并自动注入loaders和plugins |
| chainWebpack | Function | 通过`webpack-chain`的API扩展或修改webpack配置          |
| filesMap     | boolean &#124; object | 输出`filesMap.json`文件，记录了文件的映射 |

### 下面的配置是关于服务器端渲染的

| 配置项 | 类型 | 说明 |
| ---    | ---  | ---  |
| serverRender | boolean | 是否开启服务器端渲染              |
| severEntry   | any     | 服务器端的文件入口（参考webpack） |
| serverOutput | any     | 服务器端文件出口（参考webpack）   |