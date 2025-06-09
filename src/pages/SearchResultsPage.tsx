import BlogList from '@/components/blog/BlogList';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import { generateClamp } from '@/function/generate-clamp';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') || '';
  return (
    <>
      <Navbar />
      <main
        className='custom-container w-full'
        style={{
          marginBlockStart: generateClamp(88, 128, 1248),
          marginBlockEnd: generateClamp(24, 156, 1248),
        }}
      >
        <BlogList
          queryKeyPrefix={['searchResults']}
          sortBy='search'
          showTitle={true}
          titleText={`Result for "${searchQuery}"`}
          itemsPerPage={5}
          cardVariant='blogpost'
          searchQuery={searchQuery}
          className='max-w-[807px]'
          emptyStateConfig={{
            title: 'No results found',
            description: 'Try using different keywords',
            button: true,
            buttonText: 'Back to Home',
            buttonLink: '/',
            className: 'min-h-screen w-full',
          }}
        />
      </main>
      <Footer />
    </>
  );
};

export default SearchResultsPage;
