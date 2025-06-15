import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import { generateClamp } from '@/function/generate-clamp';
import useUser from '@/hooks/useUser';
import capitalizeName from '@/lib/capitalizeName';
import React, { useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PenLine, XIcon } from 'lucide-react';
import BlogList from '@/components/blog/BlogList';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import EditProfileForm from '@/components/profile/EditProfileForm';
import useBlogPosts from '@/hooks/useBlogPosts';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useUser();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { token } = useAuth();
  const { data: userPosts, isLoading: isUserPostsLoading } = useBlogPosts({
    userId: userProfile?.id,
    sortBy: 'myPosts',
    enabled: !!userProfile?.id && !!token,
    queryKeyPrefix: ['myPosts-count', userProfile!.id?.toString()],
    limit: 1,
    token,
  });

  return (
    <>
      <Navbar />
      <main
        className='custom-container flex max-w-200 flex-col gap-4 overflow-hidden md:gap-5'
        style={{
          marginBlockStart: generateClamp(88, 128, 1248),
          marginBlockEnd: generateClamp(24, 156, 1248),
        }}
      >
        {isProfileLoading ? (
          <BeatLoader size={30} color='#0093DD' className='mx-auto' />
        ) : isProfileError || !userProfile ? (
          <p className='text-center text-[#EE1D52]'>
            Error: {profileError?.message || `Failed to load your profile.`}
          </p>
        ) : (
          <>
            <div className='neutral-300 flex-between gap-2 rounded-xl border border-neutral-300 px-4 py-3 md:px-6 md:py-4'>
              <div className='flex-center gap-2 md:gap-3'>
                <AvatarDisplay
                  avatarUrl={userProfile.avatarUrl}
                  displayName={userProfile.name}
                  style={{ width: generateClamp(40, 80, 1248) }}
                  className='aspect-square h-auto'
                />
                <div>
                  <p
                    className='text-sm-bold md:text-lg-bold text-neutral-900'
                    style={{
                      fontSize: generateClamp(14, 18, 1248),
                      lineHeight: generateClamp(28, 32, 1248),
                    }}
                  >
                    {capitalizeName(userProfile.name)}
                  </p>
                  {userProfile.headline && (
                    <p
                      className='text-xs-regular md:text-md-regular -mt-1 text-neutral-900 md:mt-0'
                      style={{
                        fontSize: generateClamp(12, 16, 1248),
                        lineHeight: generateClamp(24, 30, 1248),
                      }}
                    >
                      {userProfile.headline}
                    </p>
                  )}
                </div>
              </div>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <p className='text-xs-semibold md:text-md-semibold text-primary-300 origin-left transform cursor-pointer underline underline-offset-3 hover:scale-101'>
                    Edit Profile
                  </p>
                </DialogTrigger>
                <DialogContent className='max-w-112.75'>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogClose>
                      <XIcon className='size-6 cursor-pointer text-neutral-950 hover:text-neutral-500' />
                    </DialogClose>
                  </DialogHeader>
                  <EditProfileForm
                    currentUserProfile={userProfile}
                    onUpdateSuccess={() => setIsEditDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
            <Tabs defaultValue='yourpost'>
              <TabsList className='w-full md:w-88.5'>
                <TabsTrigger value='yourpost'>Your Post</TabsTrigger>
                <TabsTrigger value='changepassword'>
                  Change Password
                </TabsTrigger>
              </TabsList>
              <TabsContent value='yourpost' className='mt-4 md:mt-5'>
                <div className='flex gap-4 max-md:flex-col-reverse md:items-center md:justify-between md:border-b md:border-b-neutral-300 md:pb-5'>
                  <h3 className='text-lg-bold md:display-xs-bold text-neutral-900'>
                    {!isUserPostsLoading && userPosts
                      ? `${userPosts.total} Post`
                      : '(...)'}
                  </h3>
                  <div className='h-[1px] w-full bg-neutral-300 md:hidden' />
                  <Link to='/write-post'>
                    <Button className='px-10.9 w-full md:w-45.5'>
                      <PenLine className='mr-2 size-5' />
                      Write Post
                    </Button>
                  </Link>
                </div>
                <BlogList
                  sortBy='myPosts'
                  userId={userProfile.id}
                  queryKeyPrefix={['myPosts', userProfile.id.toString()]}
                  showTitle={false}
                  itemsPerPage={5}
                  cardVariant='user-blogpost'
                  showPagination={true}
                  className='mt-4 md:mt-5'
                  emptyStateConfig={{
                    title: 'Your writing journey starts here',
                    description:
                      'No posts yet, but every great writer starts with the first one.',
                    button: true,
                    buttonText: 'Write Post',
                    buttonLink: '/write-post',
                    buttonIcon: <PenLine className='size-5' />,
                    className: 'min-h-screen',
                  }}
                />
              </TabsContent>
              <TabsContent value='changepassword'>
                <ChangePasswordForm />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;
