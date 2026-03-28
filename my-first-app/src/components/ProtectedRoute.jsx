import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // 💡 User ලොග් වෙලා නැතිනම්, එයාව Sign In පිටුවට හරවලා යවනවා
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // 💡 ලොග් වෙලා ඉන්නවා නම් විතරක් අදාළ පිටුව පෙන්වනවා
  return children;
};

export default ProtectedRoute;