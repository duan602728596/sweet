/* 开发环境插件 */
import path from 'path';
import process from 'process';
import webpack from 'webpack';

export default function(sweetConfig: Object = {}): Array{
  /**
   * dll { Array } dll配置
   */
  const { dll }: { dll: Array } = sweetConfig;
  const plugins: [] = [];

  if(dll){
    const cwd: string = process.cwd();

    plugins.push(new webpack.DllReferencePlugin({
      context: cwd,
      manifest: require(path.join(cwd, '.dll/manifest.json'))
    }));
  }

  return plugins;
}