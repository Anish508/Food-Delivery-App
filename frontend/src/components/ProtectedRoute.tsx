import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();
  const location = useLocation();

  if (loading) return null;

  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  // If user doesn't have a role, force them to select-role
  if (!user?.role) {
    if (location.pathname !== "/select-role") {
      return <Navigate to={"/select-role"} replace />;
    }
  }

  // If user has a role, they cannot access select-role
  if (user?.role) {
    if (location.pathname === "/select-role") {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
