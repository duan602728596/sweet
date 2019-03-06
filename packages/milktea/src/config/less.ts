/* less-loader 配置 */
import { isObject } from '../utils/utils';
import { LoaderOption } from '../utils/types';

interface LessOption {
  isDevelopment?: boolean;
  modifyVars?: object;
}

export default function(options: LessOption = {}): LoaderOption {
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * modifyVars { object }:  注入less变量
   */
  const { isDevelopment }: LessOption = options;
  const modifyVars: object = options.modifyVars && isObject(options.modifyVars) ? options.modifyVars : {};

  return {
    loader: 'less-loader',
    options: {
      javascriptEnabled: true,
      modifyVars,
      sourceMap: isDevelopment
    }
  };
}