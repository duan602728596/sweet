import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { useDispatch } from 'react-redux';

/**
 * react-redux hooks创建action函数
 */
function useActions(actions, deps) {
  const dispatch = useDispatch();

  return useMemo(() => {
    if (typeof actions === 'function') {
      return actions(dispatch);
    }

    if (Array.isArray(actions)) {
      return actions.map((action) => bindActionCreators(action, dispatch));
    }

    return bindActionCreators(actions, dispatch);
  }, deps ? [dispatch, ...deps] : deps);
}

export default useActions;