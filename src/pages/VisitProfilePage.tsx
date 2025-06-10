import React from 'react';
import { useParams } from 'react-router-dom';
import { generateClamp } from '@/function/generate-clamp';
import AvatarDisplay from '@/components/shared/AvatarDisplay';
import capitalizeName from '@/lib/capitalizeName';
import { BeatLoader } from 'react-spinners';
import BlogList from '@/components/blog/BlogList';
import Navbar from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import useUserProfileByEmail from '@/hooks/useUserProfileByEmail';

const VisitProfilePage: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const userEmail = email || '';

  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError: isProfileError,
    error: profileError,
  } = useUserProfileByEmail({ email: userEmail, enabled: !!userEmail });

  return (
    <>
      <Navbar />
      <main
        className='custom-container flex max-w-200 flex-col gap-6 md:gap-8'
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
            {profileError?.message ||
              `Failed to load profile for ${userEmail}.`}
          </p>
        ) : (
          <>
            <div className='group flex items-center gap-2 border-b border-b-neutral-300 pb-4 md:gap-3 md:pb-6'>
              <AvatarDisplay
                avatarUrl={userProfile.avatarUrl}
                displayName={userProfile.name}
                style={{ width: generateClamp(40, 80, 1248) }}
                className='aspect-square h-auto group-hover:scale-105 group-hover:brightness-110'
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

            <BlogList
              userId={userProfile.id}
              queryKeyPrefix={['userPosts', userProfile.id.toString()]}
              showTitle={false}
              itemsPerPage={5}
              cardVariant='blogpost'
              showPagination={true}
              emptyStateConfig={{
                title: 'No posts from this user yet',
                description: 'Stay tuned for future posts',
              }}
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
};

export default VisitProfilePage;
