import fs from 'fs';
import path from 'path';
import { replaceTemplate, defaultInterfacePath, pathAnalyze, registerConfig, defaultInterfaceJsFilename } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, html: ArrayBuffer, serverRenderFile: string, sweetOptions: Object): Promise<Object>{
  const formatFile: string = `${ path.join(defaultInterfacePath(sweetOptions), pathAnalyze(file)) }.js`;
  let data: Object = {};

  // 读取模块
  if(fs.existsSync(formatFile)){
    // 加载es6+环境
    const register: Function = require('@babel/register');

    register(registerConfig);

    const file: Object | Function = require(formatFile);

    if('default' in file) data = await file.default(ctx, sweetOptions);
    else data = await file(ctx, sweetOptions);
  }else if(fs.existsSync(defaultInterfaceJsFilename(sweetOptions))){
    // 读取默认模块
    // 加载es6+环境
    const register: Function = require('@babel/register');

    register(registerConfig);

    const file: Object | Function = require(defaultInterfaceJsFilename(sweetOptions));

    if('default' in file) data = await file.default(ctx, sweetOptions);
    else data = await file(ctx, sweetOptions);
  }

  const server: Function = require(serverRenderFile).default;
  const render: Object = await server(file, ctx, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

module.exports = preRender;