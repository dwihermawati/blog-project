import { generateClamp } from '@/function/generate-clamp';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className='border-t border-t-neutral-300 bg-white'>
      <div
        className='custom-container text-center'
        style={{ paddingBlock: generateClamp(18, 26, 1248) }}
      >
        <p
          className='text-xs-regular md:text-sm-regular text-neutral-600'
          style={{
            fontSize: generateClamp(12, 14, 1248),
            lineHeight: generateClamp(24, 28, 1248),
          }}
        >
          © 2025 Dwi Hermawati Blog All rights reserved.
        </p>
      </div>
    </footer>
  );
};
