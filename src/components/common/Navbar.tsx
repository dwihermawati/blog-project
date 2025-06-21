import { generateClamp } from '@/function/generate-clamp';
import { motion, useScroll, useTransform } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '@/assets/images/logo.png';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import { PenLine } from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icon } from '@iconify/react';
import { useAuth } from '@/contexts/AuthContext';
import capitalizeName from '@/lib/capitalizeName';
import AvatarDisplay from '../shared/AvatarDisplay';
import useGetUserByEmail from '@/hooks/useGetUserByEmail';

type NavbarProps = {
  variant?: 'default' | 'secondary' | 'primary';
};

const Navbar: React.FC<NavbarProps> = ({ variant = 'default' }) => {
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

  const { isAuthenticated, user: authUser, logout } = useAuth();
  const navigate = useNavigate();

  const { data: userData, isLoading: isUserLoading } = useGetUserByEmail();

  const displayUserName = userData?.name || authUser?.email || 'User';
  const displayAvatarUrl = userData?.avatarUrl;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const location = useLocation();
  const isSearchPage = location.pathname === '/search';
  const [searchInputValue, setSearchInputValue] = useState('');
  const handleSearch = () => {
    if (searchInputValue.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchInputValue.trim())}`);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchInputValue(query);

    if (isSearchPage) {
      setIsMobileSearchBarOpen(true);
    } else {
      setIsMobileSearchBarOpen(false);
      setSearchInputValue('');
    }
  }, [location]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isMobileSearchBarOpen) {
      timeout = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [isMobileSearchBarOpen]);

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
          {variant === 'default' ? (
            <>
              <Link
                to='/'
                className='cursor-pointer transition-transform hover:scale-110'
              >
                <img
                  src={logo}
                  alt='Logo'
                  style={{
                    width: generateClamp(106, 159, 1248),
                    height: 'auto',
                  }}
                />
              </Link>
              <div className='focus-within:border-primary-300 flex h-12 w-93.25 items-center gap-2 rounded-xl border border-neutral-300 px-4 py-3 max-lg:hidden'>
                <Search
                  className='hover:text-primary-300 size-6 cursor-pointer text-neutral-500'
                  onClick={handleSearch}
                />
                <input
                  type='text'
                  placeholder='Search'
                  className='text-sm-regular w-full text-neutral-950 outline-none placeholder:text-neutral-500'
                  value={searchInputValue}
                  onChange={(e) => setSearchInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </>
          ) : (
            <Link
              to='/profile'
              className='group flex items-center gap-2 md:gap-4.5'
            >
              <ArrowLeft className='group-hover:text-primary-300 size-6 text-neutral-950 group-hover:scale-110' />
              {variant === 'secondary' ? (
                <span
                  className='md:display-xs-bold text-md-bold group-hover:text-primary-300 text-neutral-900'
                  style={{
                    fontSize: generateClamp(16, 24, 1248),
                    lineHeight: generateClamp(30, 36, 1248),
                  }}
                >
                  Write Post
                </span>
              ) : (
                <span
                  className='md:display-xs-bold text-md-bold group-hover:text-primary-300 text-neutral-900'
                  style={{
                    fontSize: generateClamp(16, 24, 1248),
                    lineHeight: generateClamp(30, 36, 1248),
                  }}
                >
                  Edit Post
                </span>
              )}
            </Link>
          )}

          {/* navbar after login */}
          {isAuthenticated ? (
            <div className='flex items-center justify-center gap-6'>
              {variant === 'default' && (
                <>
                  <Link
                    to='/write-post'
                    className='text-sm-semibold text-primary-300 flex items-center gap-2 underline underline-offset-3 hover:scale-105 max-lg:hidden'
                  >
                    <PenLine className='text-primary-300 size-6' />
                    Write Post
                  </Link>
                  <div className='h-6 w-[1px] flex-shrink-0 bg-neutral-300 max-lg:hidden' />
                  <Search
                    className='hover:text-primary-300 size-6 cursor-pointer text-neutral-500 lg:hidden'
                    onClick={() =>
                      setIsMobileSearchBarOpen(!isMobileSearchBarOpen)
                    }
                  />
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className='group flex cursor-pointer items-center gap-3'>
                    {isUserLoading ? (
                      <div className='flex-center size-10 animate-pulse rounded-full bg-gray-200'></div>
                    ) : (
                      <AvatarDisplay
                        avatarUrl={displayAvatarUrl}
                        displayName={displayUserName}
                        className='size-10 group-hover:scale-105 group-hover:brightness-110'
                      />
                    )}
                    <span className='text-sm-medium group-hover:text-primary-300 text-neutral-900 max-lg:hidden'>
                      {isUserLoading
                        ? 'Loading...'
                        : capitalizeName(displayUserName)}
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to='/profile'>
                      <Icon icon='lets-icons:user' /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <Icon icon='solar:logout-outline' /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              {/* navbar before login */}
              <div className='flex items-center justify-center gap-6 max-lg:hidden'>
                <Link
                  to='/login'
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
                  onClick={() =>
                    setIsMobileSearchBarOpen(!isMobileSearchBarOpen)
                  }
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
                          <img
                            src={logo}
                            alt='Logo'
                            className='h-auto w-26.5'
                          />
                        </Link>
                      </SheetClose>
                    </SheetHeader>
                    <div className='flex-center mt-10 flex-col gap-4'>
                      <SheetClose asChild>
                        <Link
                          to='/login'
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
            </>
          )}
        </div>
      </motion.header>

      {/* search bar visible in mobile at bottom of navbar */}
      <div
        className={`fixed top-0 left-0 z-30 w-full bg-white transition-all duration-300 ease-in-out ${isMobileSearchBarOpen ? 'visible translate-y-full opacity-100' : 'invisible translate-y-0 opacity-0'} lg:hidden`}
        style={{ top: generateClamp(16, 32, 1248) }}
      >
        <div className='custom-container py-1'>
          <div className='flex-start focus-within:border-primary-300 h-12 w-full gap-2 rounded-xl border border-neutral-300 px-4 py-3'>
            <Search
              className='hover:text-primary-300 size-6 text-neutral-500'
              onClick={handleSearch}
            />
            <input
              ref={inputRef}
              type='text'
              placeholder='Search'
              className='text-sm-regular w-full text-neutral-950 outline-none placeholder:text-neutral-500'
              value={searchInputValue}
              onChange={(e) => setSearchInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
