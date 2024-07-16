import type { Configuration } from 'webpack';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig } from '../utils/types.js';

/* 字体静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  configRulePush(config, {
    test: /^.*\.(eot|ttf|woff2?)$/i,
    type: 'asset/resource',
    generator: {
      emit: !sweetConfig.serverRender
    }
  });
}