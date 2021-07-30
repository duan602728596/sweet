import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { Argv } from '../utils/types';
import type { MilkVite } from '@sweet-milktea/milktea-vite/src/utils/types';

/* vite-build 命令 */
async function argvViteBuild(argv: Argv): Promise<void> {
  const milkteaVite: MilkVite = await requireModule('@sweet-milktea/milktea-vite');

  const { config, serverRender }: Argv = argv;

  await milkteaVite.build({
    sweetConfig: config,
    mode: 'production'
  });

  if (!_.isNil(serverRender)) {
    await milkteaVite.serverRenderBuild({
      sweetConfig: config,
      mode: 'production'
    });
  }
}

export default argvViteBuild;