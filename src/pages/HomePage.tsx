import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className='h-1000'></div>
      <Footer />
    </>
  );
};

export default HomePage;
