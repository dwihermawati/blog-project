'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';

interface LinkPopoverProps {
  position: { top: number; left: number } | null;
  url: string;
  onChangeUrl: (value: string) => void;
  onInsert: () => void;
  onClose: () => void;
}

function normalizeUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  return 'https://' + input;
}

function isValidUrlFormat(input: string): boolean {
  const domainRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/i;
  return domainRegex.test(input.trim());
}

export default function LinkPopover({
  position,
  url,
  onChangeUrl,
  onInsert,
  onClose,
}: LinkPopoverProps) {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState('');
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (!position) return;

    const { innerWidth, innerHeight } = window;
    const popoverWidth = 320;
    const popoverHeight = 110;
    const spacing = 8;

    let left = position.left;
    let transformX = 'translateX(-50%)';

    if (left - popoverWidth / 2 < spacing) {
      left = spacing;
      transformX = 'none';
    } else if (left + popoverWidth / 2 > innerWidth - spacing) {
      left = innerWidth - spacing;
      transformX = 'translateX(-100%)';
    }

    let top = position.top;
    let transformY = '';

    const isFullscreen = document
      .querySelector('.editor-container')
      ?.classList.contains('fullscreen');
    const willOverflowBottom = top + popoverHeight + spacing > innerHeight;

    if (isFullscreen && willOverflowBottom) {
      top = position.top - popoverHeight - spacing;
    }

    setPopoverStyle({
      top,
      left,
      transform: `${transformX} ${transformY}`,
    });
  }, [position]);

  if (!position) return null;

  const handleInsert = () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    if (!isValidUrlFormat(trimmed)) {
      setError('Please enter a valid URL, e.g. example.com');
      return;
    }

    const normalized = normalizeUrl(trimmed);
    onChangeUrl(normalized);
    setError('');
    onInsert();
  };

  return (
    <div
      ref={popoverRef}
      className='fixed z-50 w-[90vw] max-w-[320px] rounded-md border border-neutral-300 bg-white p-3 shadow-md'
      style={popoverStyle}
    >
      <Input
        placeholder='example.com'
        value={url}
        onChange={(e) => {
          onChangeUrl(e.target.value);
          if (error) setError('');
        }}
        autoFocus
      />
      {error && <p className='mt-1 text-sm text-[#EE1D52]'>{error}</p>}
      <div className='mt-2 flex w-full justify-between gap-2'>
        <Button
          type='button'
          variant='secondary'
          onClick={onClose}
          className='w-35'
        >
          Cancel
        </Button>
        <Button
          type='button'
          onClick={handleInsert}
          className='w-35'
          disabled={!url.trim()}
        >
          Insert
        </Button>
      </div>
    </div>
  );
}
