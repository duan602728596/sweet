import webpack from 'webpack';
import { milktea } from './milktea';

/* start命令 */
function argvStart(argv: Object): void{
  const compiler: Object = webpack(milktea.config('development'));

  if(argv.server){
    return void 0;
  }

  const watching: Object = compiler.watch({
    aggregateTimeout: 500
  }, milktea.callback);
}

export default argvStart;