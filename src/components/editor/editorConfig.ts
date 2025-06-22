import { type InitialConfigType } from '@lexical/react/LexicalComposer';
import { CreateEditorArgs, Klass, LexicalNode } from 'lexical';
import { LinkNode } from '@lexical/link';
import { ParagraphNode, TextNode } from 'lexical';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';

export const editorNodes: Klass<LexicalNode>[] = [
  LinkNode,
  ParagraphNode,
  TextNode,
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

export const editorConfig: InitialConfigType = {
  namespace: 'MyEditor',
  theme: {
    text: {
      bold: 'bold',
      italic: 'italic',
      strikethrough: 'strikethrough',
    },
    list: {
      listitem: 'editor-listitem',
      nested: {
        listitem: 'editor-nested-listitem',
      },
      ol: 'editor-list-ol',
      ul: 'editor-list-ul',
    },
    link: 'editor-link',
  },
  onError(error) {
    throw error;
  },
  nodes: editorNodes,
};

export const editorCoreConfig: CreateEditorArgs = {
  namespace: 'MyEditor',
  theme: {},
  onError(error) {
    throw error;
  },
  nodes: editorNodes,
};
