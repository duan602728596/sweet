import webpack from 'webpack';
import { milktea } from './milkteaModule';

/* build命令 */
function argvBuild(argv: Object): void{
  const compiler: Object = webpack(milktea.config('production'));

  compiler.run(milktea.callback);
}

export default argvBuild;