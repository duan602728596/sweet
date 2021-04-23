import { createRequire } from 'module';

// esm需要创建require
const require: NodeRequire = createRequire(import.meta.url);

/* 判断模块是否存在 */
function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

export default moduleExists;