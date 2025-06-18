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
  theme: {},
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
