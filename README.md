# sweet

> 甜甜的奶茶，甜甜的......   
> ![](tsl.jpg)

sweet是一个webpack的通用配置解决方案。

## 特点：

1. 支持React和Vue的开发，会根据配置自动添加所需要的loaders和plugins。  
2. 在开发环境下可以选择直接编译到指定目录（适用于Nwjs和Electron的开发），网站的开发可以使用基于Koa的服务器。
3. 在生产环境下可以编译后快速部署。
4. 支持react、vue的服务端的渲染（demo查看react-server-demo和vue-server-demo分支）。

## packages：

* [@sweet/milktea](packages/milktea/README.md)
* [@sweet/milktea-cli](packages/milktea-cli/README.md)
* [@sweet/server](packages/server/README.md)
* [@sweet/util-tools](packages/util-tools/README.md)
