import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import { BeatLoader } from 'react-spinners';
import useUpdateProfile from '@/hooks/useUpdateProfile';
import { UpdateProfilePayload, UserProfileResponse } from '@/types/user';
import { Icon } from '@iconify/react';
import { Label } from '@/components/ui/label';

const editProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.').optional(),
  headline: z
    .string()
    .max(100, 'Headlines can be a maximum of 100 characters.')
    .nullable()
    .optional(),
  avatar: z
    .any()
    .refine(
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
      'Maximum image size is 5MB.'
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File &&
          ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)),
      'Only PNG/JPG/JPEG formats are allowed.'
    )
    .optional(),
});

interface EditProfileFormProps {
  currentUserProfile: UserProfileResponse;
  onUpdateSuccess: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  currentUserProfile,
  onUpdateSuccess,
}) => {
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: currentUserProfile.name || '',
      headline: currentUserProfile.headline || '',
      avatar: undefined,
    },
  });

  useEffect(() => {
    form.reset({
      name: currentUserProfile.name || '',
      headline: currentUserProfile.headline || '',
      avatar: undefined,
    });
    setPreviewAvatar(currentUserProfile.avatarUrl || null);
  }, [currentUserProfile, form]);

  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile({
      onSuccess: () => {
        alert('Profile updated successfully!');
        onUpdateSuccess();
      },
      onError: (error) => {
        alert(`Failed to update profile: ${error.message}`);
      },
    });

  const onSubmit = (data: z.infer<typeof editProfileSchema>) => {
    const payload: UpdateProfilePayload = {
      name: data.name,
      headline: data.headline === '' ? null : data.headline,
      avatar: data.avatar instanceof File ? data.avatar : undefined,
    };
    updateProfile(payload);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      form.setValue('avatar', file);
      setPreviewAvatar(URL.createObjectURL(file));
    } else {
      form.setValue('avatar', undefined);
      setPreviewAvatar(currentUserProfile.avatarUrl || null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewAvatar && previewAvatar.startsWith('blob:')) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-5'>
        <div className='group relative flex flex-col items-center gap-4'>
          <AvatarDisplay
            avatarUrl={previewAvatar || currentUserProfile.avatarUrl}
            displayName={currentUserProfile.name}
            className='relative size-20 cursor-pointer group-hover:scale-105 group-hover:brightness-110'
            onClick={() =>
              document.getElementById('avatar-upload-input')?.click()
            }
          />
          <div
            className='bg-primary-300 flex-center absolute top-[76.25%] left-[53.6%] size-6 cursor-pointer rounded-full p-1'
            onClick={() =>
              document.getElementById('avatar-upload-input')?.click()
            }
          >
            <Icon
              icon='mage:camera-fill'
              className='text-neutral-25 size-full'
            />
          </div>
          <input
            id='avatar-upload-input'
            type='file'
            accept='image/png, image/jpeg, image/jpg'
            className='hidden'
            onChange={handleAvatarChange}
          />
          <FormMessage>
            {form.formState.errors.avatar?.message as string}
          </FormMessage>
        </div>

        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <Label>Name</Label>
              <Input
                placeholder='Enter your name'
                disabled={isUpdatingProfile}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='headline'
          render={({ field }) => (
            <FormItem>
              <Label>Profile Headline</Label>
              <Input
                placeholder='Enter your headline'
                disabled={isUpdatingProfile}
                {...field}
                value={field.value || ''}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isUpdatingProfile} className='w-full'>
          {isUpdatingProfile ? (
            <BeatLoader size={8} color='#fff' />
          ) : (
            'Update Profile'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditProfileForm;
