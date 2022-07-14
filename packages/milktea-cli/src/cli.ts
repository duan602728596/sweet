#!/usr/bin/env node

/* 命令行工具 */
import * as process from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import command from './command.js';

command(yargs(hideBin(process.argv)));