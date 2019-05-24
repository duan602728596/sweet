import Main from '../../layouts/Main/index';
import Content from '../../layouts/Content/index';
import Index from './Index/index';

export default {
  render() {
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