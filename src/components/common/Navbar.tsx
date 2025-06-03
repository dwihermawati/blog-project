import { generateClamp } from '@/function/generate-clamp';
import { motion, useScroll, useTransform } from 'motion/react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
} from '@/components/ui/sheet';

const Navbar: React.FC = () => {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 100],
    ['rgba(250,250,250,0', 'rgba(250,250,250,0.5)']
  );
  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(10px)']
  );

  const [isMobileSearchBarOpen, setIsMobileSearchBarOpen] = useState(false);

  return (
    <>
      <motion.header
        style={{
          background,
          backdropFilter: backdropBlur,
        }}
        className='fixed top-0 z-50 w-full border-b border-b-neutral-300'
      >
        <div
          className='custom-container flex items-center justify-between'
          style={{ height: generateClamp(64, 80, 1248) }}
        >
          <Link
            to='/'
            className='cursor-pointer transition-transform hover:scale-110'
          >
            <img
              src={logo}
              alt='Logo'
              style={{ width: generateClamp(106, 159, 1248), height: 'auto' }}
            />
          </Link>
          <div className='focus-within:border-primary-300 flex h-12 w-93.25 items-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 max-lg:hidden'>
            <Search className='hover:text-primary-300 size-6 text-neutral-500' />
            <input
              type='text'
              placeholder='Search'
              className='text-sm-regular w-full text-neutral-950 outline-none placeholder:text-neutral-500'
            />
          </div>
          <div className='flex items-center justify-center gap-6 max-lg:hidden'>
            <Link
              to='login'
              className='text-sm-semibold text-primary-300 underline underline-offset-3 hover:scale-105'
            >
              Login
            </Link>
            <div className='h-6 w-[1px] flex-shrink-0 bg-neutral-300' />
            <Link to='/register'>
              <Button>Register</Button>
            </Link>
          </div>
          <div className='flex items-center justify-end gap-6 lg:hidden'>
            <Search
              className='hover:text-primary-300 size-6 cursor-pointer text-neutral-500'
              onClick={() => setIsMobileSearchBarOpen(!isMobileSearchBarOpen)}
            />
            <Sheet>
              <SheetTrigger asChild>
                <Menu className='cursor-pointer lg:hidden' />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader className='flex-start h-16 border-b border-b-neutral-300'>
                  <SheetClose asChild>
                    <Link
                      to='/'
                      className='cursor-pointer transition-transform hover:scale-110'
                    >
                      <img src={logo} alt='Logo' className='h-auto w-26.5' />
                    </Link>
                  </SheetClose>
                </SheetHeader>
                <div className='flex-center mt-10 flex-col gap-4'>
                  <SheetClose asChild>
                    <Link
                      to='login'
                      className='text-sm-semibold text-primary-300 underline underline-offset-3 hover:scale-105'
                    >
                      Login
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to='/register'>
                      <Button>Register</Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>
      <div
        className={`fixed top-0 left-0 z-40 w-full bg-white transition-all duration-300 ease-in-out ${isMobileSearchBarOpen ? 'visible translate-y-full opacity-100' : 'invisible translate-y-0 opacity-0'} lg:hidden`}
        style={{ top: generateClamp(16, 32, 1248) }}
      >
        <div className='custom-container py-1'>
          <div className='flex-start focus-within:border-primary-300 h-12 w-full gap-2 rounded-xl border border-neutral-300 px-4 py-3'>
            <Search className='hover:text-primary-300 size-6 text-neutral-500' />
            <input
              type='text'
              placeholder='Search'
              className='text-sm-regular w-full text-neutral-950 outline-none placeholder:text-neutral-500'
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
