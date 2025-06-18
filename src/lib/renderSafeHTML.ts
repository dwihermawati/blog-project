import DOMPurify from 'dompurify';
import { $generateHtmlFromNodes } from '@lexical/html';
import { createEditor } from 'lexical';
import { editorCoreConfig } from '@/components/editor/editorConfig';

const editor = createEditor(editorCoreConfig);

function isLexicalJson(str: string): boolean {
  try {
    const json = JSON.parse(str);
    return json?.root?.type === 'root';
  } catch {
    return false;
  }
}

export function renderSafeHTML(content: string): { __html: string } {
  try {
    if (isLexicalJson(content)) {
      const editorState = editor.parseEditorState(content);
      editor.setEditorState(editorState);

      let html = '';
      editor.update(() => {
        html = $generateHtmlFromNodes(editor);
      });

      return {
        __html: DOMPurify.sanitize(html, {
          USE_PROFILES: { html: true },
          FORBID_TAGS: ['script'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick'],
        }),
      };
    } else {
      return {
        __html: DOMPurify.sanitize(content, {
          USE_PROFILES: { html: true },
          FORBID_TAGS: ['script'],
          FORBID_ATTR: ['onerror', 'onload', 'onclick'],
        }),
      };
    }
  } catch (e) {
    console.error('renderSafeHTML failed:', e);
    return { __html: '<p>Invalid content</p>' };
  }
}
