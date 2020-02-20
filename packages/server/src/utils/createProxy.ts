import * as fs from 'fs';
import * as _ from 'lodash';
import * as Koa from 'koa';
import * as connect from 'koa-connect';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { defaultProxyPath, requireModule } from './utils';
import { SweetOptions, LogLevel } from './types';

type ProxyConfig = { [key: string]: object };

/* 添加代理中间件 */
function addMiddleware(app: Koa, proxyConfig: ProxyConfig, isDevelopment: boolean, env?: string): void {
  const logLevel: LogLevel | undefined = env === 'test' ? 'error' : (isDevelopment ? 'info' : 'error');

  for (const key in proxyConfig) {
    const config: object = proxyConfig[key];

    app.use(connect(
      createProxyMiddleware(key, {
        changeOrigin: true,
        logLevel,
        ...config
      })
    ));
  }
}

/**
 * 本地代理
 * TODO: 本地代理无法清除缓存
 */
async function createProxy(sweetOptions: SweetOptions, app: Koa, isDevelopment: boolean, env?: string): Promise<void> {
  try {
    const defaultProxy: { js: string; json: string } = defaultProxyPath(sweetOptions.basicPath);

    if (sweetOptions.proxyFile && fs.existsSync(sweetOptions.proxyFile)) {
      const module: any = requireModule(sweetOptions.proxyFile);

      if (_.isPlainObject(module)) {
        await addMiddleware(app, module, isDevelopment, env);
      } else if (typeof module === 'function') {
        const proxyConfig: ProxyConfig = await module(sweetOptions, app);

        await addMiddleware(app, proxyConfig, isDevelopment, env);
      }
    } else if (fs.existsSync(defaultProxy.js)) {
      const module: any = requireModule(defaultProxy.js);

      if (_.isPlainObject(module)) {
        await addMiddleware(app, module, isDevelopment, env);
      } else if (typeof module === 'function') {
        const proxyConfig: ProxyConfig = await module(sweetOptions, app);

        await addMiddleware(app, proxyConfig, isDevelopment, env);
      }
    } else if (fs.existsSync(defaultProxy.json)) {
      const module: ProxyConfig = requireModule(defaultProxy.json);

      await addMiddleware(app, module, isDevelopment, env);
    }
  } catch (err) {
    console.error(err);
  }
}

export default createProxy;