'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface InsertImageDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onInsertImage: (src: string, alt: string) => void;
}

const InsertImageDialog: React.FC<InsertImageDialogProps> = ({
  open,
  onOpenChange,
  onInsertImage,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [altText, setAltText] = useState('');
  const [imageSrc, setImageSrc] = useState('');

  const handleChooseFile = () => {
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInsert = () => {
    if (imageSrc) {
      onInsertImage(imageSrc, altText);
      onOpenChange(false);
      setAltText('');
      setImageSrc('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-130'>
        <DialogHeader className='border-b border-b-neutral-300 pb-2'>
          <DialogTitle>Insert Image</DialogTitle>
          <DialogClose asChild>
            <XIcon className='size-6 cursor-pointer text-neutral-950 hover:text-neutral-500' />
          </DialogClose>
        </DialogHeader>
        <div className='flex w-full flex-col gap-2.5'>
          <div className='grid grid-cols-[6rem_1fr] items-center gap-2 max-sm:grid-cols-[3.3rem_1fr]'>
            <span className='text-sm-regular leading-5 md:whitespace-nowrap'>
              Upload Image
            </span>
            <div
              className='group flex cursor-pointer items-center gap-2 rounded-xl border border-neutral-300 p-1.5 hover:bg-neutral-100'
              onClick={handleChooseFile}
            >
              <Button
                variant='outline'
                size='outline'
                className='group-hover:bg-primary-300 border-neutral-500 group-hover:border-none group-hover:text-white'
              >
                Choose File
              </Button>
              <span className='text-sm-regular line-clamp-1 w-full text-neutral-600'>
                {fileRef.current?.files?.[0]?.name || 'No file chosen'}
              </span>
              <input
                ref={fileRef}
                type='file'
                accept='image/*'
                className='hidden w-full'
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className='grid grid-cols-[6rem_1fr] items-center gap-2 max-sm:grid-cols-[3.3rem_1fr]'>
            <span className='text-sm-regular'>Alt Text</span>
            <input
              placeholder='Descriptive alternative text'
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className='outline-primary-300 h-11.5 w-full rounded-xl border border-neutral-300 p-2 hover:bg-neutral-100'
            />
          </div>
          <Button
            onClick={handleInsert}
            disabled={!imageSrc}
            className='mt-2.5 w-25 self-end'
          >
            Insert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InsertImageDialog;
