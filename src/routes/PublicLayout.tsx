import { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { routePaths } from '../constants/constants';

const PublicLayout = memo(() => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn) {
    return <Navigate to={routePaths.home} replace />;
  }
  return <Outlet />;
});

export default PublicLayout;