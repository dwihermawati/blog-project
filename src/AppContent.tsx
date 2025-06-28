import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import useGetUserByEmail from './hooks/useGetUserByEmail';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SearchResultsPage from './pages/SearchResultsPage';
import PostDetailPage from './pages/PostDetailPage';
import VisitProfilePage from './pages/VisitProfilePage';
import ProfilePage from './pages/ProfilePage';
import CreateBlogPostPage from './pages/blog/CreateBlogPostPage';
import EditBlogPostPage from './pages/blog/EditBlogPostPage';

const AppContent = () => {
  const { refetch } = useGetUserByEmail();

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/search' element={<SearchResultsPage />} />
      <Route path='/posts/:id' element={<PostDetailPage />} />
      <Route path='/profile/:id' element={<VisitProfilePage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/write-post' element={<CreateBlogPostPage />} />
      <Route path='/edit-post/:id' element={<EditBlogPostPage />} />
    </Routes>
  );
};

export default AppContent;
