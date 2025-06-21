'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useState } from 'react';
import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';

import { editorConfig } from './editorConfig';
import { ToolbarPlugin } from './ToolbarPlugin';
import './editor.css';

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

export default function Editor({
  onChange,
  initialContent,
  wrapperClassName = '',
}: {
  onChange?: (editorState: string) => void;
  initialContent?: string;
  wrapperClassName?: string;
}) {
  const [isEmpty, setIsEmpty] = useState(true);

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        editorState: undefined,
      }}
    >
      <div className={`editor-container ${wrapperClassName}`}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={
            <div className='relative'>
              <ContentEditable className='outline-primary-300 min-h-[186px] px-4 py-3' />
              {isEmpty && (
                <p className='text-sm-regular pointer-events-none absolute top-3 left-4 text-neutral-500'>
                  Enter your content
                </p>
              )}
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <InitialContentPlugin initialContent={initialContent} />
        <HistoryPlugin />
        <LinkPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            const json = editorState.toJSON();
            onChange?.(JSON.stringify(json));

            editorState.read(() => {
              const root = $getRoot();
              const hasText = root.getTextContent().trim().length > 0;
              setIsEmpty(!hasText);
            });
          }}
        />
      </div>
    </LexicalComposer>
  );
}
