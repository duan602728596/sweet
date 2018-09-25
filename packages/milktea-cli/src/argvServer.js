/* server 命令 */

function argvServer(argv: Object): void{
  const proServer: Function = require('@sweet/server/lib/proServer').default;
  const httpPort: ?number = argv.httpPort;
  const httpsPort: ?number = argv.httpsPort;
  const serverRoot: ?string = argv.serverRoot;
  const serverRender: boolean = argv.serverRender;
  const serverRenderFile: ?string = argv.serverRenderFile;

  proServer({
    httpPort,
    httpsPort,
    serverRoot,
    serverRender,
    serverRenderFile
  });
}

export default argvServer;