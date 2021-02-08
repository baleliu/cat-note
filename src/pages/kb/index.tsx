import { Button, Drawer, Form, Input, Table, Space } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useRef, useState } from 'react';
import { connect, ConnectProps, KbModelState } from 'umi';
interface PageProps extends ConnectProps {
  kbModel: KbModelState;
}

const IndexPage: FC<PageProps> = ({ kbModel, dispatch }) => {
  const columns = [
    {
      title: '知识库名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '知识库描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              dispatch &&
                dispatch({ type: 'kbModel/_deleteOne', payload: record.id });
            }}
          >
            删除
          </a>
        </Space>
      ),
    },
  ];

  const [visible, setVisible] = useState(false);
  const formRef: any = useRef<FormInstance>();
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Success:', values);
    dispatch &&
      dispatch({
        type: 'kbModel/_createOne',
        payload: values,
      });
    formRef.current.resetFields(['name', 'desc']);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <div>
        <Button
          onClick={() => {
            showDrawer();
          }}
        >
          创建知识库
        </Button>
        <Drawer
          width="50%"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <Form
            ref={formRef}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
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
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </div>
      <Table
        columns={columns}
        rowKey="id"
        dataSource={kbModel.data}
        pagination={false}
      />
    </>
  );
};

export default connect(({ kbModel }: { kbModel: KbModelState }) => ({
  kbModel,
}))(IndexPage);
