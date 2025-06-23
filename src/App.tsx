import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import './index.css';
import './editor.css';
import { AuthProvider } from './contexts/AuthContext';
import SearchResultsPage from './pages/SearchResultsPage';
import PostDetailPage from './pages/PostDetailPage';
import VisitProfilePage from './pages/VisitProfilePage';
import ProfilePage from './pages/ProfilePage';
import CreateBlogPostPage from './pages/blog/CreateBlogPostPage';
import EditBlogPostPage from './pages/blog/EditBlogPostPage';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position='top-center' autoClose={3000} />
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
      </AuthProvider>
    </Router>
  );
}

export default App;
