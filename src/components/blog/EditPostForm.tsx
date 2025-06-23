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
import useUpdatePost from '@/hooks/useUpdatePost';
import { BlogPost, UpdatePostPayload } from '@/types/blog';
import { Label } from '@/components/ui/label';
import { ImageUploadController } from '../shared/ImageUploadController';
import { TagInputField } from '../shared/TagInputField';
import { useAnimation, motion } from 'motion/react';
import { toast } from 'react-toastify';
import Editor from '../editor/LazyEditor';

const editPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .max(100, 'Maximum title 100 characters.')
    .optional(),
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
    .min(1, 'At least one tag must be filled in.')
    .optional(),
  imageFile: z.any().nullable().optional(),
});

interface EditPostFormProps {
  currentPost: BlogPost;
  onUpdateSuccess: () => void;
}

const EditPostForm: React.FC<EditPostFormProps> = ({
  currentPost,
  onUpdateSuccess,
}) => {
  const form = useForm<z.infer<typeof editPostSchema>>({
    resolver: zodResolver(editPostSchema),
    defaultValues: {
      title: currentPost.title,
      content: currentPost.content,
      tags: currentPost.tags || [],
      imageFile: undefined,
    },
  });

  const { mutate: updatePost, isPending: isUpdatingPost } = useUpdatePost({
    onSuccess: () => {
      toast.success('Post successfully updated!');
      onUpdateSuccess();
    },
    onError: (error) => {
      toast.error(`Failed to update post: ${error.message}`);
    },
  });

  const onSubmit = (data: z.infer<typeof editPostSchema>) => {
    const payload: UpdatePostPayload = {};

    if (data.title && data.title !== currentPost.title) {
      payload.title = data.title;
    }

    if (data.content && data.content !== currentPost.content) {
      payload.content = data.content;
    }

    const currentTags = currentPost.tags || [];
    const newTags = data.tags || [];
    if (
      newTags.length !== currentTags.length ||
      !newTags.every((tag) => currentTags.includes(tag))
    ) {
      payload.tags = newTags;
    }

    const isDeletingImageWithoutSupport =
      data.imageFile === null && !!currentPost.imageUrl;

    if (isDeletingImageWithoutSupport) {
      form.setError('imageFile', {
        type: 'manual',
        message: 'Image deletion is not supported.',
      });
      controls.start(shakeAnimation);
      return;
    }

    if (data.imageFile instanceof File) {
      payload.image = data.imageFile;
    } else if (data.imageFile === null && currentPost.imageUrl) {
      payload.image = null;
    }

    const isPayloadEmpty =
      Object.keys(payload).length === 0 ||
      (Object.keys(payload).length === 1 &&
        'image' in payload &&
        payload.image === undefined);

    if (isPayloadEmpty) {
      toast.info('No changes detected.');
      onUpdateSuccess();
      return;
    }

    updatePost({ postId: currentPost.id, payload });
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
        className='w-full space-y-5'
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
                  disabled={isUpdatingPost}
                  {...field}
                  aria-invalid={!!fieldState.error}
                  value={field.value || ''}
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
                  initialContent={field.value}
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
          name='imageFile'
          disabled={isUpdatingPost}
          initialPreviewUrl={currentPost.imageUrl}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field, fieldState }) => (
            <TagInputField
              label='Tags'
              value={field.value || []}
              onChange={(tags) => {
                field.onChange(tags);
                form.clearErrors('tags');
              }}
              error={fieldState.error}
              disabled={isUpdatingPost}
            />
          )}
        />

        <Button type='submit' disabled={isUpdatingPost} className='mt-6 w-full'>
          {isUpdatingPost ? <BeatLoader size={8} color='#fff' /> : 'Save'}
        </Button>
      </motion.form>
    </Form>
  );
};

export default EditPostForm;
