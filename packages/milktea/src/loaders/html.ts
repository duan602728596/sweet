import type { Configuration } from 'webpack';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig } from '../utils/types.js';

/* html 配置 */
export default function(sweetConfig: SweetConfig, config: Configuration): void {
  const { mode }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  configRulePush(config, {
    test: /^.*\.pug$/i,
    use: [
      {
        loader: 'pug-loader',
        options: {
          pretty: isDevelopment,
          name: '[name].html'
        }
      }
    ]
  });
}