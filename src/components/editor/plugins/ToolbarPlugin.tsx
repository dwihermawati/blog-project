'use client';

import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $createParagraphNode,
  TextNode,
  ElementNode,
  UNDO_COMMAND,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { $createHeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  $isListNode,
} from '@lexical/list';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import {
  Bold,
  Italic,
  // Underline,
  Strikethrough,
  List,
  ListOrdered,
} from 'lucide-react';
import { Icon } from '@iconify/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import LinkPopover from '@/components/ui/link-popover';
import { toast } from 'react-toastify';
import InsertImageDialog from '@/components/shared/InsertImageDialog';
import { $createImageNode } from '../ImageNode';
import UndoIcon from '@/assets/icons/undo-icon.png';
import RemoveFormat from '@/assets/icons/remove-format.png';
import ToolbarButton from '../ToolbarButton';

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [alignment, setAlignment] = useState('');
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPosition, setLinkPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [openDialogInsertImage, setOpenDialogInsertImage] = useState(false);

  const toggleFullscreen = () => {
    const container = document.querySelector('.editor-container');
    if (!container) return;
    container.classList.toggle('fullscreen');
    setIsFullscreen((prev) => !prev);
  };

  const [blockType, setBlockType] = useState<
    'paragraph' | 'h1' | 'h2' | 'h3' | 'quote'
  >('paragraph');
  const applyBlockType = (type: 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        switch (type) {
          case 'quote':
            $setBlocksType(selection, () => new QuoteNode());
            break;
          case 'paragraph':
            $setBlocksType(selection, () => $createParagraphNode());
            break;
          default:
            $setBlocksType(selection, () => $createHeadingNode(type));
        }
      }
    });
  };

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsStrikethrough(selection.hasFormat('strikethrough'));

          const anchorNode = selection.anchor.getNode();
          const topNode = anchorNode.getTopLevelElementOrThrow();
          const type = topNode.getType();

          // Heading, Quote, Paragraph
          if (type === 'heading') {
            // @ts-ignore
            setBlockType(topNode.getTag());
          } else if (type === 'quote') {
            setBlockType('quote');
          } else {
            setBlockType('paragraph');
          }

          // List Detection
          if ($isListNode(topNode)) {
            setIsBulletList(topNode.getListType() === 'bullet');
            setIsNumberedList(topNode.getListType() === 'number');
          } else {
            setIsBulletList(false);
            setIsNumberedList(false);
          }

          // Link Detection
          let node: TextNode | ElementNode | null = anchorNode;
          let foundLink = false;

          while (node != null) {
            if (node.getType() === 'link') {
              foundLink = true;
              break;
            }
            node = node.getParent();
          }

          setIsLink(foundLink);

          // Alignment Detection
          const dom = editor.getElementByKey(topNode.getKey());
          if (dom) {
            const computed = window.getComputedStyle(dom);
            const textAlign = computed.textAlign;
            if (['left', 'center', 'right', 'justify'].includes(textAlign)) {
              setAlignment(textAlign);
            } else {
              setAlignment('');
            }
          }
        }
      });
    });
  }, [editor]);

  const insertList = (type: 'bullet' | 'number') => {
    editor.dispatchCommand(
      type === 'bullet'
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  };

  const openLinkPopover = () => {
    const domSelection = window.getSelection();
    if (!domSelection || domSelection.rangeCount === 0) return;

    const range = domSelection.getRangeAt(0);
    const selectedText = domSelection.toString().trim();

    if (!selectedText || range.collapsed) {
      toast.info('You must select the text first');
      return;
    }

    const rect = range.getBoundingClientRect();
    setLinkPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const node = selection.anchor.getNode();
        const parent = node.getParent();

        if (parent?.getType() === 'link' && 'getURL' in parent) {
          setLinkUrl((parent as any).getURL());
        } else {
          setLinkUrl('');
        }
      }
    });

    setShowLinkPopover(true);
  };

  const insertLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: linkUrl });
    setShowLinkPopover(false);
    setLinkUrl('');
  };
  const removeLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  };

  const handleInsertImage = (src: string, alt: string) => {
    editor.update(() => {
      const imageNode = $createImageNode({ src, altText: alt });
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([imageNode]);
      }
    });
  };

  const removeFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      $setBlocksType(selection, () => $createParagraphNode());

      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');

      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);

      if (selection.hasFormat('bold')) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      }
      if (selection.hasFormat('italic')) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      }
      if (selection.hasFormat('strikethrough')) {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      }
    });
  };

  return (
    <div className='toolbar flex flex-wrap items-center gap-2 border-b border-b-neutral-300 p-2.5'>
      <Select
        value={blockType ?? undefined}
        onValueChange={(value: 'paragraph' | 'h1' | 'h2' | 'h3' | 'quote') => {
          setBlockType(value);
          if (value !== 'paragraph') {
            applyBlockType(value as any);
          } else {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createParagraphNode());
              }
            });
          }
        }}
      >
        <SelectTrigger className='w-30'>
          <SelectValue placeholder='Heading' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='h1'>Heading 1</SelectItem>
          <SelectItem value='h2'>Heading 2</SelectItem>
          <SelectItem value='h3'>Heading 3</SelectItem>
          <SelectItem value='paragraph'>Normal</SelectItem>
          <SelectItem value='quote'>Quote</SelectItem>
        </SelectContent>
      </Select>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>
      {/* Inline formatting */}
      <div className='flex gap-1'>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          title='Bold'
          active={isBold}
        >
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
          }
          title='Strikethrough'
          active={isStrikethrough}
        >
          <Strikethrough size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          title='Italic'
          active={isItalic}
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
        <ToolbarButton
          onClick={() => insertList('bullet')}
          title='Bullet List'
          active={isBulletList}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertList('number')}
          title='Numbered List'
          active={isNumberedList}
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
          active={alignment === 'left'}
        >
          <Icon icon='ri:align-left' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
          }
          title='Align Center'
          active={alignment === 'center'}
        >
          <Icon icon='ri:align-center' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
          }
          title='Align Right'
          active={alignment === 'right'}
        >
          <Icon icon='ri:align-right' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
          }
          title='Justify'
          active={alignment === 'justify'}
        >
          <Icon icon='ri:align-justify' className='size-[18px]' />
        </ToolbarButton>
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>

      {/* Others */}
      <div className='flex gap-1'>
        <ToolbarButton
          onClick={openLinkPopover}
          title='Insert Link'
          active={isLink}
        >
          <Icon icon='ri:link' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton onClick={removeLink} title='Remove Link'>
          <Icon icon='tabler:unlink' className='size-[18px]' />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setOpenDialogInsertImage(true)}
          title='Insert Image'
        >
          <Icon icon='ri:image-fill' className='size-[18px]' />
        </ToolbarButton>
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>
      <div className='flex gap-1'>
        <ToolbarButton
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title='Undo'
        >
          <img src={UndoIcon} alt='Undo' className='size-[13.5px]' />
        </ToolbarButton>
        <ToolbarButton onClick={removeFormatting} title='Remove Formatting'>
          <img src={RemoveFormat} alt='Undo' className='size-[13.5px]' />
        </ToolbarButton>
      </div>
      <div className='h-4 w-[1px] bg-[#919EAB]/20'></div>
      <ToolbarButton onClick={toggleFullscreen} title='Toggle Fullscreen'>
        {isFullscreen ? (
          <Icon icon='ri:fullscreen-exit-line' className='size-[18px]' />
        ) : (
          <Icon icon='ri:fullscreen-line' className='size-[18px]' />
        )}
      </ToolbarButton>

      {showLinkPopover && (
        <LinkPopover
          position={linkPosition}
          url={linkUrl}
          onChangeUrl={setLinkUrl}
          onInsert={insertLink}
          onClose={() => setShowLinkPopover(false)}
        />
      )}

      <InsertImageDialog
        open={openDialogInsertImage}
        onOpenChange={setOpenDialogInsertImage}
        onInsertImage={handleInsertImage}
      />
    </div>
  );
}
