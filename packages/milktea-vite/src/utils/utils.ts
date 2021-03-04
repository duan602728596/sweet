/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* extensions扩展名 */
export const extensions: Array<string> = ['.mjs', '.ts', '.tsx', '.js', '.jsx', 'cjs', '.json', '.vue', '.wasm'];