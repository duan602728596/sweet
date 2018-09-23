import webpack from 'webpack';

/* dll 命令 */
function argvDll(argv: Object): void{
  const milktea: Object = require('@sweet/milktea').default;
  const compiler: Object = webpack(milktea.dll());

  compiler.run(milktea.callback);
}

export default argvDll;