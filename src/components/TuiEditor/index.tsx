import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import 'codemirror/lib/codemirror.css';
import React, { useRef } from 'react';
import uuid from 'uuid';
import './style.less';

export const htmlToMarkdown = (html: string) => {
  let imgs = html.match(
    /<img.*?src=[\"|\']?(.*?)[\"|\']?\s.*?src-file-key.*?>/gi,
  );
  if (imgs) {
    for (let i in imgs) {
      let context = imgs[i];
      context = context.replace(/src=[\"|\']?(.*?)[\"|\']?\s.*?/gi, '');
      context = context.replace('src-file-key', 'src');
      html = html.replace(imgs[i], context);
    }
  }
  return html;
};

export const changeMode = (instance, mode, isWithoutFocus) => {
  if (instance.currentMode === mode) {
    return;
  }
  if (!instance) {
    return;
  }
  instance.eventManager.emit('changeModeBefore', instance.currentMode);
  instance.currentMode = mode;
  if (instance.isWysiwygMode()) {
    instance.layout.switchToWYSIWYG();
    instance.wwEditor.setValue(
      instance.convertor.toHTML(instance.mdEditor.getValue()),
      !isWithoutFocus,
    );
    instance.eventManager.emit('changeModeToWysiwyg');
  } else {
    instance.layout.switchToMarkdown();
    instance.mdEditor.resetState();
    instance.mdEditor.setValue(
      instance.convertor.toMarkdown(
        htmlToMarkdown(instance.wwEditor.getValue()),
        instance.toMarkOptions,
      ),
      !isWithoutFocus,
    );
    instance.getCodeMirror().refresh();
    instance.eventManager.emit('changeModeToMarkdown');
  }
  instance.eventManager.emit('changeMode', mode);
  if (!isWithoutFocus) {
    instance.focus();
  }
};

// 自定义 html 渲染 https://github.com/nhn/tui.editor/blob/a22c2c379cc6495eaea1c9dded61dc501eca9e26/apps/editor/docs/custom-html-renderer.md
const customHTMLRenderer: any = (props) => {
  return {
    heading({ level }, { entering }) {
      console.log('heading');
      return {
        type: entering ? 'openTag' : 'closeTag',
        tagName: `a`,
        attributes: {
          hh: 'hh',
        },
      };
    },
    text(node) {
      console.log(node);
      return {
        type: 'text',
        content: node.literal,
      };
    },
    image(node: any, context: any) {
      const { destination } = node;
      const { getChildrenText, skipChildren } = context;
      skipChildren();
      if (destination.startsWith('http')) {
        return {
          type: 'openTag',
          tagName: 'img',
          selfClose: true,
          attributes: {
            src: destination,
            alt: getChildrenText(node),
          },
        };
      }
      const src = readFileKeyAsBase64(destination, props.fileKey);
      return {
        type: 'openTag',
        tagName: 'img',
        selfClose: true,
        attributes: {
          src: src,
          'src-file-key': destination,
          alt: getChildrenText(node),
        },
      };
    },
  };
};

const hooks = (editorRef, props) => {
  return {
    addImageBlobHook: (file, callback) => {
      let reader = new FileReader();
      const suffix: string = uuid.v4();
      reader.onload = function (e) {
        if (this.result instanceof ArrayBuffer) {
          window.api.file.writeFileSync({
            fileKey: props.fileKey,
            data: Buffer.from(this.result),
            suffix: suffix,
          });
        } else {
          console.log(this.result);
        }
        let altText = 'image';
        let filekey = suffix;
        if (editorRef.current.getInstance().currentMode === 'markdown') {
          const cm = editorRef.current.getInstance().getCurrentModeEditor().cm;
          const doc = cm.getDoc();
          const mde = editorRef.current.getInstance().getCurrentModeEditor();
          const range = mde.getCurrentRange();
          const from = {
            line: range.from.line,
            ch: range.from.ch,
          };
          const to = {
            line: range.to.line,
            ch: range.to.ch,
          };
          const replaceText = `![${altText}](${filekey})`;
          doc.replaceRange(replaceText, from, to, '+addImage');
          cm.focus();
        } else {
          const sq = editorRef.current.getInstance().getCurrentModeEditor()
            .editor;
          editorRef.current.getInstance().focus();
          let imageUrl = readFileKeyAsBase64(filekey, props.filekey);
          if (!sq.hasFormat('PRE')) {
            sq.insertImage(imageUrl, {
              alt: altText,
              'src-file-key': filekey,
            });
          }
        }
      };
      reader.readAsArrayBuffer(file);
    },
  };
};

const readFileKeyAsBase64 = (suffix, fileKey) => {
  const encoding = 'base64';
  const src = window.api.file.readFileSync({
    fileKey: fileKey,
    encoding: encoding,
    suffix: suffix,
  });
  return `data:image/png;${encoding},${src}`;
};

const events = (editorRef, props) => {
  return {
    blur: (e) => {
      console.log(e);
      console.log(editorRef);
      if (editorRef.current) {
        const instance = editorRef.current.getInstance();
        if (instance) {
          let mdText: string = '';
          if (instance.isMarkdownMode()) {
            mdText = instance.getMarkdown();
          } else {
            const wwe = instance.wwEditor;
            let html = wwe.getValue();
            html = htmlToMarkdown(html);
            mdText = instance.convertor.toMarkdown(
              html,
              instance.toMarkOptions,
            );
          }
          props.blur && props.blur(mdText);
        }
      }
    },
  };
};
export default (props: {
  value: string;
  key: string;
  style?: any;
  instanceRef?: any;
  height?: string;
  fileKey?: string;
  editType?: 'markdown' | 'wysiwyg';
  addImageBlobHook?: (
    file: Blob | File,
  ) => {
    url: string;
    alt: string;
  };
  blur?: (md: string) => void;
}) => {
  return (
    <div style={props.style}>
      <Editor
        previewStyle="tab"
        initialValue={props.value}
        height={props.height}
        initialEditType={props.editType}
        usageStatistics={false}
        // 编辑器底部切换模式
        hideModeSwitch={true}
        useDefaultHTMLSanitizer={false}
        hooks={hooks(props.instanceRef, props)}
        customHTMLRenderer={customHTMLRenderer(props)}
        useCommandShortcut={true}
        ref={props.instanceRef}
        events={events(props.instanceRef, props)}
      />
    </div>
  );
};
