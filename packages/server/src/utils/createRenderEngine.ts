import ejs from 'ejs';
import { requireModule } from '@sweet-milktea/utils';

async function createNunjucksRender(): Promise<Function> {
  const nunjucks: { [key: string]: any } = await requireModule('nunjucks');

  nunjucks.configure({
    autoescape: false
  });

  return nunjucks.renderString;
}

/* 创建html的渲染器 */
async function createRenderEngine(type: string | undefined): Promise<Function> {
  if (type === 'nunjucks') {
    return await createNunjucksRender();
  } else {
    return ejs.render;
  }

}

export default createRenderEngine;