import { requireModule } from '@sweet-milktea/utils';
import type Webpack from 'webpack';
import type { Compiler } from 'webpack';
import type { Milktea } from '../../../milktea/src/utils/types';
import type { Argv } from '../utils/types';

/* dll 命令 */
async function argvDll(argv: Argv): Promise<void> {
  const webpack: typeof Webpack = await requireModule('webpack');
  const milktea: Milktea = await requireModule('@sweet-milktea/milktea');

  const { config, webpackLog }: Argv = argv;
  const compiler: Compiler = webpack(
    await milktea.dllConfig({
      sweetConfig: config,
      webpackLog
    })
  );

  compiler.run(!webpackLog || webpackLog === 'progress' ? milktea.callbackOnlyError : milktea.callback);
}

export default argvDll;