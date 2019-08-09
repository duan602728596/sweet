import React, { Component } from 'react';
import { Form, Input, Radio, Button } from 'antd';
import style from './style.sass';

@Form.create()
class Index extends Component {
  handleSubmit(event) {
    event.preventDefault();

    const { validateFields, getFieldsValue } = this.props.form;

    validateFields((err, value) => {
      if (!err) {
        console.log(getFieldsValue());
        alert('提交成功！');
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form; // 包装表单控件

    return (
      <Form onSubmit={ this.handleSubmit.bind(this) } layout="horizontal">
        <img src={ require('./image.jpg') } />
        <Form.Item className={ style.formGroup } label="姓名">
          {
            getFieldDecorator('name', {
              rules: [
                {
                  message: '请输入姓名',
                  required: true,
                  whitespace: true
                }
              ]
            })(<Input />)
          }
        </Form.Item>
        <Form.Item className={ style.formGroup } label="姓别">
          {
            getFieldDecorator('sex', {
              initialValue: 'man'
            })(
              <Radio.Group>
                <Radio value="man">男</Radio>
                <Radio value="woman">女</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
        <Form.Item className={ style.formGroup }>
          <Button type="primary" htmlType="submit" icon="check-circle-o">提交</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Index;