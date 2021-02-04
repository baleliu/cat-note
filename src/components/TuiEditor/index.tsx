import React, { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';

export default (props: {
  value: string;
  key: string;
  blur?: (md: string) => void;
}) => {
  const editorRef: any = useRef(null);

  const getText = () => [];

  return (
    <div>
      <Editor
        previewStyle="vertical"
        initialValue={props.value}
        height="calc(100vh - 60px)"
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
