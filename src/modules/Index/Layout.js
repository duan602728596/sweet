import Main from '../../assembly/Main/index';
import Content from '../../assembly/Content/index';
import Index from './Index/index';

export default {
  render(): Vue.VNode{
    return (
      <Main>
        <helmet-provider>
          <helmet>
            <title>网站title</title>
          </helmet>
        </helmet-provider>
        <Content>
          <Index />
        </Content>
      </Main>
    );
  }
};