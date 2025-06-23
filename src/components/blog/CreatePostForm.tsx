import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BeatLoader } from 'react-spinners';
import useCreatePost from '@/hooks/useCreatePost';
import { CreatePostPayload } from '@/types/blog';
import { Icon } from '@iconify/react';
import { Label } from '@/components/ui/label';
import { ImageUploadController } from '../shared/ImageUploadController';
import { useAnimation, motion } from 'motion/react';
import { toast } from 'react-toastify';
import Editor from '../editor/LazyEditor';

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .max(100, 'Maximum title 100 characters.'),
  content: z.string().refine(
    (val) => {
      try {
        const json = JSON.parse(val);
        const extractText = (node: any): string => {
          if (!node) return '';
          if (node.text) return node.text;
          if (Array.isArray(node.children)) {
            return node.children.map(extractText).join('');
          }
          return '';
        };
        const text = extractText(json?.root).trim();
        return text.length >= 10;
      } catch {
        return false;
      }
    },
    {
      message: 'Content must be at least 10 characters.',
    }
  ),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty.'))
    .min(1, 'At least one tag must be filled in.'),
  image: z
    .custom<File>((file) => file instanceof File && file.size > 0, {
      message: 'Cover image must be uploaded.',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Maximum image size is 5MB.',
    })
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      { message: 'Only PNG/JPG/JPEG formats are allowed.' }
    ),
});

interface CreatePostFormProps {
  onSuccess: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSuccess }) => {
  const form = useForm<z.infer<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
      image: undefined,
    },
  });

  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost({
    onSuccess: () => {
      toast.success('Post successfully created!');
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`);
    },
  });

  const onSubmit = (data: z.infer<typeof createPostSchema>) => {
    const payload: CreatePostPayload = {
      title: data.title,
      content: data.content,
      tags: data.tags,
      image: data.image,
    };
    createPost(payload);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      const newTag = input.value.trim().replace(/,$/, '');
      if (newTag && !form.getValues('tags')?.includes(newTag)) {
        form.setValue('tags', [...(form.getValues('tags') || []), newTag]);
        form.clearErrors('tags');
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      (form.getValues('tags') || []).filter((tag) => tag !== tagToRemove)
    );
    form.clearErrors('tags');
  };

  const controls = useAnimation();
  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  };

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit, () => {
          controls.start(shakeAnimation);
        })}
        animate={controls}
        className='flex w-full flex-col space-y-5'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Title</Label>
              <FormControl>
                <Input
                  placeholder='Enter your title'
                  disabled={isCreatingPost}
                  {...field}
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='content'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Content</Label>
              <FormControl>
                <Editor
                  onChange={field.onChange}
                  wrapperClassName={`rounded-md border ${
                    fieldState.error
                      ? 'border-destructive ring-1 ring-destructive/20'
                      : 'border-neutral-300'
                  }`}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ImageUploadController
          control={form.control}
          name='image'
          disabled={isCreatingPost}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Tags</Label>
              <FormControl>
                <div>
                  <Input
                    placeholder='Enter your tags'
                    onKeyDown={handleTagInput}
                    disabled={isCreatingPost}
                    aria-invalid={!!fieldState.error}
                  />
                  <div className='mt-1 flex flex-wrap gap-2'>
                    {field.value &&
                      field.value.map((tag, index) => (
                        <span
                          key={index}
                          className='text-xs-regular flex items-center gap-2 rounded-md border border-neutral-300 bg-white p-2 text-neutral-900'
                        >
                          {tag}
                          <Icon
                            icon='lucide:x'
                            className='size-3 cursor-pointer'
                            onClick={() => removeTag(tag)}
                          />
                        </span>
                      ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type='submit'
          disabled={isCreatingPost}
          className='w-full self-end md:w-66.25'
        >
          {isCreatingPost ? <BeatLoader size={8} color='#fff' /> : 'Finish'}
        </Button>
      </motion.form>
    </Form>
  );
};

export default CreatePostForm;
