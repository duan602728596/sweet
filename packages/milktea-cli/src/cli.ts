#!/usr/bin/env node

/* 命令行工具 */
import * as yargs from 'yargs';
import argvDll from './argv/argvDll';
import argvStart from './argv/argvStart';
import argvBuild from './argv/argvBuild';
import argvServer from './argv/argvServer';
import argvUpdate from './argv/argvUpdate';

/* 获取参数 */
const argv: object = yargs
  .command('dll', '编译dll文件', (): void => undefined, argvDll)
  .command('start', '开发环境', (): void => undefined, argvStart)
  .command('build', '编译代码', (): void => undefined, argvBuild)
  .command('server', '启动服务器', (): void => undefined, argvServer)
  .command('update', '工具：检查当前目录是否有依赖需要更新', (): void => null, argvUpdate)
  .command('image2webp', '工具：图片批量转换成webp格式', (): void => null, argvUpdate)
  .options({
    // milktea
    config: {
      describe: '配置文件的地址',
      type: 'string'
    },
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
      describe: '服务器静态文件入口',
      type: 'string'
    },
    serverRender: {
      describe: '开启服务器端渲染',
      type: 'boolean'
    },
    serverRenderFile: {
      describe: '服务器端渲染的主模块文件',
      type: 'string'
    },
    // image2webp
    imageEntry: {
      describe: '需要批量转换的图片所在的文件夹',
      type: 'string'
    },
    imageOutput: {
      describe: '输出批量转换的图片的文件夹',
      type: 'string'
    },
    // update
    registry: {
      describe: 'Npm包信息地址。0：Npm，1：Yarn，2：CNpm',
      type: 'number'
    },
    __DEV__: {
      describe: '__DEV__',
      type: 'boolean'
    }
  }).argv;