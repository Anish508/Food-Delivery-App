import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const ProtectedRoute = () => {
  const user = useAppStore((state) => state.user);
  const isAuth = useAppStore((state) => state.isAuth);
  const loading = useAppStore((state) => state.loading);

  const location = useLocation();

  if (loading) return null;

  // Not logged in → login
  if (!isAuth) {
    return <Navigate to={"/login"} replace />;
  }

  if (user?.role === null && location.pathname !== "/select-role") {
    return <Navigate to={"/select-role"} replace />;
  }
  if (user?.role !== null && location.pathname === "/select-role") {
    return <Navigate to={"/"} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
