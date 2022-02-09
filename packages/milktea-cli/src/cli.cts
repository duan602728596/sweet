#!/usr/bin/env node

/* 命令行工具 */
import yargs from 'yargs';
import command from './command';

command(yargs);