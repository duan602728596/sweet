import type { Configuration } from 'webpack';
import jsLoader from './javascript.js';
import tsLoader from './typescript.js';
import sassLoader from './sass.js';
import lessLoader from './less.js';
import faviconLoader from './favicon.js';
import fontFileLoader from './fontFile.js';
import htmlLoader from './html.js';
import imageLoader from './image.js';
import svgLoader from './svg.js';
import { configRulePush } from '../utils/utils.js';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/**
 * 添加loaders
 * @param { SweetConfig } sweetConfig - 获取到的外部配置
 * @param { SweetOptions } sweetOptions - 内部挂载的一些配置
 * @param { Configuration } config - webpack config
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration): Promise<void> {
  const { frame, mode }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // javascript
  await jsLoader(sweetConfig, sweetOptions, config);

  // typescript
  tsLoader(sweetConfig, sweetOptions, config);

  // sass
  sassLoader(sweetConfig, config);

  // css
  lessLoader(sweetConfig, config);

  // favicon
  faviconLoader(sweetConfig, config);

  // fontFile
  fontFileLoader(sweetConfig, config);

  // html
  htmlLoader(sweetConfig, config);

  // svg
  svgLoader(sweetConfig, config);

  // image
  imageLoader(sweetConfig, config);

  // vue
  if (frame === 'vue') {
    configRulePush(config, {
      test: /^.*\.vue$/i,
      use: 'vue-loader'
    });
  }

  // 加载dll文件
  configRulePush(config, {
    test: /\.sweet[\\/]dll[\\/]dll\.js/i,
    type: 'asset/resource',
    generator: {
      filename: isDevelopment ? '__[name]_[hash:5]__[ext]' : '__[hash:15]__[ext]',
      emit: !sweetConfig.serverRender
    }
  });
}