/* start 命令 */

function argvStart(argv: Object): void{
  const milktea: Object = require('@sweet/milktea').default;
  const compiler: Object = webpack(milktea.config('development'));

  if(argv.server){
    const devServer: Function = require('@sweet/server/lib/devServer').default;
    const httpPort: ?number = argv.httpPort;
    const httpsPort: ?number = argv.httpsPort;

    devServer({
      compiler,
      httpPort,
      httpsPort
    });

    return void 0;
  }

  const watching: Object = compiler.watch({
    aggregateTimeout: 500
  }, milktea.callback);
}

export default argvStart;