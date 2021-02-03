import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';

export default (props: { value: string; key: string }) => {
  const editorRef = useRef(null);
  return (
    <div>
      <Editor
        previewStyle="vertical"
        initialValue={props.value}
        height="calc(100vh - 60px)"
        initialEditType="markdown"
        usageStatistics={false}
        ref={editorRef}
      />
    </div>
  );
};
