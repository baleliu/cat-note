import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import 'codemirror/lib/codemirror.css';
import './style.less';

export default (props: {
  value: string;
  key: string;
  style?: any;
  height?: string;
  blur?: (md: string) => void;
}) => {
  const editorRef: any = useRef(null);
  return (
    <div style={props.style}>
      <Editor
        previewStyle="vertical"
        initialValue={props.value}
        height={props.height}
        initialEditType="markdown"
        usageStatistics={false}
        useCommandShortcut={false}
        ref={editorRef}
        events={{
          blur: (e) => {
            props.blur &&
              props.blur(editorRef.current.getInstance().getMarkdown());
          },
        }}
      />
    </div>
  );
};
