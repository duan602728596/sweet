import type { ProServer } from '@sweet-milktea/server/src/utils/types';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

/* server 命令 */
function argvServer(argv: Argv): void {
  const proServer: ProServer = requireModule('@sweet-milktea/server/proServer');

  const httpPort: number = argv.httpPort;
  const httpsPort: number = argv.httpsPort;
  const serverRoot: string = argv.serverRoot;
  const serverRender: boolean = argv.serverRender;
  const serverRenderRoot: string = argv.serverRenderRoot;
  const serverRenderFile: string = argv.serverRenderFile;
  const template: string = argv.template;
  const renderType: 'ejs' | 'nunjucks' = argv.renderType;
  const log: boolean = argv.log;
  const logUrl: string = argv.logUrl;
  const logPm2: boolean = argv.logPm2;
  const httpsKey: string = argv.httpsKey;
  const httpsCert: string = argv.httpsCert;
  const redirectToHttps: boolean = argv.redirectToHttps;
  const useBabelRegister: boolean = argv.useBabelRegister;

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