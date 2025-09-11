import type { Configuration } from 'webpack';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig } from '../utils/types.js';

/* favicon 图标配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  configRulePush(config, {
    test: /favicon\.ico$/i,
    type: 'asset/resource',
    generator: {
      filename: '[name][ext]',
      emit: !sweetConfig.serverRender
    }
  });
}