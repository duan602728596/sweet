import path from 'node:path';
import webpack from 'webpack';
import { config as webpackConfig } from '@sweet-milktea/milktea';
import { metaHelper } from '@sweet-milktea/utils';
import hotClientEntry from '../../esm/hotClientEntry.js';

const { __dirname } = metaHelper(import.meta.url);

// 创建webpack配置
async function createCompiler(entry, mode = 'development') {
  const compiler = webpack(
    await webpackConfig({
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
        typescript: {
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