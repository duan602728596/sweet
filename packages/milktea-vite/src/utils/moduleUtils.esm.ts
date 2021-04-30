/* 模块导入 */
export async function requireModule(id: string): Promise<any> {
  const module: { default: any } | any = await import(id);

  return 'default' in module ? module.default : module;
}