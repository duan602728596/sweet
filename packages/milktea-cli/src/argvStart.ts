/* start 命令 */
import * as webpack from 'webpack';
import { isNone, requireModule } from './utils/utils';
import { Milktea, Argv } from './utils/types';

function argvStart(argv: Argv): void{
  const milktea: Milktea = requireModule('@sweet/milktea');
  const compiler: webpack.Compiler = webpack(milktea.config(null, 'development'));

  if(!isNone(argv.serverRender)){
    const serverRenderCompiler: webpack.Compiler = webpack(milktea.serverRenderConfig(null, 'development'));
    const serverRenderWatching: webpack.Compiler.FSWatcher = serverRenderCompiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }

  if(!isNone(argv.server)){
    const devServer: Function = requireModule('@sweet/server/lib/devServer');
    const httpPort: number = argv.httpPort;
    const httpsPort: number = argv.httpsPort;
    const serverRender: boolean = argv.serverRender;
    const serverRenderFile: string = argv.serverRenderFile;

    devServer({
      compiler,
      httpPort,
      httpsPort,
      serverRender,
      serverRenderFile
    });
  }else{
    const watching: webpack.Compiler.FSWatcher = compiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }
}

export default argvStart;