#!/usr/bin/env node

/* 命令行工具 */
import * as process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import command from './command';

command(yargs(hideBin(process.argv)));