import AddKb from '@/components/Icons/AddKb';
import BkFromDustbin from '@/components/Icons/BkFromDustbin';
import ClearDustbin from '@/components/Icons/ClearDustbin';
import DelToDustbin from '@/components/Icons/DelToDustbin';
import Dustbin from '@/components/Icons/Dustbin';
import ReturnToKb from '@/components/Icons/ReturnToKb';
import { history } from 'umi';
import {
  EllipsisOutlined,
  ExclamationCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Drawer, Form, Input, Modal, Row } from 'antd';
import { FormInstance } from 'antd/lib/form';
import React, { FC, useEffect, useRef, useState } from 'react';
import { connect, ConnectProps, GlobalModelState, KbModelState } from 'umi';
import './style.less';

const { confirm } = Modal;
const { Meta } = Card;
const { Search } = Input;

interface PageProps extends ConnectProps {
  kbModel: KbModelState;
}

const IndexPage: FC<PageProps> = ({ kbModel, dispatch }) => {
  const [cardSize, setCardSize] = useState<number>(4);
  const [visible, setVisible] = useState(false);
  const [dustbin, setDustbin] = useState(false);
  const formRef: any = useRef<FormInstance>();
  const resize = () => {
    const kbDataContainerElement = document.getElementById('kb-data-container');
    if (kbDataContainerElement) {
      let size = Math.floor(kbDataContainerElement.offsetWidth / 400);
      if (size <= 1) {
        size = 1;
      }
      setCardSize(size);
    }
  };
  useEffect(() => {
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);
  const toggleDustbin = () => {
    setDustbin(!dustbin);
  };
  const returnToKb = (record) => {
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
  };
  const deleteToDustbin = (id) => {
    dispatch &&
      dispatch({
        type: 'kbModel/_deleteOne',
        payload: id,
      });
  };
  const clearDustbin = () => {
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
  };
  const showDrawer = () => {
    formRef && formRef.current && formRef.current.resetFields(['name', 'desc']);
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onFinish = (values: any) => {
    const { id } = values;
    if (id) {
      dispatch &&
        dispatch({
          type: 'kbModel/_updateOne',
          payload: values,
        });
    } else {
      dispatch &&
        dispatch({
          type: 'kbModel/_createOne',
          payload: values,
        });
    }
    formRef.current.resetFields(['name', 'desc']);
    setVisible(false);
  };

  const initUpdateKbDrawer = (payload) => {
    formRef && formRef.current && formRef.current.setFieldsValue(payload);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const finalData: any = [];
  let pageData = [
    {
      name: '新建',
      desc: '',
      id: '',
    },
    ...(dustbin ? kbModel.dustbin : kbModel.data),
  ];
  pageData.push({ name: '垃圾箱', desc: '', id: '' });
  let colSpan = Math.floor(24 / cardSize);
  for (let i = 0, len = pageData.length; i < len; i += cardSize) {
    let rowData = pageData.slice(i, i + cardSize);
    finalData.push(
      <Row>
        {rowData.map((o, index) => {
          const start: boolean = i + index === 0;
          const end: boolean = i + index === pageData.length - 1;
          if (start) {
            return (
              <Col key={i + index} span={colSpan}>
                <Card
                  className="kb-card-create"
                  hoverable={true}
                  onClick={dustbin ? clearDustbin : showDrawer}
                >
                  <div>
                    {dustbin ? (
                      <ClearDustbin width="100%" height="40" />
                    ) : (
                      <AddKb width="100%" height="40" />
                    )}

                    <div style={{ textAlign: 'center' }}>
                      {dustbin ? '清空' : '新建'}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          }
          if (end) {
            return (
              <Col span={colSpan}>
                <Card
                  className="kb-card-create"
                  onClick={toggleDustbin}
                  hoverable={true}
                >
                  <div>
                    {dustbin ? (
                      <BkFromDustbin width="100%" />
                    ) : (
                      <Dustbin width="100%" />
                    )}
                    <div style={{ textAlign: 'center' }}>
                      {dustbin ? '返回库' : '垃圾箱'}
                    </div>
                  </div>
                </Card>
              </Col>
            );
          }
          return (
            <Col span={colSpan}>
              <Card
                className="kb-card"
                hoverable={true}
                actions={[
                  <div
                    onClick={() => {
                      showDrawer();
                      initUpdateKbDrawer(o);
                    }}
                  >
                    <SettingOutlined key="setting" />
                  </div>,
                  <div
                    onClick={() => {
                      if (dustbin) {
                        returnToKb(o);
                      } else {
                        deleteToDustbin(o.id);
                      }
                    }}
                  >
                    {dustbin ? (
                      <ReturnToKb width="18" height="18" key="returnToKb" />
                    ) : (
                      <DelToDustbin width="18" height="18" key="delete" />
                    )}
                  </div>,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
              >
                <Meta
                  title={
                    <div
                      onClick={() => {
                        history.push(`/note/editor?kbId=${o.id}`);
                      }}
                    >
                      {o.name}
                    </div>
                  }
                  description={o.desc ? o.desc : '...'}
                />
              </Card>
            </Col>
          );
        })}
      </Row>,
    );
  }

  return (
    <>
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
      {/* <div>
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
              console.log('todo ' + e);
            }}
            enterButton
          />
        </div> */}
      <div id="kb-data-container" className="kb-data-container">
        {finalData}
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
