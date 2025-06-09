import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import './index.css';
import { AuthProvider } from './contexts/AuthContext';
import SearchResultsPage from './pages/SearchResultsPage';
import PostDetailPage from './pages/PostDetailPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/search' element={<SearchResultsPage />} />
          <Route path='/posts/:id' element={<PostDetailPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
