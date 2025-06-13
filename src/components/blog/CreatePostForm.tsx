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
import ImageUploadField from '../shared/ImageUploadField'; // Akan dibuat
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Icon } from '@iconify/react';
import { Label } from '@/components/ui/label';

const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required.')
    .max(100, 'Maximum title 100 characters.'),
  content: z
    .string()
    .min(10, 'Content is required and must be at least 10 characters.'),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty.'))
    .min(1, 'At least one tag must be filled in.'),
  image: z
    .any()
    .refine(
      (file) => file instanceof File && file.size > 0,
      'Cover image must be uploaded.'
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'Maximum image size is 5MB.'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type),
      'Only PNG/JPG/JPEG formats are allowed.'
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
      alert('Post successfully created!');
      onSuccess();
    },
    onError: (error) => {
      alert(`Failed to create post: ${error.message}`);
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
      if (newTag && !form.getValues('tags').includes(newTag)) {
        form.setValue('tags', [...form.getValues('tags'), newTag]);
        form.clearErrors('tags');
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      'tags',
      form.getValues('tags').filter((tag) => tag !== tagToRemove)
    );
    form.clearErrors('tags');
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
                <ReactQuill
                  theme='snow'
                  value={field.value}
                  onChange={field.onChange}
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                  readOnly={isCreatingPost}
                  placeholder='Enter your content'
                  className='rounded-xl border border-neutral-300 bg-white'
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='image'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Cover Image</Label>
              <FormControl>
                <ImageUploadField
                  onFileChange={field.onChange}
                  currentFile={field.value}
                  currentImageUrl={undefined}
                  disabled={isCreatingPost}
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='tags'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Tags</Label>
              <FormControl>
                <>
                  <Input
                    placeholder='Enter your tags'
                    onKeyDown={handleTagInput}
                    disabled={isCreatingPost}
                    aria-invalid={!!fieldState.error}
                  />
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {field.value &&
                      field.value.map((tag, index) => (
                        <span
                          key={index}
                          className='bg-primary-100 text-primary-800 text-sm-regular flex items-center rounded-full px-3 py-1'
                        >
                          {tag}
                          <Icon
                            icon='lucide:x'
                            className='ml-2 size-4 cursor-pointer'
                            onClick={() => removeTag(tag)}
                          />
                        </span>
                      ))}
                  </div>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isCreatingPost} className='mt-5 w-full md:w-66.25'>
          {isCreatingPost ? <BeatLoader size={8} color='#fff' /> : 'Finish'}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePostForm;
