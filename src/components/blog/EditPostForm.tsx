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
import { Textarea } from '@/components/ui/textarea';
import { BeatLoader } from 'react-spinners';
import useUpdatePost from '@/hooks/useUpdatePost';
import { BlogPost, UpdatePostPayload } from '@/types/blog';
import { Label } from '@/components/ui/label';
import { ImageUploadController } from '../shared/ImageUploadController';
import { TagInputField } from '../shared/TagInputField';

const editPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .max(100, 'Maximum title 100 characters.')
    .optional(),
  content: z
    .string()
    .min(10, 'Content is required and must be at least 10 characters.')
    .optional(),
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
      alert('Post successfully updated!');
      onUpdateSuccess();
    },
    onError: (error) => {
      alert(`Failed to update post: ${error.message}`);
    },
  });

  const onSubmit = (data: z.infer<typeof editPostSchema>) => {
    const payload: UpdatePostPayload = {};

    if (data.title !== undefined && data.title !== currentPost.title) {
      payload.title = data.title;
    }
    if (data.content !== undefined && data.content !== currentPost.content) {
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

    if (data.imageFile instanceof File) {
      payload.image = data.imageFile;
    } else if (data.imageFile === null && currentPost.imageUrl) {
    }

    if (Object.keys(payload).length === 0) {
      alert('No changes detected.');
      onUpdateSuccess();
      return;
    }

    updatePost({ postId: currentPost.id, payload: payload });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
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
                <Textarea
                  placeholder='Enter your content'
                  disabled={isUpdatingPost}
                  {...field}
                  className='min-h-[186px] resize-y'
                  aria-invalid={!!fieldState.error}
                  value={field.value || ''}
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
      </form>
    </Form>
  );
};

export default EditPostForm;
