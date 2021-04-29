import { createRequire } from 'module';

// esm需要创建require
const require: NodeRequire = createRequire(import.meta.url);

/* 模块导入 */
export async function requireModule(id: string): Promise<any> {
  const module: { default: any } | any = await import(id);
  const dModule: any = 'default' in module ? module['default'] : module;

  return 'default' in dModule ? dModule.default : dModule;
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
  const idAndTime: string = `${ id }?${ new Date().getTime() }`;

  return await requireModule(idAndTime);
}