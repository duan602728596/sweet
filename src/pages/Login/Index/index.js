import React from 'react';
import { useHistory } from 'react-router';
import { Form, Button, Input } from 'antd';
import { UserOutlined as IconUserOutlined, LockOutlined as IconLockOutlined } from '@ant-design/icons';
import style from './index.sass';

/* 登陆 */
function Index(props) {
  const history = useHistory();
  const [form] = Form.useForm();
  const { validateFields, scrollToField } = form;

  // 登陆
  async function handleLoginSubmit(event) {
    try {
      const value = await validateFields();

      history.push('/');
    } catch (err) {
      console.error(err);
      scrollToField(err.errorFields[0].name[0]);
    }
  }

  return (
    <div className={ style.loginBox }>
      <Form className={ style.loginForm } form={ form }>
        <h1 className={ style.title }>系统登陆</h1>
        <Form.Item name="username" rules={ [{ required: true, message: '请输入用户名', whitespace: true }] }>
          <Input addonBefore={ <IconUserOutlined /> } onPressEnter={ handleLoginSubmit } />
        </Form.Item>
        <Form.Item name="password" rules={ [{ required: true, message: '请输入密码' }] }>
          <Input.Password addonBefore={ <IconLockOutlined /> } onPressEnter={ handleLoginSubmit } />
        </Form.Item>
        <div className={ style.btnBox }>
          <Button type="primary" size="large" block={ true } onClick={ handleLoginSubmit }>登陆</Button>
        </div>
      </Form>
    </div>
  );
}

export default Index;