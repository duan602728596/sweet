import { requireModule } from '@sweet-milktea/utils';
import type { ProServer } from '@sweet-milktea/server/src/utils/types';
import type { Argv } from '../utils/types';

/* server 命令 */
async function argvServer(argv: Argv): Promise<void> {
  const proServer: ProServer = await requireModule('@sweet-milktea/server/proServer');

  const {
    httpPort,
    httpsPort,
    serverRoot,
    serverRender,
    serverRenderRoot,
    serverRenderFile,
    template,
    renderType,
    log,
    logUrl,
    logPm2,
    httpsKey,
    httpsCert,
    redirectToHttps,
    useBabelRegister
  }: Argv = argv;

  proServer({
    httpPort,
    httpsPort,
    serverRoot,
    serverRender,
    serverRenderRoot,
    serverRenderFile,
    template,
    renderType,
    log: log ? {
      type: logUrl ? 'http' : 'file',
      url: logUrl,
      pm2: logPm2
    } : undefined,
    httpsKey,
    httpsCert,
    redirectToHttps,
    useBabelRegister
  });
}

export default argvServer;