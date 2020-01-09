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
        injectReducers: PropTypes.func,
        injectSagas: PropTypes.func
      };

      constructor() {
        super(...arguments);

        // 异步注入reducer
        const injectReducers = this?.props?.injectReducers || undefined;
        const key = models.namespace;

        if (injectReducers && models.reducer) {
          injectReducers({
            [key]: models.reducer
          });
        }

        // 异步注入saga
        const injectSagas = this?.props?.injectSagas || undefined;

        if (injectSagas && models.effects) {
          injectSagas({
            [key]: models.effects
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