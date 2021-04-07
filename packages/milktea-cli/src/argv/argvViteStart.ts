import type { ViteDevServer } from 'vite';
import { Argv } from '../utils/types';
import type { MilkVite } from '@sweet-milktea/milktea-vite/src/utils/types';
import type { DevServer } from '@sweet-milktea/server/src/utils/types';
import { requireModule } from '../utils/utils';

/* vite-start 命令 */
async function argvViteStart(argv: Argv): Promise<void> {
  const milkteaVite: MilkVite = requireModule('@sweet-milktea/milktea-vite');

  const vite: ViteDevServer = await milkteaVite.config({
    sweetConfig: argv.config,
    mode: 'development'
  });
  const devServer: DevServer = requireModule('@sweet-milktea/server/devServer');
  const httpPort: number = argv.httpPort;
  const httpsPort: number = argv.httpsPort;
  const serverRender: boolean = argv.serverRender;
  const serverRenderRoot: string = argv.serverRenderRoot;
  const serverRenderFile: string = argv.serverRenderFile;
  const renderType: 'ejs' | 'nunjucks' = argv.renderType;
  const httpsKey: string = argv.httpsKey;
  const httpsCert: string = argv.httpsCert;
  const redirectToHttps: boolean = argv.redirectToHttps;
  const useBabelRegister: boolean = argv.useBabelRegister;

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