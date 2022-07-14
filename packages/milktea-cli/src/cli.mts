#!/usr/bin/env node

/* 命令行工具 */
import * as process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
// @ts-ignore Node16
import command from './command';

command(yargs(hideBin(process.argv)));