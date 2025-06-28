'use client';

import { useCallback, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import { Label } from '@/components/ui/label';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { ArrowUpToLine, Trash2 } from 'lucide-react';
import { ImagePlus } from 'lucide-react';

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
  const { watch, setValue } = useFormContext();
  const imageFile = watch(name);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    imageFile instanceof File
      ? URL.createObjectURL(imageFile)
      : (initialPreviewUrl ?? null)
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue(name, file, { shouldValidate: true });
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        setImageError(false);
      }
    },
    [name, setValue]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'image/png': [],
      'image/jpeg': [],
      'image/jpg': [],
    },
    multiple: false,
    disabled,
    noKeyboard: true,
    noClick: false,
  });

  const handleDelete = () => {
    setValue(name, null, { shouldValidate: true });
    setPreviewUrl(null);
    setImageError(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const [imageError, setImageError] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem>
          <Label>Cover Image</Label>
          <FormControl>
            <div>
              <input
                {...getInputProps({ refKey: 'ref' })}
                aria-invalid={!!fieldState.error}
                className='hidden'
              />

              {previewUrl ? (
                <div className='relative overflow-hidden rounded-xl border border-dashed border-neutral-400 bg-neutral-50 px-6 py-4'>
                  {!imageError ? (
                    <img
                      src={previewUrl}
                      alt='Preview'
                      className='mx-auto max-h-[280px] object-cover'
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className='mx-auto max-w-50'>
                      <ImagePlus
                        className='hover:text-primary-200 size-full cursor-pointer object-cover text-neutral-500'
                        onClick={open}
                      />
                      <p className='text-sm-regular text-center leading-5 text-neutral-500'>
                        Image not found, please add or change image!!
                      </p>
                    </div>
                  )}

                  <div className='flex-center mt-3 gap-3 max-sm:gap-2'>
                    <button
                      type='button'
                      onClick={open}
                      className='max-sm:text-xs-regular flex-center text-sm-regular h-10 rounded-lg border border-neutral-300 px-3 text-neutral-950 hover:bg-neutral-200 max-sm:px-1.5 max-sm:leading-5'
                    >
                      <ArrowUpToLine className='mr-1.5 size-5 max-sm:mr-0.5 max-sm:size-4' />
                      Change Image
                    </button>
                    <button
                      type='button'
                      onClick={handleDelete}
                      className='max-sm:text-xs-regular flex-center text-sm-regular h-10 rounded-lg border border-neutral-300 px-3 text-[#EE1D52] hover:bg-neutral-200 max-sm:px-1.5 max-sm:leading-5'
                    >
                      <Trash2 className='mr-1.5 size-5 max-sm:mr-0.5 max-sm:size-4' />
                      Delete Image
                    </button>
                  </div>
                  <p className='text-xs-regular mt-3 text-center text-neutral-700'>
                    PNG or JPG (max. 5mb)
                  </p>
                </div>
              ) : (
                <div
                  {...getRootProps({
                    className: cn(
                      'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-neutral-400 bg-neutral-50 px-6 py-4 text-center transition cursor-pointer group',
                      isDragActive && 'bg-neutral-100',
                      fieldState.error && 'border-destructive'
                    ),
                  })}
                >
                  <div className='flex-center size-10 rounded-md border border-neutral-300'>
                    <Icon
                      icon='lucide:upload-cloud'
                      className='size-5 text-neutral-950'
                    />
                  </div>
                  <div>
                    <span className='text-sm-semibold text-primary-300 group-hover:underline group-hover:underline-offset-3'>
                      Click to upload{' '}
                    </span>
                    <span className='text-sm-regular text-neutral-700'>
                      or drag and drop
                    </span>
                    <p className='text-xs-regular mt-1 text-neutral-700'>
                      PNG or JPG (max. 5mb)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
