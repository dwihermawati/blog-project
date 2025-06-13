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
        className='custom-container grid w-full lg:grid-cols-[minmax(700px,855px)_minmax(200px,297px)]'
        style={{
          marginBlockStart: generateClamp(88, 128, 1248),
          marginBlockEnd: generateClamp(24, 156, 1248),
          gap: generateClamp(24, 48, 1248),
        }}
      >
        <div className='flex w-full flex-col gap-4 overflow-hidden max-lg:border-b-[6px] max-lg:border-b-neutral-300 max-lg:pb-6 lg:gap-6 lg:border-r lg:border-r-neutral-300 lg:pr-12'>
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
            showPagination={false}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
