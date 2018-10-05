/* server 命令 */
import { requireModule } from './utils/utils';
import { Argv } from './utils/types';

function argvServer(argv: Argv): void{
  const proServer: Function = requireModule('@sweet/server/lib/proServer');
  const httpPort: number = argv.httpPort;
  const httpsPort: number = argv.httpsPort;
  const serverRoot: string = argv.serverRoot;
  const serverRender: boolean = argv.serverRender;
  const serverRenderFile: string = argv.serverRenderFile;

  proServer({
    httpPort,
    httpsPort,
    serverRoot,
    serverRender,
    serverRenderFile
  });
}

export default argvServer;