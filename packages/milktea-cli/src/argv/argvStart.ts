import type * as Webpack from 'webpack';
import type { Compiler, Configuration } from 'webpack';
import * as _ from 'lodash';
import type { Milktea } from '@sweet-milktea/milktea/src/utils/types';
import type { DevServer } from '@sweet-milktea/server/src/utils/types';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

/* start 命令 */
async function argvStart(argv: Argv): Promise<void> {
  const webpack: typeof Webpack = requireModule('webpack');
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');

  const {
    server,
    config,
    webpackLog,
    socket,
    serverRender,
    httpPort,
    httpsPort,
    serverRenderRoot,
    serverRenderFile,
    renderType,
    httpsKey,
    httpsCert,
    redirectToHttps,
    useBabelRegister
  }: Argv = argv;
  const isServerEnv: boolean = !_.isNil(server);
  const webpackConfig: Configuration = await milktea.config({
    sweetConfig: config,
    mode: 'development',
    webpackLog,
    hot: isServerEnv,
    socket
  });

  // hmr需要output.publicPath
  if (server) {
    const hotClientEntry: Function = requireModule('@sweet-milktea/server/hotClientEntry');

    webpackConfig.entry = hotClientEntry(webpackConfig.entry);
  }

  const compiler: Compiler = webpack(webpackConfig);
  let serverRenderCompiler: Compiler | null = null,
    serverRenderWatching: any | null = null;

  if (!_.isNil(serverRender)) {
    compiler.hooks.done.tapAsync('sweet-milktea-build', async function(): Promise<void> {
      // ssr的钩子只执行一次
      if (serverRenderCompiler !== null && serverRenderWatching !== null) return;

      const serverSideRenderConfig: Configuration = await milktea.serverRenderConfig({
        sweetConfig: config,
        mode: 'development',
        webpackLog
      });

      serverRenderCompiler = webpack(serverSideRenderConfig);
      serverRenderWatching = serverRenderCompiler.watch({
        aggregateTimeout: 500
      }, !webpackLog || webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
    });
  }

  if (isServerEnv) {
    const devServer: DevServer = requireModule('@sweet-milktea/server/devServer');

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
      socket
    });
  } else {
    const watching: any = compiler.watch({
      aggregateTimeout: 500
    }, !webpackLog || webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
  }
}

export default argvStart;