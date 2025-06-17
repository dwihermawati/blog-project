import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  maxVisiblePageButtons?: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  lastPage,
  onPageChange,
  isLoading,
  maxVisiblePageButtons = 3,
}) => {
  const paginationRange = useMemo(() => {
    if (lastPage <= 0) return [];

    const range: (number | string)[] = [];

    const half = Math.floor(maxVisiblePageButtons / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(lastPage, currentPage + half);

    if (end - start + 1 < maxVisiblePageButtons) {
      if (start === 1) {
        end = Math.min(lastPage, start + maxVisiblePageButtons - 1);
      } else if (end === lastPage) {
        start = Math.max(1, end - maxVisiblePageButtons + 1);
      }
    }

    const hasLeftSpill = start > 1;
    const hasRightSpill = end < lastPage;

    if (hasLeftSpill) {
      range.push('...');
    }

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    if (hasRightSpill) {
      range.push('...');
    }

    return range;
  }, [currentPage, lastPage, maxVisiblePageButtons]);

  const handlePageChange = (pageNumber: number) => {
    if (
      pageNumber !== currentPage &&
      !isLoading &&
      typeof pageNumber === 'number'
    ) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className='flex-center mt-4 md:mt-6'>
      <Button
        variant='icon'
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className='group pr-0 pl-0 md:pr-4'
      >
        <ChevronLeft className='group-hover:text-primary-300 mr-1.5 size-6 group-hover:scale-110' />
        <span className='text-xs-regular md:text-sm-regular group-hover:text-primary-300 text-neutral-900 group-hover:scale-105'>
          Previous
        </span>
      </Button>

      {paginationRange.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`dots-${index}`}
              className='px-4 text-neutral-900 max-sm:px-1'
            >
              ...
            </span>
          );
        }

        return (
          <div key={`page-${page}`} className='flex-center size-12 border-none'>
            {typeof page === 'number' && (
              <div
                key={`page-${page}-${index}`}
                className='flex-center border-none'
              >
                <Button
                  variant={page === currentPage ? 'default' : 'icon'}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className='flex-center size-9 rounded-full px-0 md:size-12'
                >
                  <span className='text-xs-regular md:text-sm-regular hover:scale-105'>
                    {page}
                  </span>
                </Button>
              </div>
            )}
          </div>
        );
      })}

      <Button
        variant='icon'
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === lastPage || isLoading}
        className='group pr-0 pl-0 md:pl-4'
      >
        <span className='text-xs-regular md:text-sm-regular group-hover:text-primary-300 text-neutral-900 group-hover:scale-105'>
          Next
        </span>
        <ChevronRight className='group-hover:text-primary-300 ml-1.5 size-6 group-hover:scale-110' />
      </Button>
    </div>
  );
};

export default PaginationControls;
