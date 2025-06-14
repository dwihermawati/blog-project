import React from 'react';
import { Icon } from '@iconify/react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { FieldError } from 'react-hook-form';

interface TagInputFieldProps {
  label?: string;
  value: string[];
  onChange: (newTags: string[]) => void;
  error?: FieldError;
  disabled?: boolean;
}

export const TagInputField: React.FC<TagInputFieldProps> = ({
  label = 'Tags',
  value,
  onChange,
  error,
  disabled = false,
}) => {
  const [inputTag, setInputTag] = React.useState('');

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputTag.trim().replace(/,$/, '');
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <FormItem>
      <Label>{label}</Label>
      <FormControl>
        <div>
          <Input
            placeholder='Enter your tags'
            onKeyDown={handleAddTag}
            value={inputTag}
            onChange={(e) => setInputTag(e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
          />
          <div className='mt-1 flex flex-wrap gap-2'>
            {value.map((tag, index) => (
              <span
                key={index}
                className='text-xs-regular flex items-center gap-2 rounded-md border border-neutral-300 bg-white p-2 text-neutral-900'
              >
                {tag}
                <Icon
                  icon='lucide:x'
                  className='size-3 cursor-pointer'
                  onClick={() => handleRemoveTag(tag)}
                />
              </span>
            ))}
          </div>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};
