import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Button, Input } from 'ant-design-vue';
import { UserOutlined as IconUserOutlined, LockOutlined as IconLockOutlined } from '@ant-design/icons-vue';
import style from './login.sass';

/* 登陆 */
export default defineComponent({
  setup() {
    const router = useRouter();
    const form = reactive({
      username: undefined,
      password: undefined
    });

    // 登陆
    function handleLoginSubmit(value) {
      router.push('/');
    }

    return {
      form,
      handleLoginSubmit
    };
  },

  render(a) {
    const { form, handleLoginSubmit } = a;

    return (
      <div class={ style.loginBox }>
        <Form class={ style.loginForm } model={ form } onFinish={ handleLoginSubmit }>
          <h1 class={ style.title }>系统登陆</h1>
          <Form.Item class={ style.formInput } name="username" rules={ [{ required: true, message: '请输入用户名' }] }>
            <Input v-model={ [form.username, 'modelValue'] } addonBefore={ <IconUserOutlined /> } />
          </Form.Item>
          <Form.Item class={ style.formInput } name="password" rules={ [{ required: true, message: '请输入密码' }] }>
            <Input type="password" v-model={ [form.password, 'modelValue'] } addonBefore={ <IconLockOutlined /> } />
          </Form.Item>
          <div class={ style.btnBox }>
            <Button type="primary" htmlType="submit" size="large" block={ true }>登陆</Button>
          </div>
        </Form>
      </div>
    );
  }
});