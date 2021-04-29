#!/usr/bin/env node

/* @ts-ignore 命令行工具 */
import * as yargs from 'yargs';
import command from './command';

command(yargs);