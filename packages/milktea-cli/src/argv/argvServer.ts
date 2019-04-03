import { requireModule } from '../utils/utils';
import { Argv } from '../utils/types';

/* server 命令 */
function argvServer(argv: Argv): void {
  const proServer: Function = requireModule('@sweet/server/lib/proServer');
  const httpPort: number = argv.httpPort;
  const httpsPort: number = argv.httpsPort;
  const serverRoot: string = argv.serverRoot;
  const serverRender: boolean = argv.serverRender;
  const serverRenderFile: string = argv.serverRenderFile;
  const template: string = argv.template;

  proServer({
    httpPort,
    httpsPort,
    serverRoot,
    serverRender,
    serverRenderFile,
    template
  });
}

export default argvServer;