// @flow
// @jsx this.$createElement
import Vue from 'vue';
import Arrangement from './assembly/Arrangement/index';

export default {
  name: 'App',
  render(): Vue.VNode {
    return (
      <div class="app" id="app">
        <Arrangement />
      </div>
    );
  }
};