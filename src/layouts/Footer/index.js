import Vue from 'vue';
import Component from 'vue-class-component';
import { Layout } from 'ant-design-vue';
import style from './index.sass';

@Component
class Footer extends Vue {
  render() {
    return (
      <Layout.Footer class={ style.footer }>
        Copy Right
      </Layout.Footer>
    );
  }
}

export default Footer;