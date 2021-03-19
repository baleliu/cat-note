import { Button, Drawer, Form, Input } from 'antd';
import React from 'react';
import './style.less';

export default (props: {
  onClose: () => void;
  visible: boolean;
  formRef: any;
  onFinish: () => void;
  onFinishFailed: () => void;
}) => {
  return (
    <Drawer
      width="50%"
      placement="right"
      closable={false}
      onClose={props.onClose}
      visible={props.visible}
    >
      <Form
        ref={props.formRef}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={props.onFinish}
        onFinishFailed={props.onFinishFailed}
      >
        <Form.Item label="id" name="id" hidden />
        <Form.Item
          label="知识库名称"
          name="name"
          rules={[{ required: true, message: '知识库名称必输' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="知识库描述" name="desc">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};
