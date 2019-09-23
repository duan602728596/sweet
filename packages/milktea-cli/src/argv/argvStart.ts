import * as webpack from 'webpack';
import { Compiler, Watching, Configuration } from 'webpack';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* start 命令 */
function argvStart(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const webpackConfig: Configuration = milktea.config(argv.config, 'development');

  // koa-webpack需要output.publicPath
  if (!(_.isNil(argv.server) && webpackConfig.output && webpackConfig.output.publicPath)) {
    if (!webpackConfig.output) {
      webpackConfig.output = {};
    }

    webpackConfig.output.publicPath = '/';
  }

  const compiler: Compiler = webpack(webpackConfig);

  if (!_.isNil(argv.serverRender)) {
    const serverRenderCompiler: Compiler = webpack(
      milktea.serverRenderConfig(argv.config, 'development')
    );
    const serverRenderWatching: Watching = serverRenderCompiler.watch({
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
    const httpsKey: string = argv.httpsKey;
    const httpsCert: string = argv.httpsCert;
    const useBabelRegister: boolean = argv.useBabelRegister;

    devServer({
      compiler,
      httpPort,
      httpsPort,
      serverRender,
      serverRenderFile,
      renderType,
      httpsKey,
      httpsCert,
      useBabelRegister
    });
  } else {
    const watching: Watching = compiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }
}

export default argvStart;