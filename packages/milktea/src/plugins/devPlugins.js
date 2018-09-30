/* 开发环境插件 */
import path from 'path';
import webpack from 'webpack';
import { isArray } from '../utils';

export default function(sweetConfig: Object = {}, sweetOptions: Object): Array{
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

    plugins.push(new webpack.DllReferencePlugin({
      context: sweetOptions.basicPath,
      manifest: require(path.join(sweetOptions.basicPath, '.dll/manifest.json'))
    }));
  }

  return plugins;
}