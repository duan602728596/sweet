import * as fs from 'fs';
import * as _ from 'lodash';
import * as Koa from 'koa';
import * as connect from 'koa-connect';
import * as proxy from 'http-proxy-middleware';
import { defaultProxyPath, requireModule } from './utils';
import { SweetOptions } from './types';

interface ProxyItemConfig {
  target: string;
  changeOrigin?: boolean;
  pathRewrite?: { [key: string]: string };
}

type ProxyConfig = { [key: string]: ProxyItemConfig };

/* 添加代理中间件 */
function addMiddleware(app: Koa, proxyConfig: ProxyConfig, isDevelopment: boolean): void {
  const logLevel: string = isDevelopment ? 'info' : 'error';

  for (const key in proxyConfig) {
    const config: ProxyItemConfig = proxyConfig[key];

    app.use(connect(proxy(key, {
      target: config.target,
      changeOrigin: _.isBoolean(config.changeOrigin) ? config.changeOrigin : true,
      pathRewrite: config.pathRewrite,
      logLevel
    })));
  }
}

/* 本地代理，本地代理无法清除缓存 */
async function createProxy(sweetOptions: SweetOptions, app: Koa, isDevelopment: boolean): Promise<void> {
  const defaultProxy: { js: string; json: string } = defaultProxyPath(sweetOptions.basicPath);

  if (fs.existsSync(defaultProxy.js)) {
    const module: any = requireModule(defaultProxy.js);

    if (_.isPlainObject(module)) {
      addMiddleware(app, module, isDevelopment);
    } else if (_.isFunction(module)) {
      const proxyConfig: ProxyConfig = await module(sweetOptions, app);

      addMiddleware(app, proxyConfig, isDevelopment);
    }
  } else if (fs.existsSync(defaultProxy.json)) {
    const module: ProxyConfig = requireModule(defaultProxy.json);

    addMiddleware(app, module, isDevelopment);
  }
}

export default createProxy;