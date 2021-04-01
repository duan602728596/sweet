编译时添加压缩配置。

```javascript
const TerserPlugin = require('terser-webpack-plugin');

{
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          ecma: 5,
          safari10: true
        }
      })
    ]
  }
}
```