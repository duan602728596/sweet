import * as webpack from 'webpack';
import type { Compiler, Configuration } from 'webpack';
import * as _ from 'lodash';
import type { Milktea } from '@sweet-milktea/milktea/src/utils/types';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

/* start 命令 */
function argvStart(argv: Argv): void {
  const isServerEnv: boolean = !_.isNil(argv.server);
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const webpackConfig: Configuration = milktea.config({
    sweetConfig: argv.config,
    mode: 'development',
    webpackLog: argv.webpackLog,
    hot: isServerEnv
  });

  // hmr需要output.publicPath
  if (argv.server) {
    const hotClientEntry: Function = requireModule('@sweet-milktea/server/hotClientEntry');

    webpackConfig.entry = hotClientEntry(webpackConfig.entry);
  }

  const compiler: Compiler = webpack(webpackConfig);
  let serverRenderCompiler: Compiler | null = null,
    serverRenderWatching: any | null = null;

  if (!_.isNil(argv.serverRender)) {
    compiler.hooks.done.tap('sweet-milktea-build', function(): void {
      // ssr的钩子只执行一次
      if (serverRenderCompiler !== null && serverRenderWatching !== null) return;

      const serverSideRenderConfig: Configuration = milktea.serverRenderConfig({
        sweetConfig: argv.config,
        mode: 'development',
        webpackLog: argv.webpackLog
      });

      serverRenderCompiler = webpack(serverSideRenderConfig);
      serverRenderWatching = serverRenderCompiler.watch({
        aggregateTimeout: 500
      }, !argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
    });
  }

  if (isServerEnv) {
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
      useBabelRegister
    });
  } else {
    const watching: any = compiler.watch({
      aggregateTimeout: 500
    }, !argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
  }
}

export default argvStart;