import argvDll from './argv/argvDll';
import argvStart from './argv/argvStart';
import argvViteStart from './argv/argvViteStart';
import argvBuild from './argv/argvBuild';
import argvViteBuild from './argv/argvViteBuild';
import argvServer from './argv/argvServer';
import argvUpdate from './argv/argvUpdate';
import argvImage2WebP from './argv/argvImage2WebP';
import argvImage2Avif from './argv/argvImage2Avif';
import argvImageCompress from './argv/argvImageCompress';
import argvImage2Icns from './argv/argvImage2Icns';
import argvMedia2WebP from './argv/argvMedia2WebP';

function command(yargs: any): any {
  /* 获取参数 */
  const argv: any = yargs
    .command('dll', '编译dll文件', (): void => undefined, argvDll)
    .command('start', '开发环境', (): void => undefined, argvStart)
    .command('vite-start', 'vite-开发环境', (): void => undefined, argvViteStart)
    .command('build', '编译代码', (): void => undefined, argvBuild)
    .command('vite-build', 'vite-编译代码', (): void => undefined, argvViteBuild)
    .command('server', '启动服务器', (): void => undefined, argvServer)
    .command('update', '工具：检查当前目录是否有依赖需要更新', (): void => undefined, argvUpdate)
    .command('image2webp', '工具：图片批量转换成webp格式', (): void => undefined, argvImage2WebP)
    .command('image2avif', '工具：图片批量转换成avif格式', (): void => undefined, argvImage2Avif)
    .command('media2webp', '工具：图片、视频批量转换成webp格式', (): void => undefined, argvMedia2WebP)
    .command('imageCompress', '工具：图片批量压缩', (): void => undefined, argvImageCompress)
    .command('image2icns', '工具：图片转icns图标', (): void => undefined, argvImage2Icns)
    .options({
      // milktea
      config: {
        describe: '配置文件的地址',
        type: 'string'
      },
      webpackLog: {
        describe: 'webpack日志类型',
        type: 'string'
      },
      // webpack服务
      server: {
        describe: '是否开启一个服务器',
        type: 'boolean'
      },
      httpPort: {
        describe: 'http服务的端口号',
        type: 'number'
      },
      httpsPort: {
        describe: 'https服务的端口号',
        type: 'number'
      },
      serverRoot: {
        describe: '服务器静态文件目录',
        type: 'string'
      },
      log: {
        describe: '开启日志',
        type: 'boolean'
      },
      logUrl: {
        describe: '配置日志的接口，会向接口发送日志来代替本地文件',
        type: 'string'
      },
      logPm2: {
        describe: '是否在pm2环境下运行程序',
        type: 'boolean'
      },
      httpsKey: {
        describe: 'https证书文件地址配置',
        type: 'string'
      },
      httpsCert: {
        describe: 'https证书文件地址配置',
        type: 'string'
      },
      socket: {
        describe: 'webpack服务的socket类型，sockjs或ws',
        type: 'string'
      },
      redirectToHttps: {
        describe: '重定向http到https',
        type: 'boolean'
      },
      useBabelRegister: {
        describe: '使用@babel/register来加载api文件和controllers文件',
        type: 'boolean'
      },
      // 服务器端渲染
      serverRender: {
        describe: '开启服务器端渲染',
        type: 'boolean'
      },
      serverRenderRoot: {
        describe: '服务器端渲染的模块文件目录',
        type: 'string'
      },
      serverRenderFile: {
        describe: '服务器端渲染的主模块文件',
        type: 'string'
      },
      template: {
        describe: 'html模版的文件名',
        type: 'string'
      },
      renderType: {
        describe: 'html使用的渲染模板，ejs 或 nunjucks。默认为ejs',
        type: 'string'
      },
      // image2webp & imageCompress & image2avif & image2icns
      imageEntry: {
        describe: '需要批量转换或压缩的图片所在的文件夹，或要转换成icns图标的图片文件',
        type: 'string'
      },
      imageOutput: {
        describe: '输出批量转换或压缩的图片的文件夹，或输出icns图标的文件',
        type: 'string'
      },
      ext: {
        describe: '其他批量转换成webp的图片或视频扩展名（扩展名用 “,” 分隔）',
        type: 'string'
      },
      converter: {
        describe: '使用的avif转换器，sharp或avifenc',
        type: 'string'
      },
      size: {
        describe: 'icns图标的尺寸',
        type: 'number'
      },
      retina: {
        describe: '1k屏或2k屏',
        type: 'number'
      },
      // update
      registry: {
        describe: 'Npm包信息地址。0：Npm，1：Yarn，2：CNpm，3：腾讯npm镜像',
        type: 'number'
      },
      peerDependencies: {
        describe: '是否搜索peerDependencies内的依赖',
        type: 'boolean'
      },
      __DEV__: {
        describe: '__DEV__',
        type: 'boolean'
      },
      __PACKAGES__: {
        describe: '__PACKAGES__',
        type: 'string'
      }
    }).argv;
}

export default command;