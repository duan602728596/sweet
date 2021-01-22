import { computed } from 'vue';
import { useHead } from '@vueuse/head';
import Main from '../../layouts/Main/index';
import Content from '../../layouts/Content/index';
import Index from './Welcome';

export default {
  setup() {
    useHead({
      title: computed(() => 'Webpack App')
    });
  },

  render() {
    return (
      <Main>
        <Content>
          <Index />
        </Content>
      </Main>
    );
  }
};