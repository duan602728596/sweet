// @flow
// @jsx this.$createElement
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
class Index extends Vue {
  handleAddState(event: Event): void {
    this.$store.dispatch('index/add');
  }
  render(): Vue.VNode {
    return (
      <div>
        <div>Index</div>
        <div>{ this.$store.getters['index/getCount']() }</div>
        <button type="button" onClick={ this.handleAddState }>添加</button>
      </div>
    );
  }
}

export default Index;