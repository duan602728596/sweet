import { reactive } from 'vue';
import { Form, Button, Input } from 'ant-design-vue';
import { UserOutlined as IconUserOutlined, LockOutlined as IconLockOutlined } from '@ant-design/icons-vue';
import routers from '../../router/routers';
import style from './login.sass';

/* 登陆 */
function Login() {
  const form = reactive({
    username: undefined,
    password: undefined
  });

  // 登陆
  function handleLoginSubmit(value) {
    routers.push('/');
  }

  return (
    <div class={ style.loginBox }>
      <Form class={ style.loginForm } model={ form } onFinish={ handleLoginSubmit }>
        <h1 class={ style.title }>系统登陆</h1>
        <Form.Item name="username" rules={ [{ required: true, message: '请输入用户名' }] }>
          <Input v-model={ [form.username, 'value'] } addonBefore={ <IconUserOutlined /> } />
        </Form.Item>
        <Form.Item name="password" rules={ [{ required: true, message: '请输入密码' }] }>
          <Input type="password" v-model={ [form.password, 'value'] } addonBefore={ <IconLockOutlined /> } />
        </Form.Item>
        <div class={ style.btnBox }>
          <Button type="primary" htmlType="submit" size="large" block={ true }>登陆</Button>
        </div>
      </Form>
    </div>
  );
}

export default Login;