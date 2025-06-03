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

const loginSchema = z.object({
  email: z
    .string({ required_error: 'Error Text Helper' })
    .email('Error Text Helper'),
  password: z
    .string({ required_error: 'Error Text Helper' })
    .min(1, 'Error Text Helper'),
});

const LoginForm: React.FC = () => {
  const controls = useAnimation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4, ease: 'easeInOut' },
  };

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);

      console.log('Form data valid, simulating successful login:', data);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      form.reset();
      navigate('/');
    } catch (error: any) {
      if (import.meta.env.NODE_ENV !== 'production') {
        console.error('Error during login simulation:', error);
      }
      controls.start(shakeAnimation);
      alert('Login simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex-center min-h-screen px-6 py-31.75'>
      <div
        className='flex w-90 flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-6'
        style={{ boxShadow: '0 0 24px rgba(205, 204, 204, 0.16)' }}
      >
        <h2 className='text-xl-bold text-neutral-900'>Sign In</h2>
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

            <Button disabled={loading} className='mt-5 w-full'>
              {loading ? <BeatLoader size={20} color='#fff' /> : 'Login'}
            </Button>
          </motion.form>
        </Form>
        <p className='text-sm-regular text-center text-neutral-950'>
          Don't have an account?{' '}
          <Link to='/register' className='text-primary-300 text-sm-bold'>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
