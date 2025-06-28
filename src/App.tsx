import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './editor.css';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import AppContent from './AppContent';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer position='top-center' autoClose={3000} />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
