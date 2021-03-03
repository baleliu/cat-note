import { Button, Drawer, Form, Input, Table, Space, Modal } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useRef, useState } from 'react';
import { connect, ConnectProps, KbModelState, GlobalModelState } from 'umi';
import './style.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;
const { Search } = Input;

interface PageProps extends ConnectProps {
  kbModel: KbModelState;
}

const IndexPage: FC<PageProps> = ({ kbModel, dispatch }) => {
  const columns = [
    {
      title: '库名称',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: '库描述',
      dataIndex: 'desc',
      key: 'desc',
      width: '50%',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <a
            onClick={() => {
              confirm({
                okText: '删除',
                cancelText: '取消',
                title: `是否删除知识库【${record.name}】`,
                icon: <ExclamationCircleOutlined />,
                // content: 'Some descriptions',
                onOk() {
                  if (dustbin) {
                    dispatch &&
                      dispatch({
                        type: 'kbModel/_deleteDustbinOne',
                        payload: record.id,
                      });
                  } else {
                    dispatch &&
                      dispatch({
                        type: 'kbModel/_deleteOne',
                        payload: record.id,
                      });
                  }
                },
              });
            }}
          >
            删除
          </a>
          {dustbin && (
            <a
              onClick={() => {
                confirm({
                  okText: '还原',
                  cancelText: '取消',
                  title: `是否还原知识库【${record.name}】`,
                  icon: <ExclamationCircleOutlined />,
                  onOk() {
                    if (dispatch) {
                      dispatch({
                        type: 'kbModel/_createOne',
                        payload: record,
                      });
                      dispatch({
                        type: 'kbModel/_deleteDustbinOne',
                        payload: record.id,
                      });
                    }
                  },
                });
              }}
            >
              还原
            </a>
          )}
        </Space>
      ),
    },
  ];

  const [visible, setVisible] = useState(false);
  const [dustbin, setDustbin] = useState(false);
  const formRef: any = useRef<FormInstance>();

  const toggleDustbin = () => {
    setDustbin(!dustbin);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
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
        <div
          style={{
            float: 'right',
            position: 'fixed',
            height: '30px',
            top: '40px',
            right: '-87px',
            width: '300px',
            zIndex: 999,
            backgroundColor: 'gray',
            textAlign: 'center',
            color: 'white',
            transform: 'rotate(45deg)',
            lineHeight: '26px',
          }}
          onClick={() => {
            toggleDustbin();
          }}
        >
          {dustbin ? '返回知识库' : '查看垃圾箱'}
        </div>
        <div
          style={{
            float: 'right',
            position: 'fixed',
            height: '30px',
            top: '20px',
            right: '-60px',
            width: '200px',
            zIndex: 999,
            backgroundColor: dustbin ? 'red' : 'green',
            textAlign: 'center',
            color: 'white',
            transform: 'rotate(45deg)',
            lineHeight: '26px',
          }}
          onClick={() => {
            if (dustbin) {
              confirm({
                okText: '删除',
                cancelText: '取消',
                title: `是否清空【知识库】垃圾箱`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                  dispatch &&
                    dispatch({
                      type: 'kbModel/clearDustbin',
                    });
                },
              });
            } else {
              showDrawer();
            }
          }}
        >
          {dustbin ? '清空' : '创建知识库'}
        </div>
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
        <div>
          <Search
            placeholder="根据【名称】查询库"
            style={{
              width: '30%',
              float: 'right',
              marginTop: '5px',
              marginRight: '150px',
              marginBottom: '5px',
            }}
            onSearch={(e) => {
              console.log('todo '+ e);
            }}
            enterButton
          />
        </div>
        <Table
          className="kb-table"
          scroll={{ y: 'calc(100vh - 132px)' }}
          style={{
            border: '1px solid gray',
            marginTop: '40px',
            marginLeft: '5px',
            marginRight: '20px',
            minHeight: 'calc(100vh - 65px)',
          }}
          columns={columns}
          rowKey="id"
          dataSource={dustbin ? kbModel.dustbin : kbModel.data}
          pagination={false}
        />
      </div>
    </>
  );
};

export default connect(
  ({
    kbModel,
    globalModel,
  }: {
    kbModel: KbModelState;
    globalModel: GlobalModelState;
  }) => ({
    kbModel,
    globalModel,
  }),
)(IndexPage);
