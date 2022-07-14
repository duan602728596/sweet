import { requireModule } from '@sweet-milktea/utils';
import type { ViteDevServer } from 'vite';
import type { MilkVite } from '@sweet-milktea/milktea-vite/src/utils/types.js';
import type { DevServer } from '@sweet-milktea/server/src/utils/types.js';
import type { Argv } from '../utils/types.js';

/* vite-start 命令 */
async function argvViteStart(argv: Argv): Promise<void> {
  const milkteaVite: MilkVite = await requireModule('@sweet-milktea/milktea-vite');
  const devServer: DevServer = await requireModule('@sweet-milktea/server/devServer');

  const {
    config,
    httpPort,
    httpsPort,
    serverRender,
    serverRenderRoot,
    serverRenderFile,
    renderType,
    httpsKey,
    httpsCert,
    redirectToHttps,
    useBabelRegister
  }: Argv = argv;
  const vite: ViteDevServer = await milkteaVite.config({
    sweetConfig: config,
    mode: 'development'
  });

  devServer({
    compiler: vite,
    httpPort,
    httpsPort,
    serverRender,
    serverRenderRoot,
    serverRenderFile,
    renderType,
    httpsKey,
    httpsCert,
    redirectToHttps,
    useBabelRegister,
    vite: true
  });
}

export default argvViteStart;