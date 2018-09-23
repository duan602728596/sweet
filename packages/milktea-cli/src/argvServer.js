/* server 命令 */

function argvServer(argv: Object): void{
  const proServer: Function = require('@sweet/server/lib/proServer').default;
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