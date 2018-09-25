/* start 命令 */
import webpack from 'webpack';
import { isNone } from './utils';

function argvStart(argv: Object): void{
  const milktea: Object = require('@sweet/milktea').default;
  const compiler: Object = webpack(milktea.config(null, 'development'));

  if(!isNone(argv.serverRender)){
    const serverRenderCompiler: Object = webpack(milktea.serverRenderConfig(null, 'development'));
    const serverRenderWatching: Object = serverRenderCompiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }

  if(!isNone(argv.server)){
    const devServer: Function = require('@sweet/server/lib/devServer').default;
    const httpPort: ?number = argv.httpPort;
    const httpsPort: ?number = argv.httpsPort;
    const serverRender: boolean = argv.serverRender;
    const serverRenderFile: ?string = argv.serverRenderFile;

    devServer({
      compiler,
      httpPort,
      httpsPort,
      serverRender,
      serverRenderFile
    });
  }else{
    const watching: Object = compiler.watch({
      aggregateTimeout: 500
    }, milktea.callback);
  }
}

export default argvStart;