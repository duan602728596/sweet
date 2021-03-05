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
        ts: {
          forkTsCheckerWebpackPlugin: false
        },
        html: [{ template: path.join(__dirname, '../src/index.pug') }]
      },
      mode
    })
  );

  return compiler;
}


export default createCompiler;