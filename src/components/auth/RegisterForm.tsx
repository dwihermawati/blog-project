import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useAnimation } from 'motion/react';
import React, { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
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

  async function onSubmit(data: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      console.log('Form data valid, simulating successful registration:', data);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      form.reset();
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' },
      });
    } catch (error: any) {
      if (import.meta.env.NODE_ENV !== 'production') {
        console.error('Error during registration simulation:', error);
      }
      controls.start(shakeAnimation);
    } finally {
      setLoading(false);
    }
  }

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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                    placeholder='Enter your confirm password'
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={loading} className='mt-5 w-full'>
              {loading ? <BeatLoader size={20} color='#fff' /> : 'Register'}
            </Button>
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
