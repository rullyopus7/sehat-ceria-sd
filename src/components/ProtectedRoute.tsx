
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'siswa') {
      return <Navigate to="/siswa" replace />;
    } else if (user.role === 'guru') {
      return <Navigate to="/guru" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
