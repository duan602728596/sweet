import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * 异步注入reducer的修饰器
 * @param { object } models
 */
function loadReducer(models) {
  /**
   * @param { Function } Module: 需要修饰的模块
   */
  return function(Module) {
    return class extends Component {
      static propTypes = {
        injectReducers: PropTypes.func
      };

      constructor() {
        super(...arguments);

        // 异步注入reducer
        const injectReducers = this?.props?.injectReducers || undefined;
        const namespace = models.namespace;

        if (injectReducers && models.reducer) {
          injectReducers({
            [namespace]: models.reducer
          });
        }
      }

      render() {
        return <Module />;
      }
    };
  };
}

export default loadReducer;