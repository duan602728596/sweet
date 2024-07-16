import type { Configuration } from 'webpack';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig } from '../utils/types.js';

/* 图片静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  configRulePush(config, {
    test: /^.*\.(jpe?g|png|gif|webp|avifs?|avis)|(?<!component)\.svgz?$/i,
    type: 'asset',
    generator: {
      emit: !sweetConfig.serverRender
    },
    parser: {
      dataUrlCondition: {
        maxSize: 8192
      }
    }
  });
}