import type Webpack from 'webpack';
import type { Compiler, Configuration } from 'webpack';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { Milktea } from '../../../milktea/src/utils/types.js';
import type { DevServer } from '../../../server/src/utils/types.js';
import type { Argv } from '../utils/types.js';

/* start 命令 */
async function argvStart(argv: Argv): Promise<void> {
  const webpack: typeof Webpack = await requireModule('webpack');
  const milktea: Milktea = await requireModule('@sweet-milktea/milktea');

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
    const hotClientEntry: Function = await requireModule('@sweet-milktea/server/hotClientEntry');

    webpackConfig.entry = hotClientEntry(webpackConfig.entry);
  }

  const compiler: Compiler = webpack(webpackConfig);
  let serverRenderCompiler: Compiler | null = null,
    serverRenderWatching: any | null = null;

  if (!_.isNil(serverRender)) {
    compiler.hooks.done.tap('sweet-milktea-build', async function(): Promise<void> {
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
    const devServer: DevServer = await requireModule('@sweet-milktea/server/devServer');

    devServer({
      compiler: compiler as any,
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