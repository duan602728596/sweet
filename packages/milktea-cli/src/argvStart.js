import webpack from 'webpack';
import { milktea, devServer } from './milkteaModule';

/* start 命令 */
function argvStart(argv: Object): void{
  const compiler: Object = webpack(milktea.config('development'));

  if(argv.server){
    const httpPort: ?number = argv.httpPort;
    const httpsPort: ?number = argv.httpsPort;

    devServer({
      compiler,
      httpPort,
      httpsPort
    });
    return void 0;
  }

  const watching: Object = compiler.watch({
    aggregateTimeout: 500
  }, milktea.callback);
}

export default argvStart;