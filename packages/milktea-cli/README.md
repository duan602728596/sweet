# @sweet/milktea-cli

## 命令

* `milktea dll`: 编译dll文件
* `milktea start`: 开发环境
  * `--server`: 是否开启一个服务器，开发环境有效
  * `--httpPort`: http服务的端口号，开发环境（默认：5050）和服务器（默认：5052）
  * `--httpsPort`: https服务的端口号，开发环境（默认：5051）和服务器（默认：5053）
  * `--serverRender`: 开启服务器端渲染
  * `--serverRenderFile`: 服务器渲染的主模块文件
* `milktea build`: 编译代码
  * `--serverRender`: 开启服务器端渲染
* `milktea server`: 启动服务器
  * `--httpPort`: http服务的端口号，开发环境（默认：5050）和服务器（默认：5052）
  * `--httpsPort`: https服务的端口号，开发环境（默认：5051）和服务器（默认：5053）
  * `--serverRoot`: 服务器静态文件入口
  * `--serverRender`: 开启服务器端渲染
  * `--serverRenderFile`: 服务器端渲染的主模块文件