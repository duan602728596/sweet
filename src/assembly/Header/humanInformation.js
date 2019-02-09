// @flow
// // @jsx this.$createElement
import Vue from 'vue';
import classNames from 'classnames';
import style from './style.sass';
import icon from '../Icon/style.sass';

/* 登录人信息 */
export default {
  name: 'HumanInformation',
  data(): Object{
    return {
      icon
    };
  },
  render(h: Function): Vue.VNode{
    return (
      <div class={ style.humanInformation}>
        <i class={ classNames(icon.userTie, style.human) } />
        <span class={ style.username }>用户名</span>
        <button class={ style.tools } type="button" title="退出系统">
          <i class={ icon.exit } />
        </button>
      </div>
    );
  }
};