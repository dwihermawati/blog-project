import React, { useCallback, useEffect, useState } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils';
import Link from '@tiptap/extension-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Link2Off,
  Pilcrow,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onContentChange: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onContentChange,
  placeholder = 'Enter your content...',
  disabled = false,
  className,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc ml-5',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal ml-5',
          },
        },
        heading: {
          levels: [1, 2],
        },
        paragraph: {
          HTMLAttributes: {
            class: 'mb-2',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onContentChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm md:prose-base focus:outline-none min-h-[150px] p-4 border border-neutral-300 rounded-b-xl overflow-y-auto max-h-96',
          disabled && 'bg-neutral-100 cursor-not-allowed opacity-70'
        ),
      },
    },
    editable: !disabled,
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false, { preserveCursor: true });
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
    if (!editor) return null;

    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);

    useEffect(() => {
      if (editor.isActive('link')) {
        setLinkUrl(editor.getAttributes('link').href);
      } else {
        setLinkUrl('');
      }
    }, [editor.isActive('link')]);

    const setLink = useCallback(() => {
      if (linkUrl === null || linkUrl.trim() === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        setShowLinkInput(false);
        return;
      }

      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      setShowLinkInput(false);
    }, [editor, linkUrl]);

    return (
      <div className='flex flex-wrap items-center gap-1 rounded-t-xl border-b border-neutral-300 bg-neutral-50 p-2'>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size='icon'
        >
          <Bold className='size-4' />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size='icon'
        >
          <Italic className='size-4' />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          variant={editor.isActive('strike') ? 'default' : 'ghost'}
          size='icon'
        >
          <Strikethrough className='size-4' />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size='icon'
        >
          <List className='size-4' />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size='icon'
        >
          <ListOrdered className='size-4' />
        </Button>

        {/* Alignment */}
        <Button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size='icon'
        >
          <AlignLeft className='size-4' />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          variant={
            editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'
          }
          size='icon'
        >
          <AlignCenter className='size-4' />
        </Button>
        <Button
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          variant={
            editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'
          }
          size='icon'
        >
          <AlignRight className='size-4' />
        </Button>
        {/* Link Buttons */}
        <Button
          type='button'
          onClick={() => setShowLinkInput(true)}
          variant={editor.isActive('link') ? 'default' : 'ghost'}
          size='icon'
        >
          <LinkIcon className='size-4' />
        </Button>
        {editor.isActive('link') && (
          <Button
            type='button'
            onClick={() => editor.chain().focus().unsetLink().run()}
            variant='ghost'
            size='icon'
          >
            <LinkOff className='size-4' />
          </Button>
        )}
        {showLinkInput && (
          <div className='ml-2 flex items-center gap-1'>
            <Input
              type='url'
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder='Enter URL'
              className='h-8 text-sm'
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setLink();
                }
              }}
            />
            <Button onClick={setLink} size='sm'>
              Set
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-neutral-300',
        className
      )}
    >
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
