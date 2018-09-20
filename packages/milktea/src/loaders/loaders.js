/* loaders */
import jsLoader from './js';
import cssLoader from './css';
import faviconLoader from './favicon';
import fontFileLoader from './fontFile';
import htmlLoader from './html';
import imageLoader from './image';
import svgLoader from './svg';

export default function(sweetConfig: Object = {}): Object{
  const { rules, loaders }: {
    rules: Array,
    loaders: Object
  } = sweetConfig;

  // 合并rules
  const loadersObj: Object = {
    js: loaders.js || jsLoader(sweetConfig),
    css: loaders.css || cssLoader(sweetConfig),
    favicon: loaders.favicon || faviconLoader(),
    fontFile: loaders.fontFile || fontFileLoader(sweetConfig),
    html: loaders.html || htmlLoader(sweetConfig),
    image: loaders.image || imageLoader(sweetConfig),
    svg: loaders.svg || svgLoader(sweetConfig)
  };
  const loadersArr: [] = Object.values(loadersObj);

  // 添加其他的rules
  if(rules){
    loadersArr.push(...rules);
  }

  return loadersArr;
}