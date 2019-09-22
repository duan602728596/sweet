import Vue from 'vue';
import Component from 'vue-class-component';
import { Form, Button, Input, Icon } from 'ant-design-vue';
import style from './index.sass';

@Form.create()
@Component({
  props: {
    form: Object
  }
})
class Index extends Vue {
  handleLoginSubmit(event) {
    event.preventDefault();

    const { history } = this.$router;
    const { validateFields } = this.$props.form;

    validateFields((err, value) => {
      if (err) return;

      history.push('/');
    });
  }

  render() {
    const { getFieldDecorator } = this.$props.form;

    return (
      <div class={ style.loginBox }>
        <Form class={ style.loginForm } onSubmit={ this.handleLoginSubmit }>
          <h1 class={ style.title }>系统登陆</h1>
          <Form.Item>
            {
              getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名',
                    whitespace: true
                  }
                ]
              })(<Input addonBefore={ <Icon type="user" /> } />)
            }
          </Form.Item>
          <Form.Item>
            {
              getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入密码'
                  }
                ]
              })(<Input type="password" addonBefore={ <Icon type="lock" /> } />)
            }
          </Form.Item>
          <div class={ style.btnBox }>
            <Button type="primary" htmlType="submit" size="large" block={ true }>登陆</Button>
          </div>
        </Form>
      </div>
    );
  }
}

export default Index;