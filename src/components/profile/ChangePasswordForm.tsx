import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import PasswordInput from '@/components/ui/input-password';
import { BeatLoader } from 'react-spinners';
import useChangePassword from '@/hooks/useChangePassword';
import { useAnimation, motion } from 'motion/react';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Old password is required.'),
    newPassword: z
      .string()
      .min(2, 'New password must be at least 2 characters.'),
    confirmPassword: z.string().min(1, 'Password confirmation is required.'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password confirmation does not match.',
    path: ['confirmPassword'],
  });

const ChangePasswordForm: React.FC = () => {
  const controls = useAnimation();
  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  };

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate: changePassword, isPending: isChangingPassword } =
    useChangePassword({
      onSuccess: (data) => {
        toast.success(data.message || 'Password changed successfully!');
        form.reset();
      },
      onError: (error) => {
        toast.error(`Failed to change password: ${error.message}`);
      },
    });

  const onSubmit = (data: z.infer<typeof changePasswordSchema>) => {
    changePassword(data);
  };

  return (
    <Form {...form}>
      <motion.form
        onSubmit={form.handleSubmit(onSubmit, () => {
          controls.start(shakeAnimation);
        })}
        animate={controls}
        className='mt-4 max-w-134.5 space-y-4 md:mt-6 md:space-y-5'
      >
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Current Password</Label>
              <PasswordInput
                placeholder='Enter current password'
                disabled={isChangingPassword}
                {...field}
                aria-invalid={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>New Password</Label>
              <PasswordInput
                placeholder='Enter new password'
                disabled={isChangingPassword}
                {...field}
                aria-invalid={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <Label>Confirm New Password</Label>
              <PasswordInput
                placeholder='Confirm new password'
                disabled={isChangingPassword}
                {...field}
                aria-invalid={!!fieldState.error}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isChangingPassword} className='w-full'>
          {isChangingPassword ? (
            <BeatLoader size={20} color='#fff' />
          ) : (
            'Update Password'
          )}
        </Button>
      </motion.form>
    </Form>
  );
};

export default ChangePasswordForm;
