import { memo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import MainLayout from '../layout/MainLayout';
import { routePaths } from '../constants/constants';

const ProtectedLayout = memo(() => {
  const { isLoggedIn } = useAuthStore();

  if (!isLoggedIn) {
    return <Navigate to={routePaths.login} replace />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
});

export default ProtectedLayout;