import Vue from 'vue';
import Component from 'vue-class-component';

@Component
class Index extends Vue {
  render() {
    const { current } = this.$router.history;
    const { path: pathname } = current;

    return (
      <div>
        <p>这是一个二级页。</p>
        <p>
          路由：
          { pathname }
        </p>
      </div>
    );
  }
}

export default Index;