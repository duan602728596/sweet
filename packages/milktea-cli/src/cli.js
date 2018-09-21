#!/usr/bin/env node

/* 命令行工具 */
import yargs from 'yargs';
import argvDll from './argvDll';
import argvStart from './argvStart';
import argvBuild from './argvBuild';

/* 获取参数 */
const argv: Object = yargs
  .command('dll', '编译dll文件', (): void => null, argvDll)
  .command('start', '开发环境', (): void => null, argvStart)
  .command('build', '编译代码', (): void => null, argvBuild)
  .command('server', '启动服务器', (): void => null, argvBuild)
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
      describe: '生产环境下的服务器静态文件入口',
      type: 'string'
    }
  }).argv;