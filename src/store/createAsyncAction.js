/**
 * 创建异步的action
 * @param { Function } func: 异步的函数
 */
function createAsyncAction(func) {
  return function(...args) {
    return async function(dispatch, getState) {
      // 封装常用的函数
      const _ = {
        // 执行函数
        async call(fn, ...args) {
          try {
            const [context, runFn] = Array.isArray(fn) ? fn : [undefined, fn];
            const value = await runFn.call(context, ...args);

            return value;
          } catch (err) {
            console.error(err);
          }
        },

        // 执行函数
        async apply(fn, args) {
          try {
            const [context, runFn] = Array.isArray(fn) ? fn : [undefined, fn];
            const value = await runFn.apply(context, args);

            return value;
          } catch (err) {
            console.error(err);
          }
        },

        // 执行action
        async put(action) {
          const value = await dispatch(action);

          return value;
        },

        // 获取值
        select() {
          return getState();
        },

        // 延迟执行
        delay(time, value) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve(value);
            }, time);
          });
        }
      };

      const result = await func.call(undefined, _, ...args);

      return result;
    };
  };
}

export default createAsyncAction;