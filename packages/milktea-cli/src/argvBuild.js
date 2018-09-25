import webpack from 'webpack';
import { isNone } from './utils';

/* build 命令 */
function argvBuild(argv: Object): void{
  const milktea: Object = require('@sweet/milktea').default;
  const compiler: Object = webpack(milktea.config(null, 'production'));

  compiler.run(milktea.callback);

  if(!isNone(argv.serverRender)){
    const serverRenderCompiler: Object = webpack(milktea.serverRenderConfig(null, 'production'));

    serverRenderCompiler.run(milktea.callback);
  }
}

export default argvBuild;