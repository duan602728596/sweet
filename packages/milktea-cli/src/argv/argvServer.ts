import { requireModule } from '../utils/utils';
import { Argv } from '../utils/types';

/* server 命令 */
function argvServer(argv: Argv): void {
  const proServer: Function = requireModule('@sweet-milktea/server/proServer');
  const httpPort: number = argv.httpPort;
  const httpsPort: number = argv.httpsPort;
  const serverRoot: string = argv.serverRoot;
  const serverRender: boolean = argv.serverRender;
  const serverRenderFile: string = argv.serverRenderFile;
  const template: string = argv.template;
  const renderType: string = argv.renderType;
  const log: boolean = argv.log;
  const logUrl: string = argv.logUrl;
  const logPm2: boolean = argv.logPm2;
  const httpsKey: string = argv.httpsKey;
  const httpsCert: string = argv.httpsCert;

  proServer({
    httpPort,
    httpsPort,
    serverRoot,
    serverRender,
    serverRenderFile,
    template,
    renderType,
    log: log ? {
      type: logUrl ? 'http' : 'file',
      url: logUrl || undefined,
      pm2: logPm2
    } : undefined,
    httpsKey,
    httpsCert
  });
}

export default argvServer;