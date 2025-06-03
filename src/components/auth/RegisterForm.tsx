import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useAnimation } from 'motion/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { z } from 'zod';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import PasswordInput from '../ui/input-password';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import useRegister from '@/hooks/useRegister';
import { RegisterPayload } from '@/types/auth';

const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Error Text Helper' })
      .min(2, 'Error Text Helper')
      .max(50, 'Error Text Helper'),
    email: z
      .string({ required_error: 'Error Text Helper' })
      .email('Error Text Helper'),
    password: z
      .string({ required_error: 'Error Text Helper' })
      .min(1, 'Error Text Helper'),
    confirmPassword: z
      .string({ required_error: 'Error Text Helper' })
      .min(1, 'Error Text Helper'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Error Text Helper',
    path: ['confirmPassword'],
  });

const RegisterForm: React.FC = () => {
  const controls = useAnimation();
  const navigate = useNavigate();

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  };

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {
    mutate: registerUser,
    isPending: isLoadingMutation,
    isError: isErrorMutation,
    error: mutationError,
  } = useRegister({
    onSuccess: (data) => {
      const successMessage =
        data.message || 'Registration successful! Please login.';
      form.reset();
      alert(successMessage);
      navigate('/login', {
        state: {
          message: successMessage,
        },
      });
    },
    onError: (err) => {
      console.error('Error in register mutation:', err);
      const errorMessage =
        err.message || 'Registration failed. Please try again.';
      alert(errorMessage);
      controls.start(shakeAnimation);
    },
  });

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    try {
      const payload: RegisterPayload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      registerUser(payload);
    } catch (error) {
      if (import.meta.env.NODE_ENV !== 'production') {
        console.error('Form submission failed (catch block):', error);
      }
    }
  }

  const isLoadingCombined = form.formState.isSubmitting || isLoadingMutation;

  return (
    <div className='flex-center min-h-screen px-6 py-31.75'>
      <div
        className='flex w-100 flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6'
        style={{ boxShadow: '0 0 24px rgba(205, 204, 204, 0.16)' }}
      >
        <h2 className='text-xl-bold text-neutral-900'>Sign Up</h2>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit, () => {
              controls.start(shakeAnimation);
            })}
            animate={controls}
            className='mx-auto w-full space-y-5'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input
                    disabled={isLoadingCombined}
                    placeholder='Enter your name'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input
                    disabled={isLoadingCombined}
                    placeholder='Enter your email'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <PasswordInput
                    disabled={isLoadingCombined}
                    placeholder='Enter your password'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <PasswordInput
                    disabled={isLoadingCombined}
                    placeholder='Enter your confirm password'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoadingCombined} className='mt-5 w-full'>
              {isLoadingCombined ? (
                <BeatLoader size={20} color='#fff' />
              ) : (
                'Register'
              )}
            </Button>
            {isErrorMutation && (
              <p className='mt-2 text-red-500'>
                Error: {mutationError?.message}
              </p>
            )}
          </motion.form>
        </Form>
        <p className='text-sm-regular text-center text-neutral-950'>
          Already have an account?{' '}
          <Link to='/login' className='text-primary-300 text-sm-bold'>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
