import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/authSlice";
import FullScreenLoader from "./FullScreenLoader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (token && !user) {
    return <FullScreenLoader message="Initializing session..." />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const fallback = user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
