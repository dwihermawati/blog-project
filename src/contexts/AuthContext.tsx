import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { UserProfileResponse } from '@/types/user';
import { LoginSuccessResponse } from '@/types/auth';

interface UserInfo {
  email: string;
  name: string;
  id: number;
  avatarUrl?: string | null;
  headline?: string | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token?: string;
  login: (
    loginData: LoginSuccessResponse,
    emailInput: string,
    userDataFromApi?: UserProfileResponse
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [token, setToken] = useState<string | undefined>(undefined);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUserEmail = localStorage.getItem('userEmail');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');
    const storedAvatarUrl = localStorage.getItem('userAvatarUrl');

    if (storedToken && storedUserEmail && storedUserId && storedUserName) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setUser({
        id: parseInt(storedUserId),
        email: storedUserEmail,
        name: storedUserName,
        avatarUrl: storedAvatarUrl || null,
      });
      queryClient.invalidateQueries({ queryKey: ['user', storedUserEmail] });
    }
  }, []);

  const login = (
    loginData: LoginSuccessResponse,
    emailInput: string,
    userDataFromApi?: UserProfileResponse
  ) => {
    const newToken = loginData.token;
    setToken(newToken);
    setIsAuthenticated(true);
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userEmail', emailInput);

    if (userDataFromApi) {
      localStorage.setItem('userName', userDataFromApi.name);
      localStorage.setItem('userId', userDataFromApi.id.toString());
      if (userDataFromApi.avatarUrl)
        localStorage.setItem('userAvatarUrl', userDataFromApi.avatarUrl);

      setUser({
        id: userDataFromApi.id,
        email: userDataFromApi.email,
        name: userDataFromApi.name,
        avatarUrl: userDataFromApi.avatarUrl,
      });
    } else {
      setUser({
        id: 0,
        email: emailInput,
        name: emailInput,
      });
    }
  };

  const logout = () => {
    setToken(undefined);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('userAvatarUrl');

    queryClient.clear();
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
