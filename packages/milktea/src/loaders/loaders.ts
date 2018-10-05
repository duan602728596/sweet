/* loaders */
import jsLoader from './js';
import sassLoader from './sass';
import lessLoader from './less';
import faviconLoader from './favicon';
import fontFileLoader from './fontFile';
import htmlLoader from './html';
import imageLoader from './image';
import svgLoader from './svg';
import vueLoader from './vue';
import { isObject } from '../utils/utils';
import { SweetConfig, SweetOptions, Loaders } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Array<Loaders>{
  /**
   * rules { Array }: 自定义规则
   * loaders { Object }: 覆盖默认规则
   * frame { ?string }: 是否为react或vue模式
   */
  const rules: Array<any> = sweetConfig.rules;
  const frame: string | undefined = sweetConfig.frame;

  const loaders: Loaders = sweetConfig.loaders && isObject(sweetConfig.loaders) ?  sweetConfig.loaders : {};

  // 重写loaders，合并rules
  const loadersObj: Loaders = {
    js: loaders.js || jsLoader(sweetConfig, sweetOptions),
    sass: loaders.sass || sassLoader(sweetConfig),
    css: loaders.css || lessLoader(sweetConfig),
    favicon: loaders.favicon || faviconLoader(),
    fontFile: loaders.fontFile || fontFileLoader(sweetConfig),
    html: loaders.html || htmlLoader(sweetConfig),
    image: loaders.image || imageLoader(sweetConfig),
    svg: loaders.svg || svgLoader(sweetConfig)
  };

  // vue
  if(frame === 'vue'){
    loadersObj.vue = loaders.vue || vueLoader();
  }

  // @ts-ignore
  const loadersArr: [] = Object.values(loadersObj);

  // 添加其他的rules
  if(rules){
    // @ts-ignore
    loadersArr.push(...rules);
  }

  return loadersArr;
}