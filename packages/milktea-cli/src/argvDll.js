import process from 'process';
import webpack from 'webpack';

const isDevelopment: Object = process.env.NODE_ENV === 'development';

const milktea: Object = isDevelopment ? require('../../milktea/lib/milktea') : require('@sweet/milktea');

/* dll命令 */
function argvDll(argv: Object): void{
  const compiler: Object = webpack(milktea.dll());
  compiler.run(milktea.callback);
}

export default argvDll;