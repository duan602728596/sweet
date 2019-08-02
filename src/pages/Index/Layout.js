import Vue from 'vue';
import Component from 'vue-class-component';
import Main from '../../layouts/Main/index';
import Content from '../../layouts/Content/index';
import Index from './Index/index';

@Component({
  metaInfo: {
    title: '网站title'
  }
})
class ModuleLayout extends Vue {
  render() {
    return (
      <Main>
        <Content>
          <Index />
        </Content>
      </Main>
    );
  }
}

export default ModuleLayout;