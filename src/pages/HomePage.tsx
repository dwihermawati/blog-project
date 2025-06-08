import BlogList from '@/components/blog/BlogList';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { generateClamp } from '@/function/generate-clamp';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <main
        className='custom-container flex flex-wrap gap-12 max-md:flex-col'
        style={{
          marginBlockStart: generateClamp(88, 128, 1248),
          marginBlockEnd: generateClamp(24, 156, 1248),
        }}
      >
        <div className='flex w-full flex-col gap-4 md:gap-6'>
          <BlogList
            sortBy='recommended'
            showTitle={true}
            titleText='Recommended For You'
            itemsPerPage={5}
            cardVariant='blogpost'
          />
        </div>

        <div className='flex w-full flex-col gap-4 md:gap-6'>
          <BlogList
            sortBy='most-liked'
            showTitle={true}
            titleText='Most Liked Posts'
            itemsPerPage={3}
            cardVariant='most-liked'
            emptyMessage='No liked posts yet.'
            showPagination={false}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
