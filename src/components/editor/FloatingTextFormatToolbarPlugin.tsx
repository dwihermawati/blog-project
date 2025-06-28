'use client';

import {
  $getSelection,
  $isRangeSelection,
  ElementNode,
  FORMAT_TEXT_COMMAND,
  TextNode,
} from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import LinkPopover from '@/components/ui/link-popover';
import { Icon } from '@iconify/react';
import { Bold, Italic, Strikethrough } from 'lucide-react';
import { cn } from '@/lib/utils';
import ToolbarButton from './ToolbarButton';

export default function FloatingTextFormatToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [position, setPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [showPopover, setShowPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkPosition, setLinkPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    editorRef.current = document.querySelector('.editor-container');
  }, []);

  useEffect(() => {
    const container = document.querySelector('.editor-container');
    setIsFullscreen(container?.classList.contains('fullscreen') ?? false);
  }, [position]);

  useEffect(() => {
    const updateToolbar = () => {
      if (showPopover) return;

      const selection = window.getSelection();
      const editorElem = editorRef.current;
      if (
        !selection ||
        selection.rangeCount === 0 ||
        selection.isCollapsed ||
        !editorElem
      ) {
        setPosition(null);
        return;
      }

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const editorRect = editorElem.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        setPosition(null);
        return;
      }

      const toolbarHeight = 40;
      const spacing = 8;
      const relativeTopAbove =
        rect.top - editorRect.top - toolbarHeight - spacing;
      const relativeTopBelow = rect.bottom - editorRect.top + spacing;
      const shouldShowAbove =
        rect.top - editorRect.top > toolbarHeight + spacing;

      setPosition({
        top: shouldShowAbove ? relativeTopAbove : relativeTopBelow,
        left: rect.left - editorRect.left + rect.width / 2,
      });
    };

    const remove = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          updateToolbar();
          setIsBold(selection.hasFormat('bold'));
          setIsItalic(selection.hasFormat('italic'));
          setIsStrikethrough(selection.hasFormat('strikethrough'));

          const anchorNode = selection.anchor.getNode();
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
        } else {
          setPosition(null);
        }
      });
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(e.target as Node)
      ) {
        setPosition(null);
        setShowPopover(false);
      }
    };

    document.addEventListener('scroll', updateToolbar, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      remove();
      document.removeEventListener('scroll', updateToolbar, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editor, showPopover]);

  const insertLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url: linkUrl });
    setShowPopover(false);
    setLinkUrl('');
  };

  const showLinkPopoverAtSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const selectedText = selection.toString().trim();

    if (!selectedText || range.collapsed) {
      toast.info('You must select the text first');
      return;
    }

    setLinkPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });

    editor.getEditorState().read(() => {
      const lexicalSelection = $getSelection();
      if ($isRangeSelection(lexicalSelection)) {
        const anchorNode = lexicalSelection.anchor.getNode();
        const parent = anchorNode.getParent();
        if (parent?.getType() === 'link' && 'getURL' in parent) {
          setLinkUrl((parent as any).getURL());
        } else {
          setLinkUrl('');
        }
      }
    });

    setTimeout(() => setShowPopover(true), 0);
    setPosition(null);
  };

  if (!editorRef.current) return null;

  return (
    <>
      {position && (
        <div
          ref={toolbarRef}
          className={cn(
            'z-40 flex items-center gap-1 rounded-md border border-neutral-300 bg-white p-1.5 shadow-md',
            isFullscreen ? 'fixed' : 'absolute'
          )}
          style={{
            top: position.top,
            left: position.left,
            transform: 'translateX(-50%) translateY(-7%)',
          }}
        >
          <ToolbarButton
            onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            title='Bold'
            active={isBold}
          >
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
            }
            title='Italic'
            active={isItalic}
          >
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
            }
            title='Strikethrough'
            active={isStrikethrough}
          >
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={showLinkPopoverAtSelection}
            title='Insert Link'
            active={isLink}
          >
            <Icon icon='ri:link' className='size-[15px]' />
          </ToolbarButton>
        </div>
      )}

      {showPopover && linkPosition && (
        <LinkPopover
          position={linkPosition}
          url={linkUrl}
          onChangeUrl={setLinkUrl}
          onInsert={insertLink}
          onClose={() => setShowPopover(false)}
        />
      )}
    </>
  );
}
