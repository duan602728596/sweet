import * as webpack from 'webpack';
import { Compiler, Watching, Configuration } from 'webpack';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* start 命令 */
function argvStart(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const webpackConfig: Configuration = milktea.config(argv.config, 'development', argv.webpackLog);

  // koa-webpack需要output.publicPath
  if (argv.server) {
    if (!webpackConfig.output) {
      webpackConfig.output = {};
    }

    if (!webpackConfig.output.publicPath) {
      webpackConfig.output.publicPath = '/';
    }
  }

  const compiler: Compiler = webpack(webpackConfig);

  if (!_.isNil(argv.serverRender)) {
    const serverRenderCompiler: Compiler = webpack(
      milktea.serverRenderConfig(argv.config, 'development', argv.webpackLog)
    );
    const serverRenderWatching: Watching = serverRenderCompiler.watch({
      aggregateTimeout: 500
    }, !argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
  }

  if (!_.isNil(argv.server)) {
    const devServer: Function = requireModule('@sweet-milktea/server/devServer');
    const httpPort: number = argv.httpPort;
    const httpsPort: number = argv.httpsPort;
    const serverRender: boolean = argv.serverRender;
    const serverRenderRoot: string = argv.serverRenderRoot;
    const serverRenderFile: string = argv.serverRenderFile;
    const renderType: string = argv.renderType;
    const httpsKey: string = argv.httpsKey;
    const httpsCert: string = argv.httpsCert;
    const redirectToHttps: boolean = argv.redirectToHttps;
    const useBabelRegister: boolean = argv.useBabelRegister;
    const webpackLog: string = argv.webpackLog;

    devServer({
      compiler,
      httpPort,
      httpsPort,
      serverRender,
      serverRenderRoot,
      serverRenderFile,
      renderType,
      httpsKey,
      httpsCert,
      redirectToHttps,
      useBabelRegister,
      webpackLog
    });
  } else {
    const watching: Watching = compiler.watch({
      aggregateTimeout: 500
    }, !argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
  }
}

export default argvStart;