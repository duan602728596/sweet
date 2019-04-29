import * as ejs from 'ejs';
import * as nunjucks from 'nunjucks';

nunjucks.configure({
  autoescape: false
});

const renderMap: {
  ejs: Function;
  nunjucks: Function;
} = {
  ejs: ejs.render,
  nunjucks: nunjucks.renderString
};

/* 创建html的渲染器 */
function createRenderEngine(type: string | undefined): Function {
  if (type) {
    return renderMap[type] || renderMap.ejs;
  } else {
    return renderMap.ejs;
  }

}

export default createRenderEngine;