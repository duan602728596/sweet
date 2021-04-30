import * as fs from 'fs';

/* 判断文件是否存在 */
export async function isExists(file: string): Promise<boolean> {
  try {
    await fs.promises.access(file);

    return true;
  } catch (err) {
    return false;
  }
}

/* extensions扩展名 */
export const extensions: Array<string> = ['.mjs', '.ts', '.tsx', '.js', '.jsx', 'cjs', '.json', '.vue', '.wasm'];

export { requireModule } from './moduleUtils';