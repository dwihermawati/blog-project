'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface LinkPopoverProps {
  position: { top: number; left: number } | null;
  url: string;
  onChangeUrl: (value: string) => void;
  onInsert: () => void;
  onClose: () => void;
}

export default function LinkPopover({
  position,
  url,
  onChangeUrl,
  onInsert,
  onClose,
}: LinkPopoverProps) {
  if (!position) return null;

  const isNearRight = position.left > window.innerWidth * 0.6;
  const isNearLeft = position.left < window.innerWidth * 0.4;

  const popoverClass = cn(
    'absolute z-40 w-[90vw] max-w-[320px] rounded-md border border-neutral-300 bg-white p-3 shadow-md transition-transform',
    {
      'translate-x-[-87%]': isNearRight,
      'translate-x-0': isNearLeft,
      'translate-x-[-50%]': !isNearLeft && !isNearRight,
    }
  );

  const popoverRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <div
      ref={popoverRef}
      className={popoverClass}
      style={{ top: position.top, left: position.left }}
    >
      <Input
        placeholder='https://example.com'
        value={url}
        onChange={(e) => onChangeUrl(e.target.value)}
        autoFocus
      />
      <div className='mt-2 flex w-full justify-between gap-2'>
        <Button variant='secondary' onClick={onClose} className='w-35'>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (!url.trim()) return;
            onInsert();
          }}
          className='w-35'
          disabled={!url.trim()}
        >
          Insert
        </Button>
      </div>
    </div>
  );
}
