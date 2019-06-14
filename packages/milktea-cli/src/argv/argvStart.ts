import * as webpack from 'webpack';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* start 命令 */
function argvStart(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const webpackConfig: object = milktea.config(argv.config, 'development');

  // koa-webpack需要output.publicPath
  if (!_.isNil(argv.server) && !webpackConfig['output'].publicPath) {
    webpackConfig['output'].publicPath = '/';
  }

  const compiler: webpack.Compiler = webpack(webpackConfig);

  if (!_.isNil(argv.serverRender)) {
    const serverRenderCompiler: webpack.Compiler = webpack(
      milktea.serverRenderConfig(argv.config, 'development')
    );
    const serverRenderWatching: webpack.Watching = serverRenderCompiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }

  if (!_.isNil(argv.server)) {
    const devServer: Function = requireModule('@sweet-milktea/server/devServer');
    const httpPort: number = argv.httpPort;
    const httpsPort: number = argv.httpsPort;
    const serverRender: boolean = argv.serverRender;
    const serverRenderFile: string = argv.serverRenderFile;
    const renderType: string = argv.renderType;

    devServer({
      compiler,
      httpPort,
      httpsPort,
      serverRender,
      serverRenderFile,
      renderType
    });
  } else {
    const watching: webpack.Watching = compiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }
}

export default argvStart;