/* 判断模块是否存在 */
function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

export default moduleExists;