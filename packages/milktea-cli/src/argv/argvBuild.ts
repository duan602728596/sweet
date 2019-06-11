import * as webpack from 'webpack';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* build 命令 */
function argvBuild(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const compiler: webpack.Compiler = webpack(
    milktea.config(argv.config, 'production')
  );

  compiler.run(milktea.callback);

  if (!_.isNil(argv.serverRender)) {
    const serverRenderCompiler: webpack.Compiler = webpack(
      milktea.serverRenderConfig(argv.config, 'production')
    );

    serverRenderCompiler.run(milktea.callback);
  }
}

export default argvBuild;