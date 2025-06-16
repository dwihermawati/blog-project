import CreatePostForm from '@/components/blog/CreatePostForm';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { generateClamp } from '@/function/generate-clamp';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBlogPostPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateSuccess = () => {
    navigate('/profile');
  };

  return (
    <>
      <Navbar variant='secondary' />
      <main
        className='custom-container max-w-[734px]'
        style={{
          marginBlockStart: generateClamp(80, 128, 1248),
          marginBlockEnd: generateClamp(40, 48, 1248),
        }}
      >
        <CreatePostForm onSuccess={handleCreateSuccess} />
      </main>
      <Footer />
    </>
  );
};

export default CreateBlogPostPage;
