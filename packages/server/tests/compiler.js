import path from 'path';
import webpack from 'webpack';
import { config as webpackConfig } from '@sweet/milktea';

// 创建webpack配置
function createCompiler(mode = 'development') {
  const compiler = webpack(webpackConfig({
    frame: 'test',
    entry: {
      index: [path.join(__dirname, 'src/index.js')]
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/'
    },
    html: [{ template: path.join(__dirname, 'src/index.pug') }]
  }, mode)); // TODO: 生产环境下编译会卡进程，导致无法输出文件，所以将mode的值"production"改为"development"

  return compiler;
}


export default createCompiler;