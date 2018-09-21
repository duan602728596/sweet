#!/usr/bin/env node
/* 命令行工具 */
import yargs from 'yargs';
import argvDll from './argvDll';

/* 获取参数 */
const argv: Object = yargs
  .command('dll', '编译dll', (): void => null, argvDll)
  .options({}).argv;