import * as fs from 'fs';

/* 模块导入 */
export async function requireModule(id: string): Promise<any> {
  const module: { default: any } | any = await import(id);

  return 'default' in module ? module.default : module;
}

/* 加载json */
export async function requireJson(id: string): Promise<any> {
  const data: string = await fs.promises.readFile(id, {
    encoding: 'utf8'
  });

  return JSON.parse(data);
}