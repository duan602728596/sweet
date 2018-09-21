import { milktea, proServer } from './milkteaModule';

/* server 命令 */
function argvServer(argv: Object): void{
  const httpPort: ?number = argv.httpPort;
  const httpsPort: ?number = argv.httpsPort;
  const serverRoot: ?string = argv.serverRoot;

  proServer({
    httpPort,
    httpsPort,
    serverRoot
  });
}

export default argvServer;