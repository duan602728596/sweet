import * as webpack from 'webpack';
import type { Compiler } from 'webpack';
import { requireModule } from '../utils/utils';
import type { Milktea, Argv } from '../utils/types';

/* dll 命令 */
function argvDll(argv: Argv): void {
  const milktea: Milktea = requireModule('@sweet-milktea/milktea');
  const compiler: Compiler = webpack(
    milktea.dllConfig({
      sweetConfig: argv.config,
      webpackLog: argv.webpackLog
    })
  );

  compiler.run(!argv.webpackLog || argv.webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
}

export default argvDll;