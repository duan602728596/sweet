import Vue from 'vue';
import Component from 'vue-class-component';
import Index from './Index/index';

@Component({
  metaInfo: {
    title: 'Webpack App - login'
  }
})
class ModuleLayout extends Vue {
  render() {
    return (
      <Index />
    );
  }
}

export default ModuleLayout;