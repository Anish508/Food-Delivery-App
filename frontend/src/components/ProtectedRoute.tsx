import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppData } from "../context/AppContext";

const ProtectedRoute = () => {
  const { isAuth, user, loading } = useAppData();
  const location = useLocation();

  if (loading) return null;

  // Not logged in → login
  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  if (user?.role === null && location.pathname !== "/select-role") {
    return <Navigate to={"/select-role"}></Navigate>;
  }
  if (user?.role !== null && location.pathname === "/select-role") {
    return <Navigate to={"/"} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
