import { InboxOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import './style.less';
const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  customRequest: (e) => {
    console.log(e);
  },
  //   onChange(info) {
  //     const { status } = info.file;
  //     if (status !== 'uploading') {
  //       console.log(info.file, info.fileList);
  //     }
  //     if (status === 'done') {
  //       message.success(`${info.file.name} file uploaded successfully.`);
  //     } else if (status === 'error') {
  //       message.error(`${info.file.name} file upload failed.`);
  //     }
  //   },
};

export default () => {
  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">点击/拖拽</p>
      <p className="ant-upload-hint">上传配置插件</p>
    </Dragger>
  );
};
