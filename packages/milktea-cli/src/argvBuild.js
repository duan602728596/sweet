import webpack from 'webpack';

/* build 命令 */
function argvBuild(argv: Object): void{
  const milktea: Object = require('@sweet/milktea').default;
  const compiler: Object = webpack(milktea.config('production'));

  compiler.run(milktea.callback);
}

export default argvBuild;