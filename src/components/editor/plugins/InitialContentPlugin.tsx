'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';
import { useEffect, useState } from 'react';

function InitialContentPlugin({ initialContent }: { initialContent?: string }) {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialContent || initialized) return;

    try {
      const parsedState = editor.parseEditorState(initialContent);
      editor.setEditorState(parsedState);
    } catch (err) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        const textNode = $createTextNode(initialContent);
        paragraph.append(textNode);
        root.append(paragraph);
      });
    }

    setInitialized(true);
  }, [editor, initialContent, initialized]);

  return null;
}

export default InitialContentPlugin;
