'use client';

import { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Icon } from '@iconify/react';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ArrowUpToLine, Trash2 } from 'lucide-react';

interface ImageUploadControllerProps {
  control: any;
  name: string;
  disabled?: boolean;
  initialPreviewUrl?: string | null;
}

export function ImageUploadController({
  control,
  name,
  disabled,
  initialPreviewUrl,
}: ImageUploadControllerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreviewUrl ?? null
  );

  const { watch } = useFormContext();
  const imageFile = watch(name);

  useEffect(() => {
    if (imageFile instanceof File) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (initialPreviewUrl) {
      setPreviewUrl(initialPreviewUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile, initialPreviewUrl]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <Label>Cover Image</Label>
          <FormControl>
            <div>
              {previewUrl ? (
                <div className='relative overflow-hidden rounded-xl border border-dashed border-neutral-400 bg-neutral-50 px-6 py-4'>
                  <img
                    src={previewUrl}
                    alt='Preview'
                    className='mx-auto max-h-[280px] object-cover'
                  />
                  <div className='flex-center mt-3 gap-3'>
                    <button
                      type='button'
                      onClick={() => inputRef.current?.click()}
                      className='flex-center text-sm-regular h-10 rounded-lg border border-neutral-300 px-3 text-neutral-950 hover:bg-neutral-200'
                    >
                      <ArrowUpToLine className='mr-1.5 size-5' />
                      Change Image
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        field.onChange(null);
                        setPreviewUrl(null);
                        if (inputRef.current) inputRef.current.value = '';
                      }}
                      className='flex-center text-sm-regular h-10 rounded-lg border border-neutral-300 px-3 text-[#EE1D52] hover:bg-neutral-200'
                    >
                      <Trash2 className='mr-1.5 size-5' />
                      Delete Image
                    </button>
                  </div>
                  <p className='text-xs-regular mt-3 text-center text-neutral-700'>
                    PNG or JPG (max. 5mb)
                  </p>
                </div>
              ) : (
                <label
                  htmlFor='image-upload'
                  className={cn(
                    'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-400 bg-neutral-50 px-6 py-4 text-center transition hover:cursor-pointer',
                    fieldState.error && 'border-destructive'
                  )}
                >
                  <div className='flex-center size-10 rounded-md border border-neutral-300'>
                    <Icon
                      icon='lucide:upload-cloud'
                      className='size-5 text-neutral-950'
                    />
                  </div>
                  <div>
                    <p className='text-sm-semibold text-primary-300'>
                      Click to upload{' '}
                      <span className='text-sm-regular text-neutral-700'>
                        or drag and drop
                      </span>
                    </p>
                    <p className='text-xs-regular mt-1 text-neutral-700'>
                      PNG or JPG (max. 5mb)
                    </p>
                  </div>
                </label>
              )}
              <input
                id='image-upload'
                ref={inputRef}
                type='file'
                accept='image/png, image/jpeg, image/jpg'
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    field.onChange(file);
                  } else {
                    inputRef.current && (inputRef.current.value = '');
                  }
                }}
                className='hidden'
                disabled={disabled}
                aria-invalid={!!fieldState.error}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
