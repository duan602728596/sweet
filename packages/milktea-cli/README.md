# @sweet/milktea-cli

milktea-cli是一个快速运行环境的工具。

## 命令

* `milktea dll`: 编译开发环境下使用的dll文件。
  * `--config`: 选择一个配置文件。
* `milktea start`: 运行开发环境。
  * `--config`: 选择一个配置文件。
  * `--server`: 开启一个Koa服务器，开发环境有效。
  * `--httpPort`: http服务的端口号。开发环境（默认：5050）和服务器（默认：5052）。
  * `--httpsPort`: https服务的端口号。开发环境（默认：5051）和服务器（默认：5053）。
  * `--serverRender`: 开启服务器端渲染。
  * `--serverRenderFile`: 服务器渲染的主模块文件。默认为`buildServer/server.js`。
* `milktea build`: 编译代码。
  * `--config`: 选择一个配置文件。
  * `--serverRender`: 开启服务器端渲染。
* `milktea server`: 启动生产环境的服务器。
  * `--config`: 选择一个配置文件。
  * `--httpPort`: http服务的端口号。开发环境（默认：5050）和服务器（默认：5052）。
  * `--httpsPort`: https服务的端口号。开发环境（默认：5051）和服务器（默认：5053）。
  * `--serverRoot`: 服务器静态文件入口。默认为`build`。
  * `--serverRender`: 开启服务器端渲染。
  * `--serverRenderFile`: 服务器端渲染的主模块文件。默认为`buildServer/server.js`。
  * `--template`: html模版的文件名。默认为`index.html`。
* `milktea update`: 查看是否有依赖包需要更新。
  * `--registry`: Npm包信息地址。可能的值为 0：Npm源，1：Yarn源，2：CNpm源。
* `milktea image2webp`: 将图片批量转换成`*.webp`格式。
  * `--imageEntry`: 源图片文件夹。
  * `--imageOutput`: 输出文件夹。
  * `--quality`: 图片质量。
* `milktea imageCompress`: 图片批量压缩。
  * `--imageEntry`: 源图片文件夹。
  * `--imageOutput`: 输出文件夹。