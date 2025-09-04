import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoute from './components/hoc/PrivateRoute'
import PublicRoute from './components/hoc/PublicRoute'
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';
import Home from './pages/Home/Home';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from './pages/Profile/Profile';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomeRedirector from './pages/HomeRedirector';
import { Toaster } from './components/ui/sonner'

const queryClient = new QueryClient();

const routes = createBrowserRouter([
    {
      path: "/login",
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: "/",
      element: <HomeRedirector />,
    },
    {
      path: "/home",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      ),
    },
    {
      path: "/dashboard/:projectId",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
    },
    {
      path: "/profile",
      element: (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      ),
    },
    {
      path: "*",
      element: (
        <NotFound />
      ),
    },
  ]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={routes} />
      <Toaster richColors />
    </QueryClientProvider>
  )
}

export default App
