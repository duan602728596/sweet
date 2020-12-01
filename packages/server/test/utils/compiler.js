import path from 'path';
import webpack from 'webpack';
import { config as webpackConfig } from '@sweet-milktea/milktea';
import hotClientEntry from '../../hotClientEntry';

// 创建webpack配置
function createCompiler(entry, mode = 'development') {
  const compiler = webpack(
    webpackConfig({
      sweetConfig: {
        frame: 'test',
        entry: hotClientEntry({
          index: [path.join(__dirname, entry)]
        }),
        output: {
          path: path.join(__dirname, '../dist'),
          filename: '[name].js',
          publicPath: '/'
        },
        html: [{ template: path.join(__dirname, '../src/index.pug') }]
      },
      mode
    })
  ); // TODO: 生产环境下编译会卡进程，导致无法输出文件，所以将mode的值"production"改为"development"

  return compiler;
}


export default createCompiler;