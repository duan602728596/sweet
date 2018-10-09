import * as fs from 'fs';
import * as path from 'path';
import * as Koa from 'koa';
import {
  replaceTemplate, defaultInterfacePath, pathAnalyze, registerConfig, defaultInterfaceJsFilename,
  requireModule
} from './utils';
import { SweetOptions } from './types';

// 渲染新的html
async function preRender(file: string, ctx: Koa.Context, html: Buffer, serverRenderFile: string, sweetOptions: SweetOptions): Promise<string>{
  const formatFile: string = `${ path.join(defaultInterfacePath(sweetOptions), pathAnalyze(file)) }.js`;
  let data: any = {};

  // 读取模块
  if(fs.existsSync(formatFile)){
    // 加载es6+环境
    const register: Function = requireModule('@babel/register');

    register(registerConfig);

    const file: Function = requireModule(formatFile);

    data = await file(ctx, sweetOptions);
  }else if(fs.existsSync(defaultInterfaceJsFilename(sweetOptions))){
    // 读取默认模块
    // 加载es6+环境
    const register: Function = requireModule('@babel/register');
    const p: string = defaultInterfaceJsFilename(sweetOptions);

    register(registerConfig);

    const file: Function = requireModule(p);

    data = await file(ctx, sweetOptions);
  }

  const server: Function = requireModule(serverRenderFile);
  const render: Object = await server(file, ctx, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

export default preRender;