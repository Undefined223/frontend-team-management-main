import { Navigate } from 'react-router-dom';
import useUserInfo from '../hooks/useUserInfo';

const HomeRedirector = () => {
  const { token } = useUserInfo();
  return (
    token != null ? <Navigate to="/home"/> : <Navigate to="/login"/>
  )
}

export default HomeRedirector
