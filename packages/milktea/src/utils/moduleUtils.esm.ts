import * as path from 'path';
import * as fs from 'fs';
import { createRequire } from 'module';

// esm需要创建require
const require: NodeRequire = createRequire(import.meta.url);

/* 模块导入 */
export async function requireModule(id: string): Promise<any> {
  const module: { default: any } | any = await import(id);

  return 'default' in module ? module.default : module;
}

/* 判断模块是否存在 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

/* 加载插件 */
export function requirePlugins(id: string): Promise<any> {
  return requireModule(path.join(
    path.dirname(import.meta.url.replace(/^file:\/{2}/, '')),
    '../plugins',
    id)
  );
}

/* 加载json */
export async function requireJson(id: string): Promise<any> {
  const data: string = await fs.promises.readFile(id, {
    encoding: 'utf8'
  });

  return JSON.parse(data);
}