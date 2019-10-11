import * as webpack from 'webpack';
import { Compiler } from 'webpack';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* build 命令 */
function argvBuild(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const compiler: Compiler = webpack(
    milktea.config(argv.config, 'production', argv.webpackLog)
  );

  if (!_.isNil(argv.serverRender)) {
    // 正常编译完毕后，编译ssr需要的文件
    compiler.hooks.done.tapAsync('sweet-milktea-build', function(): void {
      const serverRenderCompiler: Compiler = webpack(
        milktea.serverRenderConfig(argv.config, 'production', argv.webpackLog)
      );

      // 避免输出的log打断进度条
      serverRenderCompiler.run(!argv.webpackLog || argv.webpackLog === 'progress'
        ? milktea.callbackOnlyError
        : milktea.callback);
    });
  }

  compiler.run(!argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
}

export default argvBuild;