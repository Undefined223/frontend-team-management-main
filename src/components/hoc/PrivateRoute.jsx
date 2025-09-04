import { Navigate } from 'react-router-dom';
import useUserInfo from '../../hooks/useUserInfo';
import Navbar from '../ui/Navbar/Navbar';

const PrivateRoute = ({ children }) => {
  const { token } = useUserInfo();
  return (
    token ? (
      <div className='flex items-start flex-col h-[100vh]'>
        <Navbar />
        <main className='px-10 flex-1 w-full flex flex-col'>
          {children}
        </main>
      </div>
    ) : <Navigate to="/login" />
  );
}

export default PrivateRoute
