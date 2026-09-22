import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const usePrivateRoute = () => {
  const navigate = useNavigate();
  const { user, token, fetchUser } = useAuthStore();
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    if (!token) {
      navigate('/', { replace: true });
    } else if (!user) {
      fetchUser();
    }
  }, [token, user, navigate, fetchUser]);

  return { isAuthenticated, user };
};

export default usePrivateRoute;
