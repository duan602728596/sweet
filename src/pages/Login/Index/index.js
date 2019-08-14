import React from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Button, Input, Icon } from 'antd';
import style from './index.sass';

/* 登陆 */
function Index(props) {
  const { form, history } = props;
  const { getFieldDecorator, validateFields } = form;

  // 登陆
  function handleLoginSubmit(event) {
    event.preventDefault();

    validateFields((err, value) => {
      if (err) return;

      history.push('/');
    });
  }

  return (
    <div className={ style.loginBox }>
      <Form className={ style.loginForm } onSubmit={ handleLoginSubmit }>
        <h1 className={ style.title }>系统登陆</h1>
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
            })(<Input.Password addonBefore={ <Icon type="lock" /> } />)
          }
        </Form.Item>
        <div>
          <Button type="primary" htmlType="submit" size="large" block={ true }>登陆</Button>
        </div>
      </Form>
    </div>
  );
}

export default withRouter(Form.create()(Index));