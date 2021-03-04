import * as _ from 'lodash';
import { Argv } from '../utils/types';
import type { MilkVite } from '@sweet-milktea/milktea-vite/src/utils/types';
import { requireModule } from '../utils/utils';

/* vite-build 命令 */
async function argvViteBuild(argv: Argv): Promise<void> {
  const milkteaVite: MilkVite = requireModule('@sweet-milktea/milktea-vite');

  await milkteaVite.build({
    sweetConfig: argv.config,
    mode: 'production'
  });

  if (!_.isNil(argv.serverRender)) {
    await milkteaVite.serverRenderBuild({
      sweetConfig: argv.config,
      mode: 'production'
    });
  }
}

export default argvViteBuild;