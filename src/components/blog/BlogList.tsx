import React, { useState } from 'react';
import useBlogPosts from '@/hooks/useBlogPosts';
import BlogCard from './BlogCard';
import PaginationControls from '@/components/shared/PaginationControls';

interface BlogListProps {
  initialPage?: number;
  itemsPerPage?: number;
  searchQuery?: string;
  userId?: number;
  sortBy?: 'recommended' | 'most-liked';
  showTitle?: boolean;
  titleText?: string;
  cardVariant?: 'blogpost' | 'most-liked' | 'user-blogpost';
  emptyMessage?: string;
  className?: string;
  enabled?: boolean;
  showPagination?: boolean;
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
  emptyMessage = 'No posts found.',
  className,
  showPagination = true,
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    userId: userId,
    sortBy: sortBy,
  };

  const {
    data: blogData,
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
  } = useBlogPosts(queryParams);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={className}>
      {showTitle && (
        <h2 className='md:display-sm-bold text-xl-bold mb-4 text-neutral-900 md:mb-6'>
          {titleText}
        </h2>
      )}

      {isPostsLoading && <div className='text-center'>Loading posts...</div>}
      {isPostsError && (
        <div className='text-center text-[#EE1D52]'>
          Error loading posts: {postsError?.message}
        </div>
      )}

      {!isPostsLoading &&
      !isPostsError &&
      blogData?.data &&
      blogData.data.length > 0 ? (
        <>
          <div className='grid grid-cols-1 gap-4 md:gap-6'>
            {blogData.data.map((post) => (
              <BlogCard key={post.id} post={post} variant={cardVariant} />
            ))}
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
      ) : (
        !isPostsLoading &&
        !isPostsError && (
          <div className='text-muted-foreground mt-4 text-center'>
            {emptyMessage}
          </div>
        )
      )}
    </div>
  );
};

export default BlogList;
