// @flow
// @jsx this.$createElement
import Vue from 'vue';
import Component from 'vue-class-component';
import style from './style.sass';

/**
 * layout - Content
 * 页面内容
 * 组件用于展示页面的内容
 * 默认padding为10px
 */
@Component
class Content extends Vue {
  render(): Vue.VNode {
    return (
      <i-content class={ style.content }>
        { this.$slots.default }
      </i-content>
    );
  }
}

export default Content;