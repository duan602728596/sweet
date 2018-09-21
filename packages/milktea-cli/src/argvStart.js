import webpack from 'webpack';
import { milktea, devServer } from './milkteaModule';

/* start命令 */
function argvStart(argv: Object): void{
  const compiler: Object = webpack(milktea.config('development'));
  const httpPort: number = argv.httpPort;
  const httpsPort: number = argv.httpsPort;

  if(argv.server){
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