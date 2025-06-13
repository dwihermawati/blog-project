import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ImageUploadFieldProps {
  onFileChange: (file: File | undefined) => void;
  currentFile?: File | undefined;
  currentImageUrl?: string;
  disabled?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  onFileChange,
  currentFile,
  currentImageUrl,
  disabled = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (currentFile) {
      setPreviewUrl(URL.createObjectURL(currentFile));
    } else if (currentImageUrl) {
      setPreviewUrl(currentImageUrl);
    } else {
      setPreviewUrl(null);
    }
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [currentFile, currentImageUrl]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileChange(file);
      } else {
        onFileChange(undefined);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    maxSize: 5 * 1024 * 1024,
    noClick: true,
    disabled: disabled,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(undefined);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        'hover:border-primary-300 border-neutral-300',
        isDragActive && 'border-primary-300 bg-neutral-50',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      onClick={!disabled ? open : undefined}
    >
      <input {...getInputProps()} ref={fileInputRef} disabled={disabled} />

      {previewUrl ? (
        <div className='relative h-48 w-full overflow-hidden rounded-md'>
          <img
            src={previewUrl}
            alt='Preview'
            className='h-full w-full object-cover'
          />
          <Button
            type='button'
            variant='default'
            className='absolute top-2 right-2 z-10 rounded-full bg-white/70 p-1 hover:bg-white'
            onClick={handleClear}
          >
            <Icon icon='lucide:x' className='size-4' />
          </Button>
        </div>
      ) : (
        <div className='flex flex-col items-center gap-2 text-center text-neutral-600'>
          <Icon icon='lucide:upload-cloud' className='mb-2 size-8' />
          <p className='text-sm-semibold'>Click to upload or drag and drop</p>
          <p className='text-xs-regular text-muted-foreground'>
            PNG or JPG (max. 5MB)
          </p>
          {isDragActive && (
            <p className='text-primary-300 absolute'>Drop the files here ...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
