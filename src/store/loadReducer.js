/**
 * 异步注入reducer的修饰器
 */
import * as React from 'react';
import { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Requireable } from 'prop-types';

interface LoadReducerProps {
  injectReducers?: Function;
}

/**
 * @param { object } reducer
 */
function loadReducer(reducer: object): Function {
  /**
   * @param { Function } Module: 需要修饰的模块
   */
  return function(Module: Function): Function {
    return class extends Component<LoadReducerProps> {
      static propTypes: {
        injectReducers: Requireable<(...args: any[]) => any>
      } = {
        injectReducers: PropTypes.func
      };

      constructor() {
        super(...arguments);

        // 异步注入reducer
        const injectReducers: Function | null = this?.props?.injectReducers || null;

        if (injectReducers) {
          injectReducers(reducer);
        }
      }

      render(): React.ReactNode {
        return <Module />;
      }
    };
  };
}

export default loadReducer;