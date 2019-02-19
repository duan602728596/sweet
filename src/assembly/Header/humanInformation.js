// @flow
// @jsx this.$createElement
import Vue from 'vue';
import Component from 'vue-class-component';
import { Icon } from 'ant-design-vue';
import style from './style.sass';

/* 登录人信息 */
@Component
class HumanInformation extends Vue {
  render(h: Function): Vue.VNode {
    return (
      <div class={ style.humanInformation}>
        <Icon class={ style.human } type="user" theme="outlined" />
        <span class={ style.username }>用户名</span>
        <button class={ style.tools } type="button" title="退出系统">
          <Icon type="export" theme="outlined" />
        </button>
      </div>
    );
  }
}

export default HumanInformation;