import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { Loader } from 'lucide-react';



const RedirectAuthenticated = ({ children }) => {
  
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  if (isAuthenticated === false) {
    return children;
  }else if (isAuthenticated === true) {
    return <Navigate to='/dashboard'/>
  }else{
    return  <Loader className='animate-spin text-primary w-10 h-10 m-auto my-10'></Loader>
  }

};


export default RedirectAuthenticated;
