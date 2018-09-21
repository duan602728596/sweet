#!/usr/bin/env node

/* 命令行工具 */
import yargs from 'yargs';
import argvDll from './argvDll';
import argvStart from './argvStart';

/* 获取参数 */
const argv: Object = yargs
  .command('dll', '编译dll', (): void => null, argvDll)
  .command('start', '开发环境', (): void => null, argvStart)
  .options({
    server: {
      alias: 's',
      demand: false,
      describe: '是否开启一个服务器。',
      type: 'boolean'
    }
  }).argv;