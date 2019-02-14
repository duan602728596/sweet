import * as webpack from 'webpack';
import { requireModule } from '../utils/utils';
import { Milktea, Argv } from '../utils/types';

/* dll 命令 */
function argvDll(argv: Argv): void{
  const milktea: Milktea = requireModule('@sweet/milktea');
  const compiler: webpack.Completer = webpack(milktea.dll(argv.config));

  compiler.run(milktea.callback);
}

export default argvDll;