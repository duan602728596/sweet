import webpack from 'webpack';
import { milktea } from './milkteaModule';

/* dll命令 */
function argvDll(argv: Object): void{
  const compiler: Object = webpack(milktea.dll());

  compiler.run(milktea.callback);
}

export default argvDll;