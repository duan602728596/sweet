import type { Configuration } from 'webpack';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig } from '../utils/types.js';

/* svg文件配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  const { frame }: SweetConfig = sweetConfig;
  const svgIssuer: RegExp = /^.*\.(jsx?|tsx?|vue)$/i;

  // react
  if (frame === 'react') {
    configRulePush(config, {
      test: /component\.svgz?$/i,
      use: [
        {
          loader: '@svgr/webpack'
        }
      ],
      issuer: svgIssuer
    });
  }

  // vue
  if (frame === 'vue') {
    configRulePush(config, {
      test: /component\.svgz?$/i,
      use: [
        {
          loader: 'vue-loader'
        },
        {
          loader: 'vue-svg-loader'
        }
      ],
      issuer: svgIssuer
    });
  }
}