import { zodResolver } from '@hookform/resolvers/zod';
import { motion, useAnimation } from 'motion/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { BeatLoader } from 'react-spinners';
import { z } from 'zod';

import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '../ui/input';
import PasswordInput from '../ui/input-password';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import useLogin from '@/hooks/useLogin';
import { useAuth } from '@/contexts/AuthContext';
import userService from '@/services/userService';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';

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
  const auth = useAuth();

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

  const { mutate: loginUser, isPending: isLoadingLogin } = useLogin({
    onSuccess: async (data, variables) => {
      try {
        const userProfile = await userService.getUserByEmail(variables.email);
        auth.login(data, variables.email, userProfile);
      } catch (profileError: any) {
        console.error(
          'Failed to fetch user profile after login:',
          profileError
        );
        auth.login(data, variables.email);
      }
      toast.success('Login successful! Welcome back.');

      form.reset();
      navigate('/', { state: { message: 'Login successful! Welcome back.' } });
    },

    onError: (err) => {
      console.error('Login failed:', err);
      controls.start(shakeAnimation);

      toast.error('Login failed. Please check your credentials.');

      form.setError('email', {
        type: 'server',
        message: 'Error Text Helper',
      });

      form.setError('password', {
        type: 'server',
        message: 'Error Text Helper',
      });
    },
  });

  async function onSubmit(data: z.infer<typeof loginSchema>) {
    try {
      const payload = {
        email: data.email,
        password: data.password,
      };

      loginUser(payload);
    } catch (error) {
      if (import.meta.env.NODE_ENV !== 'production') {
        console.error('Form submission failed (catch block):', error);
      }
    }
  }

  const isLoadingCombined = form.formState.isSubmitting || isLoadingLogin;

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
              render={({ field, fieldState }) => (
                <FormItem>
                  <Label>Email</Label>
                  <Input
                    disabled={isLoadingCombined}
                    placeholder='Enter your email'
                    {...field}
                    aria-invalid={!!fieldState.error}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field, fieldState }) => (
                <FormItem>
                  <Label>Password</Label>
                  <PasswordInput
                    disabled={isLoadingCombined}
                    placeholder='Enter your password'
                    {...field}
                    aria-invalid={!!fieldState.error}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoadingCombined} className='mt-5 w-full'>
              {isLoadingCombined ? (
                <BeatLoader size={20} color='#fff' />
              ) : (
                'Login'
              )}
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
