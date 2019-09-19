import * as webpack from 'webpack';
import { Compiler } from 'webpack';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* build 命令 */
function argvBuild(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const compiler: Compiler = webpack(
    milktea.config(argv.config, 'production')
  );

  if (!_.isNil(argv.serverRender)) {
    // 正常编译完毕后，编译ssr需要的文件
    compiler.hooks.done.tap('build-ssr', function(): void {
      const serverRenderCompiler: Compiler = webpack(
        milktea.serverRenderConfig(argv.config, 'production')
      );

      serverRenderCompiler.run(milktea.callback);
    });
  }

  compiler.run(milktea.callback);
}

export default argvBuild;