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
  .options({
    server: {
      alias: 's',
      describe: '是否开启一个服务器。',
      type: 'boolean'
    }
  }).argv;