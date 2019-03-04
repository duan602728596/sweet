import Vue from 'vue';
import Main from '../../assembly/Main/index';
import Content from '../../assembly/Content/index';
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