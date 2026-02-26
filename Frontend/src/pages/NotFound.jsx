import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fallbackPath = user
    ? user.role === "employee"
      ? "/employee/dashboard"
      : "/admin/dashboard"
    : "/";

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-light">
      <h1 className="fw-bold mb-2">404 - Page Not Found</h1>
      <p className="text-muted mb-3">The page you are looking for does not exist.</p>
      <button className="btn btn-primary" onClick={() => navigate(fallbackPath)}>
        {user ? "Go to Dashboard" : "Go to Login"}
      </button>
    </div>
  );
};

export default NotFound;
