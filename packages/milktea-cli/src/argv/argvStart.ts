import * as webpack from 'webpack';
import type { Compiler, Configuration } from 'webpack';
import * as _ from 'lodash';
import type { IUnionFs } from 'unionfs';
import { requireModule } from '../utils/utils';
import type { Milktea, Argv } from '../utils/types';

/* start 命令 */
function argvStart(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const webpackConfig: Configuration = milktea.config(argv.config, 'development', argv.webpackLog);

  // hmr需要output.publicPath
  if (argv.server) {
    const hotClientEntry: Function = requireModule('@sweet-milktea/server/hotClientEntry');

    webpackConfig.entry = hotClientEntry(webpackConfig.entry);
  }

  const compiler: Compiler = webpack(webpackConfig);
  let serverRenderCompiler: Compiler | null = null,
    serverRenderWatching: any | null = null,
    serverRenderOutputFileSystem: IUnionFs | null = null; // 内存文件系统

  if (!_.isNil(argv.serverRender)) {
    compiler.hooks.done.tap('sweet-milktea-build', function(): void {
      // ssr的钩子只执行一次
      if (serverRenderCompiler !== null && serverRenderWatching !== null) return;

      const serverSideRenderConfig: Configuration = milktea.serverRenderConfig(argv.config, 'development', argv.webpackLog);

      serverRenderCompiler = webpack(serverSideRenderConfig);

      // 修改虚拟文件系统
      if (argv.serverRenderMemFs && serverRenderOutputFileSystem) {
        // @ts-ignore
        serverRenderCompiler.outputFileSystem = serverRenderOutputFileSystem;
      }

      serverRenderWatching = serverRenderCompiler.watch({
        aggregateTimeout: 500
      }, !argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
    });
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

    if (argv.serverRenderMemFs) {
      serverRenderOutputFileSystem = devServer['createMemFs']();
    }

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
      serverRenderOutputFileSystem
    });
  } else {
    const watching: any = compiler.watch({
      aggregateTimeout: 500
    }, !argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
  }
}

export default argvStart;