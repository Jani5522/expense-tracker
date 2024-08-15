import { Navigate, useLocation} from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { Loader } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated === false && location.pathname !== '/login') {
    return <Navigate to='/login'/>
  }else if (isAuthenticated === true) {
      return children;
  }else{
    return  <Loader className='animate-spin text-primary w-10 h-10 m-auto my-10'></Loader>
  }

};

export default ProtectedRoute;
