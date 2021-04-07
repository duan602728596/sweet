import type { ProServer } from '@sweet-milktea/server/src/utils/types';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

/* server 命令 */
function argvServer(argv: Argv): void {
  const proServer: ProServer = requireModule('@sweet-milktea/server/proServer');

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