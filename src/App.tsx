import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { Navigate, Route, RouteProps, Routes } from 'react-router-dom'
import { Spin } from 'antd'
import { AuthApi } from './api/auth/AuthApi'
import { routePaths } from './constants/constants'
import ProtectedLayout from './routes/ProtectedLayout'
import PublicLayout from './routes/PublicLayout'
import { useAuthStore } from './store/authStore'
import './App.scss'

// Lazy load the components
const ProjectsPage = lazy(() => import('./components/projects/ProjectsPage'));
const LoginPage = lazy(() => import('./components/login/LoginPage'));

const protectedRoutes = [
  { path: routePaths.home, element: <ProjectsPage /> },
  { path: routePaths.projects, element: <ProjectsPage /> },
];

const publicRoutes = [
  { path: routePaths.login, element: <LoginPage /> },
];

function App () {
  const [loading, setLoading] = useState(true)
  const { isLoggedIn, login, logout } = useAuthStore()

  const verifyLogin = useCallback(async () => {
    const response = await AuthApi.me();
    if (response.ok && response.data) {
      login(response.data)
    }
    else {
      if (isLoggedIn) {
        logout()
      }
    }

    setLoading(false)
  }, [isLoggedIn, login, logout])

  useEffect(() => {
    verifyLogin()
  }, [verifyLogin])

  const renderRoutes = (routes: Array<RouteProps>) => {
    return routes.map((route) => <Route key={route.path} path={route.path} element={route.element} />);
  }

  const renderLoading = () => {
    return <div className='loading-container'>
      <Spin percent={loading ? 'auto' : 100} size="large" />
    </div>
  }

  if (loading) {
    return renderLoading()
  }

  return (
    <div className="app-container">
      <Suspense fallback={renderLoading()}>
        <Routes>
          <Route element={<ProtectedLayout />}>{renderRoutes(protectedRoutes)}</Route>
          <Route element={<PublicLayout />}>{renderRoutes(publicRoutes)}</Route>
          <Route path="*" element={isLoggedIn ? <Navigate to={routePaths.home} replace /> : <Navigate to={routePaths.login} replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
