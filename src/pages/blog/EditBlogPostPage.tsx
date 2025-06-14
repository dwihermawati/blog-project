import EditPostForm from '@/components/blog/EditPostForm';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { generateClamp } from '@/function/generate-clamp';
import usePostDetail from '@/hooks/usePostDetail';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BeatLoader } from 'react-spinners';

const EditBlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id) : undefined;

  const {
    data: post,
    isLoading,
    isError,
    error,
  } = usePostDetail({
    postId: postId as number,
    enabled: !!postId,
  });

  const navigate = useNavigate();

  const handleEditSuccess = () => {
    navigate('/profile');
  };

  return (
    <>
      <Navbar variant='primary' />
      <main
        className='custom-container flex max-w-[734px]'
        style={{
          marginBlockStart: generateClamp(80, 128, 1248),
          marginBlockEnd: generateClamp(40, 48, 1248),
        }}
      >
        {isLoading ? (
          <BeatLoader size={30} color='#0093DD' className='mx-auto' />
        ) : isError || !post ? (
          <p className='text-center text-[#EE1D52]'>
            Error: {error?.message || 'Failed to load post for editing.'}
          </p>
        ) : (
          <EditPostForm
            currentPost={post}
            onUpdateSuccess={handleEditSuccess}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default EditBlogPostPage;
