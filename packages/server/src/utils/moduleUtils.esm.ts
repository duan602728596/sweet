import { createRequire } from 'module';

// esm需要创建require
const require: NodeRequire = createRequire(import.meta.url);

/* 模块导入 */
export async function requireModule(id: string): Promise<any> {
  const asyncModule: { default: any } | any = await import(id);
  const module: any = 'default' in asyncModule ? asyncModule['default'] : asyncModule;

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

/* 模块导入并且清除缓存 */
export async function deleteCacheAndRequireModule(id: string): Promise<any> {
  const idAndTime: string = `${ id }?t=${ new Date().getTime() }`;

  return await requireModule(idAndTime);
}