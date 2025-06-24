'use client';

import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { useState } from 'react';
import { $getRoot } from 'lexical';

import { editorConfig } from './editorConfig';
import { ToolbarPlugin } from './plugins/ToolbarPlugin';
import InitialContentPlugin from './plugins/InitialContentPlugin';
import '@/editor.css';
import FloatingTextFormatToolbarPlugin from './FloatingTextFormatToolbarPlugin';

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
              <ContentEditable
                className={`editor-input outline-primary-300 min-h-[186px] px-4 py-3`}
              />
              {isEmpty && (
                <p className='placeholder text-sm-regular pointer-events-none absolute top-3 left-4 text-neutral-500'>
                  Enter your content
                </p>
              )}
            </div>
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <FloatingTextFormatToolbarPlugin />
        <InitialContentPlugin initialContent={initialContent} />
        <HistoryPlugin />
        <LinkPlugin />
        <ListPlugin />
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
