import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";

const PublicRoute = () => {
  const isAuth = useAppStore((state) => state.isAuth);
  const loading = useAppStore((state) => state.loading);

  if (loading) return null;

  return isAuth ? <Navigate to={"/"} replace /> : <Outlet />;
};

export default PublicRoute;
