import React, { useState } from 'react';
import useBlogPosts from '@/hooks/useBlogPosts';
import BlogCard from './BlogCard';
import PaginationControls from '@/components/shared/PaginationControls';
import EmptyState from '../shared/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { BeatLoader } from 'react-spinners';

interface BlogListEmptyStateProps {
  title: string;
  description: string;
  button?: boolean;
  buttonIcon?: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
  className?: string;
}

interface BlogListProps {
  initialPage?: number;
  itemsPerPage?: number;
  searchQuery?: string;
  userId?: number;
  sortBy?: 'recommended' | 'most-liked' | 'search' | 'myPosts' | 'userId';
  showTitle?: boolean;
  titleText?: string;
  cardVariant?: 'blogpost' | 'most-liked' | 'user-blogpost';
  className?: string;
  enabled?: boolean;
  showPagination?: boolean;
  emptyStateConfig?: BlogListEmptyStateProps;
  queryKeyPrefix?: string[];
}

const BlogList: React.FC<BlogListProps> = ({
  initialPage = 1,
  itemsPerPage = 5,
  searchQuery,
  userId,
  sortBy = 'recommended',
  showTitle = true,
  titleText = 'Blog Posts',
  cardVariant = 'blogpost',
  className,
  showPagination = true,
  emptyStateConfig,
  queryKeyPrefix,
}) => {
  const { token } = useAuth();
  const [currentPage, setCurrentPage] = useState(initialPage);

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    userId: userId,
    sortBy: sortBy,
    token,
  };

  const {
    data: blogData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useBlogPosts({
    ...queryParams,
    queryKeyPrefix,
    enabled: true,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (
    !isPostsLoading &&
    !isPostsError &&
    blogData?.data?.length === 0 &&
    emptyStateConfig
  ) {
    return (
      <EmptyState
        title={emptyStateConfig.title}
        description={emptyStateConfig.description}
        button={emptyStateConfig.button}
        buttonIcon={emptyStateConfig.buttonIcon}
        buttonText={emptyStateConfig.buttonText}
        buttonLink={emptyStateConfig.buttonLink}
        className={emptyStateConfig.className}
      />
    );
  }

  return (
    <div className={className}>
      {showTitle && (
        <h2 className='md:display-sm-bold text-xl-bold mb-4 text-neutral-900 md:mb-6'>
          {titleText}
        </h2>
      )}

      {isPostsLoading && <BeatLoader size={20} color='#0093DD' />}
      {isPostsError && (
        <div className='text-center text-[#EE1D52]'>
          Error loading posts: {postsError?.message}
        </div>
      )}

      {blogData?.data && blogData.data.length > 0 && (
        <>
          <div className='grid grid-cols-1 gap-4 md:gap-6'>
            {blogData.data.map((post, index) => {
              const isLastItem =
                index === blogData.data.length - 1 &&
                (!showPagination || blogData.lastPage <= 1);
              return (
                <BlogCard
                  key={post.id}
                  post={post}
                  variant={cardVariant}
                  isLastItem={isLastItem}
                />
              );
            })}
          </div>

          {showPagination && blogData.lastPage > 1 && (
            <PaginationControls
              currentPage={currentPage}
              lastPage={blogData.lastPage}
              onPageChange={handlePageChange}
              isLoading={isPostsLoading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BlogList;
