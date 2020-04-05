import Main from '../../layouts/Main/index';
import Content from '../../layouts/Content/index';
import Index from './Welcome';

export default {
  metaInfo: {
    title: 'Webpack App'
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