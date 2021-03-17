import {
  BookOutlined,
  ExclamationCircleOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import {
  Anchor,
  Dropdown,
  Layout,
  Menu,
  Modal,
  Select,
  Tooltip,
  Tree,
} from 'antd';
import './style.less';

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { confirm } = Modal;
const { Link } = Anchor;

export default (props: {
  onSelectKb: (id: string) => void;
  defaultKb?: string;
  nodeWidth: string;
  width: string;
  kbData: any;
  showToolBar: boolean;
  addCatalog: (id?: number | string) => void;
  deleteCatalog: (id: number | string) => void;
  onSelect: (node: any) => void;
  treeData: any;
  changeMode?: (node: any) => void;
  currentKey: any;
}) => {
  return (
    <>
      <Select
        className="editor-select-kb"
        onSelect={(id) => {
          props.onSelectKb && props.onSelectKb(id);
        }}
        defaultValue={props.defaultKb}
        showSearch
        bordered={false}
        style={{
          width: props.width,
          position: 'fixed',
        }}
        placeholder=""
        optionFilterProp="children"
      >
        {props.kbData.map((o) => {
          return (
            <Option key={o.id} value={o.id}>
              {o.name}
            </Option>
          );
        })}
      </Select>
      {props.showToolBar && (
        <div
          className="catalog-tool-bar"
          style={{
            width: props.width,
          }}
        >
          <span className="catalog-tool-btn">
            <Tooltip placement="bottomLeft" title={'创建新文档'}>
              <PlusSquareOutlined
                className="catalog-tool-btn-icon"
                color="gray"
                onClick={() => {
                  props.addCatalog(undefined);
                }}
              />
            </Tooltip>
          </span>
          <span className="catalog-tool-btn">
            <Tooltip placement="bottomLeft" title={'创建知识库'}>
              <BookOutlined
                className="catalog-tool-btn-icon"
                color="gray"
                onClick={() => {
                  alert('todo');
                }}
              />
            </Tooltip>
          </span>
        </div>
      )}
      <div
        className="catalog-tree-container"
        style={{
          height: 'calc(100vh - 20px)',
        }}
      >
        <Tree
          onSelect={(
            selectedKeys,
            { selected: bool, selectedNodes, node, event },
          ) => {
            props.onSelect && props.onSelect(node);
          }}
          titleRender={(node) => {
            return (
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      onClick={() => {
                        props.addCatalog(node.key);
                      }}
                      key="1"
                    >
                      添加子文档
                    </Menu.Item>
                    <Menu.Item
                      onClick={() => {
                        confirm({
                          okText: '删除',
                          cancelText: '取消',
                          title: `是否删除文档【${node.title}】`,
                          icon: <ExclamationCircleOutlined />,
                          onOk() {
                            props.deleteCatalog &&
                              props.deleteCatalog(node.key);
                          },
                        });
                      }}
                      key="2"
                    >
                      删除
                    </Menu.Item>
                    {node.key === props.currentKey && (
                      <Menu.Item
                        onClick={() => {
                          confirm({
                            okText: '切换',
                            cancelText: '取消',
                            title: `是否切换模式【${node.title}】`,
                            icon: <ExclamationCircleOutlined />,
                            onOk() {
                              props.changeMode && props.changeMode(node);
                            },
                          });
                        }}
                        key="3"
                      >
                        切换编辑器模式
                      </Menu.Item>
                    )}
                  </Menu>
                }
                trigger={['contextMenu']}
              >
                <div
                  style={{
                    width: props.nodeWidth,
                  }}
                  className="catalog-tree-node-title"
                >
                  {node.title}
                </div>
              </Dropdown>
            );
          }}
          onDragEnd={(info) => {}}
          onDrop={(info) => {
            console.log(info);
          }}
          draggable={true}
          treeData={props.treeData}
          showIcon={true}
        />
      </div>
    </>
  );
};
