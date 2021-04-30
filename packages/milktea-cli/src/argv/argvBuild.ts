import type Webpack from 'webpack';
import type { Compiler } from 'webpack';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { Milktea } from '@sweet-milktea/milktea/src/utils/types';
import type { Argv } from '../utils/types';

/* build 命令 */
async function argvBuild(argv: Argv): Promise<void> {
  const webpack: typeof Webpack = await requireModule('webpack');
  const milktea: Milktea = await requireModule('@sweet-milktea/milktea');

  const { config, webpackLog, serverRender }: Argv = argv;
  const compiler: Compiler = webpack(
    await milktea.config({
      sweetConfig: config,
      mode: 'production',
      webpackLog
    })
  );

  if (!_.isNil(serverRender)) {
    // 正常编译完毕后，编译ssr需要的文件
    compiler.hooks.done.tap('sweet-milktea-build', async function(): Promise<void> {
      const serverRenderCompiler: Compiler = webpack(
        await milktea.serverRenderConfig({
          sweetConfig: config,
          mode: 'production',
          webpackLog
        })
      );

      // 避免输出的log打断进度条
      serverRenderCompiler.run(!webpackLog || webpackLog === 'progress'
        ? milktea.callbackOnlyError
        : milktea.callback);
    });
  }

  compiler.run(!webpackLog || webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
}

export default argvBuild;