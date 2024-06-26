# @sweet-milktea/milktea-cli

milktea-cli是一个快速运行环境的工具。

## 命令

milktea：以cjs模式启动。   
milktea-esm：以esm模式启动。

* `milktea dll`: 编译开发环境下使用的dll文件。
    * `--config`: 选择一个配置文件。
    * `--webpackLog`: 日志输出类型。progress：进度条，stats：传统的输出方式。默认为progress。
* `milktea start`: 运行开发环境。
    * `--config`: 选择一个配置文件。
    * `--server`: 开启一个Koa服务器，开发环境有效。
    * `--httpPort`: http服务的端口号。开发环境（默认：5050）和服务器（默认：5052）。
    * `--httpsPort`: https服务的端口号。开发环境（默认：5051）和服务器（默认：5053）。
    * `--httpsKey`: 配置https的证书（*.key）。
    * `--httpsCert`: 配置https的证书（*.crt）。
    * `--redirectToHttps`: 重定向http到https。
    * `--useBabelRegister`: 使用`@babel/register`来加载api文件和controllers文件。
    * `--webpackLog`: 日志输出类型。progress：进度条，stats：传统的输出方式。默认为progress。
    * `--serverRender`: 开启服务器端渲染。
    * `--serverRenderRoot`: 服务器端渲染的模块文件目录。默认为`dist-server`。
    * `--serverRenderFile`: 服务器渲染的主模块文件。默认为`server.mjs`。
    * `--socket`: socket类型。默认为`sockjs`，也可以配置为`ws`。
* `milktea vite-start`: 运行vite的开发环境。
    * `--config`: 选择一个配置文件。
    * `--httpPort`: http服务的端口号。开发环境（默认：5050）和服务器（默认：5052）。
    * `--httpsPort`: https服务的端口号。开发环境（默认：5051）和服务器（默认：5053）。
    * `--httpsKey`: 配置https的证书（*.key）。
    * `--httpsCert`: 配置https的证书（*.crt）。
    * `--redirectToHttps`: 重定向http到https。
    * `--useBabelRegister`: 使用`@babel/register`来加载api文件和controllers文件。
    * `--serverRender`: 开启服务器端渲染。
    * `--serverRenderRoot`: 服务器端渲染的模块文件目录。默认为`dist-server`。
    * `--serverRenderFile`: 服务器渲染的主模块文件。默认为`entry-server.mjs`。
* `milktea build`: 使用vite编译代码。
    * `--config`: 选择一个配置文件。
    * `--serverRender`: 开启服务器端渲染。
    * `--webpackLog`: 日志输出类型。progress：进度条，stats：传统的输出方式。默认为progress。
* `milktea vite-build`: 编译代码。
    * `--config`: 选择一个配置文件。
    * `--serverRender`: 开启服务器端渲染。
* `milktea server`: 启动生产环境的服务器。
    * `--config`: 选择一个配置文件。
    * `--httpPort`: http服务的端口号。开发环境（默认：5050）和服务器（默认：80）。
    * `--httpsPort`: https服务的端口号。开发环境（默认：5051）和服务器（默认：443）。
    * `--serverRoot`: 服务器静态文件入口。默认为`dist`。
    * `--log`: 是否开启日志功能。
    * `--logUrl`: 配置日志的接口，会向接口发送日志来代替本地文件。
    * `--logPm2`: 是否在pm2环境下运行程序。
    * `--httpsKey`: 配置https的证书（*.key）。
    * `--httpsCert`: 配置https的证书（*.crt）。
    * `--redirectToHttps`: 重定向http到https。
    * `--useBabelRegister`: 使用`@babel/register`来加载api文件和controllers文件。
    * `--serverRender`: 开启服务器端渲染。
    * `--serverRenderRoot`: 服务器端渲染的模块文件目录。默认为`dist-server`。 
    * `--serverRenderFile`: 服务器端渲染的主模块文件。默认为`server.mjs`。运行使用vite编译的模块，需要修改为`entry-server.mjs`。
    * `--template`: html模版的文件名。默认为`index.html`。
    * `--renderType`：html使用的渲染模板，`ejs`或`nunjucks`。默认为`ejs`。
* `milktea update`: 查看是否有依赖包需要更新。
    * `--registry`: Npm包信息地址。可能的值为 0：Npm源，1：Yarn源，2：CNpm源，3：腾讯Npm源。
* `milktea image2webp`: 将图片批量转换成`*.webp`格式。
    * `--imageEntry`: 源图片文件夹。
    * `--imageOutput`: 输出文件夹。
* `milktea image2avif`: 将图片批量转换成`*.avif`格式。
    * `--imageEntry`: 源图片文件夹。
    * `--imageOutput`: 输出文件夹。
    * `--converter`: 使用的转换器。`sharp`或`avifenc`。
* `milktea media2webp`: 将图片、视频批量转换成`*.webp`格式（首先需要自行安装`ffmpeg`）。
    * `--imageEntry`: 源图片文件夹。
    * `--imageOutput`: 输出文件夹。
    * `--ext`: 其他扩展名文件。
* `milktea imageCompress`: 图片批量压缩。
    * `--imageEntry`: 源图片文件夹。
    * `--imageOutput`: 输出文件夹。
* `milktea image2icns`: 将图片转换成`*.icns`图标。
    * `--imageEntry`: 转换成icns图标的图片文件。
    * `--imageOutput`: 输出icns图标文件。
    * `--size`: icns图标的尺寸。
    * `--retina`: 1k屏或2k屏。
  
## esm模式下，加载typescript配置文件

如果在esm模式下加载typescript配置文件，你需要安装ts-node，然后使用如下方式启动：

```shell
TS_NODE_PROJECT=tsconfig.ts-node.json NODE_OPTIONS="--loader ts-node/esm" milktea-esm start
```