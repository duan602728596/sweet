import Vue from 'vue';
import Component from 'vue-class-component';
import { Button } from 'ant-design-vue';

@Component
class Index extends Vue {
  // 点击事件
  handleAddState(event) {
    this.$store.dispatch('index/add');
  }

  render() {
    return (
      <div>
        <div>Index</div>
        <div>{ this.$store.getters['index/getCount']() }</div>
        <Button type="primary" onClick={ this.handleAddState }>添加</Button>
      </div>
    );
  }
}

export default Index;