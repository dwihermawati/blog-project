'use client';

import React, { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode } from '@lexical/rich-text';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  Bold,
  Italic,
  // Underline,
  Strikethrough,
  List,
  ListOrdered,
  Image as ImageIcon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ToolbarButton = ({
  onClick,
  title,
  children,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) => (
  <Button
    type='button'
    variant='icon'
    size='icon'
    title={title}
    onClick={onClick}
    className='size-7'
  >
    {children}
  </Button>
);

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const container = document.querySelector('.editor-container');
    if (!container) return;
    container.classList.toggle('fullscreen');
    setIsFullscreen((prev) => !prev);
  };

  const [blockType, setBlockType] = useState<string | null>(null);
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const parent = anchorNode.getParent();

          const node =
            parent && parent.getType() !== 'root' ? parent : anchorNode;

          if (node.getType() === 'heading') {
            // @ts-ignore: heading node has getTag
            const tag = node.getTag();
            setBlockType(tag);
          } else {
            setBlockType(null);
          }
        }
      });
    });
  }, [editor]);

  const applyHeading = (tag: 'h1' | 'h2' | 'h3') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        try {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        } catch (err) {
          console.error('Failed to set heading:', err);
        }
      }
    });
  };

  const insertList = (type: 'bullet' | 'number') => {
    editor.dispatchCommand(
      type === 'bullet'
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  };

  const insertLink = () => {
    const url = prompt('Enter URL');
    if (url) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url });
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL');
    if (!url) return;

    editor.update(() => {
      const img = document.createElement('img');
      img.src = url;
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        selection.getRangeAt(0).insertNode(img);
      }
    });
  };

  return (
    <div className='toolbar flex flex-wrap items-center gap-2 border-b border-b-neutral-300 p-2.5'>
      <Select
        value={blockType ?? undefined}
        onValueChange={(value: 'h1' | 'h2' | 'h3') => applyHeading(value)}
      >
        <SelectTrigger className='w-30'>
          <SelectValue placeholder='Heading' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='h1'>Heading 1</SelectItem>
          <SelectItem value='h2'>Heading 2</SelectItem>
          <SelectItem value='h3'>Heading 3</SelectItem>
        </SelectContent>
      </Select>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>
      {/* Inline formatting */}
      <div className='flex gap-1'>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          title='Bold'
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }
          title='Strikethrough'
        >
          <Strikethrough size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          title='Italic'
        >
          <Italic size={18} />
        </ToolbarButton>
        {/* <ToolbarButton
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title='Underline'
      >
        <Underline size={18} />
      </ToolbarButton> */}
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>

      {/* Lists */}
      <div className='flex gap-1'>
        <ToolbarButton onClick={() => insertList('bullet')} title='Bullet List'>
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertList('number')}
          title='Numbered List'
        >
          <ListOrdered size={18} />
        </ToolbarButton>
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>

      {/* Alignment */}
      <div className='flex gap-1'>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
          title='Align Left'
        >
          <Icon icon='ri:align-left' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }
          title='Align Center'
        >
          <Icon icon='ri:align-center' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }
          title='Align Right'
        >
          <Icon icon='ri:align-right' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }
          title='Justify'
        >
          <Icon icon='ri:align-justify' className='size-[18px]' />
        </ToolbarButton>
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>

      {/* Others */}
      <div className='flex gap-1'>
        <ToolbarButton onClick={insertLink} title='Insert Link'>
          <Icon icon='ph:link-simple' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton onClick={insertLink} title='Insert Link'>
          <Icon
            icon='mingcute:unlink-2-line'
            className='size-[18px] rotate-180 transform'
          />
        </ToolbarButton>
        <ToolbarButton onClick={insertImage} title='Insert Image'>
          <ImageIcon size={18} />
        </ToolbarButton>
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>

      <ToolbarButton onClick={toggleFullscreen} title='Toggle Fullscreen'>
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </ToolbarButton>
    </div>
  );
}
