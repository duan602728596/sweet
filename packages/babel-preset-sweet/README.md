# @sweet-milktea/babel-preset-sweet

## 插件配置

* env
  * nodeEnv `{ boolean }` : 是否为node环境
  * ecmascript `{ boolean }` : 编译到esnext
  * targets `{ object }` : 自定义babel的编译目标
  * debug `{ boolean }` : 开启debug信息
  * modules `{ boolean | string }` : 模块加载方式
  * useBuiltIns `{ boolean | string }` : useBuiltIns
* typescript
  * use `{ boolean }` : 是否开启typescript转换
  * isReact `{ boolean }` : 是否开启typescript-jsx转换，默认开启
* react
  * use `{ boolean }` : 是否开启react转换，默认开启
  * runtime `{ string }` : 是否使用react/jsx-runtime，默认根据react版本判断
  * development `{ boolean }`: 是否为开发环境
* polyfill `{ boolean }` : 使用babel-plugin-polyfill-{name}相关插件