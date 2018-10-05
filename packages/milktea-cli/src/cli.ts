#!/usr/bin/env node

/* 命令行工具 */
import * as yargs from 'yargs';
import argvDll from './argvDll';
import argvStart from './argvStart';
import argvBuild from './argvBuild';
import argvServer from './argvServer';
import argvUpdate from './argvUpdate';

/* 获取参数 */
const argv: object = yargs
  .command('dll', '编译dll文件', (): void => undefined, argvDll)
  .command('start', '开发环境', (): void => undefined, argvStart)
  .command('build', '编译代码', (): void => undefined, argvBuild)
  .command('server', '启动服务器', (): void => undefined, argvServer)
  .command('update', '工具：检查当前目录是否有依赖需要更新', (): void => null, argvUpdate)
  .options({
    server: {
      alias: 's',
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
    registry: {
      describe: 'Npm包信息地址。0：Npm，1：Yarn，2：CNpm',
      type: 'number'
    },
    __DEV__: {
      describe: '__DEV__',
      type: 'boolean'
    }
  }).argv;