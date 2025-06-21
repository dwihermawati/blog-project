import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { generateClamp } from '@/function/generate-clamp';
import AvatarDisplay, {
  getFullAvatarUrl,
} from '@/components/shared/AvatarDisplay';
import capitalizeName from '@/lib/capitalizeName';
import { BeatLoader } from 'react-spinners';
import BlogList from '@/components/blog/BlogList';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import useGetUserProfileById from '@/hooks/useGetUserProfileById';
import useBlogPosts from '@/hooks/useBlogPosts';
import { CircleUserRound } from 'lucide-react';

const VisitProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const numericId = Number(id);
  const isValidId = !isNaN(numericId);

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useGetUserProfileById({ id: numericId, enabled: isValidId });

  const { data: userPosts, isLoading: isUserPostsLoading } = useBlogPosts({
    userId: userProfile?.id,
    sortBy: 'userId',
    enabled: !!userProfile?.id,
    queryKeyPrefix: userProfile?.id
      ? ['userIdPosts-count', userProfile.id.toString()]
      : [],
  });

  const [isShowAvatarDialogOpen, setIsShowAvatarDialogOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAvatarClick = () => {
    setIsShowAvatarDialogOpen(true);
  };

  return (
    <>
      <Navbar />
      <main
        className='custom-container flex max-w-200 flex-col gap-4 md:gap-6'
        style={{
          marginBlockStart: generateClamp(88, 128, 1248),
          marginBlockEnd: generateClamp(24, 156, 1248),
        }}
      >
        {isProfileLoading ? (
          <BeatLoader size={30} color='#0093DD' className='mx-auto' />
        ) : isProfileError || !userProfile ? (
          <p className='text-center text-[#EE1D52]'>
            Error:{' '}
            {profileError?.message || `Failed to load profile for ${id}.`}
          </p>
        ) : (
          <>
            <div className='flex items-center gap-2 border-b border-b-neutral-300 pb-4 md:gap-3 md:pb-6'>
              <AvatarDisplay
                avatarUrl={userProfile.avatarUrl}
                displayName={userProfile.name}
                style={{ width: generateClamp(40, 80, 1248) }}
                className='aspect-square h-auto cursor-pointer hover:scale-105 hover:brightness-110'
                onClick={handleAvatarClick}
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
                    {capitalizeName(userProfile.headline)}
                  </p>
                )}
              </div>
            </div>

            <h3 className='text-lg-bold md:display-xs-bold text-neutral-900'>
              {!isUserPostsLoading && userPosts
                ? `${userPosts.total} Post`
                : 'Post'}
            </h3>

            <BlogList
              sortBy='userId'
              userId={userProfile.id}
              queryKeyPrefix={['userPosts', userProfile.id.toString()]}
              showTitle={false}
              itemsPerPage={5}
              cardVariant='blogpost'
              showPagination={true}
              emptyStateConfig={{
                title: 'No posts from this user yet',
                description: 'Stay tuned for future posts',
                className: 'md:mt-[152px] md:mb-[341px] mt-[143px] mb-[254px]',
              }}
            />
          </>
        )}
      </main>
      {userProfile && (
        <Dialog
          open={isShowAvatarDialogOpen}
          onOpenChange={setIsShowAvatarDialogOpen}
        >
          <DialogContent className='max-h-160 max-w-[612px]'>
            <DialogHeader className='flex items-center justify-between'>
              <DialogTitle className='text-lg-bold'>
                {capitalizeName(userProfile.name)}
              </DialogTitle>
              <DialogClose asChild>
                <XIcon className='size-6 cursor-pointer text-neutral-950 hover:text-neutral-500' />
              </DialogClose>
            </DialogHeader>
            {userProfile.avatarUrl ? (
              !imageError ? (
                <img
                  src={getFullAvatarUrl(userProfile.avatarUrl)}
                  alt={`${userProfile.name}'s avatar`}
                  className='mx-auto mt-4 max-h-130 w-auto rounded-xl'
                  onError={() => setImageError(true)}
                />
              ) : (
                <CircleUserRound className='mx-auto aspect-square h-auto w-25 object-cover text-neutral-500' />
              )
            ) : (
              <p className='text-sm-semibold text-center text-neutral-500'>
                No avatar found
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
      <Footer />
    </>
  );
};

export default VisitProfilePage;
