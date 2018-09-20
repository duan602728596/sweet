/* 命令行工具 */
import webpack from 'webpack';
import yargs from 'yargs';
import { dll } from './milktea';

/* 获取参数 */
const argv: Object = yargs.options({
  dll: {
    demand: false,
    describe: '创建dll文件。',
    type: 'boolean'
  }
}).argv;

// 创建dll文件
if(argv.dll !== undefined){
  webpack(dll());
}
