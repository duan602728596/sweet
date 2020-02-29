import * as ejs from 'ejs';
import { requireModule } from './utils';

function createNunjucksRender(): Function {
  const nunjucks: { [key: string]: any } = requireModule('nunjucks');

  nunjucks.configure({
    autoescape: false
  });

  return nunjucks.renderString;
}

/* 创建html的渲染器 */
function createRenderEngine(type: string | undefined): Function {
  if (type === 'nunjucks') {
    return createNunjucksRender();
  } else {
    return ejs.render;
  }

}

export default createRenderEngine;