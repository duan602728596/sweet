/* 开发环境插件 */
import path from 'path';
import process from 'process';
import webpack from 'webpack';
import { isArray } from '../utils';

export default function(sweetConfig: Object = {}): Array{
  /**
   * dll { Array }: dll配置
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { dll, serverRender }: {
    dll: Array,
    serverRender: boolean
  } = sweetConfig;
  const plugins: [] = [];

  if(dll && isArray(dll) && dll.length > 0 && !serverRender){
    const cwd: string = process.cwd();

    plugins.push(new webpack.DllReferencePlugin({
      context: cwd,
      manifest: require(path.join(cwd, '.dll/manifest.json'))
    }));
  }

  return plugins;
}