import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import {
  clearAuthMessages,
  fetchCurrentUser,
  forgotPassword,
  loginUser,
} from "../../features/auth/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, token, loading, error, infoMessage } = useSelector(
    (state) => state.auth
  );

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === "employee") navigate("/employee/dashboard", { replace: true });
      else navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const resultAction = await dispatch(loginUser(form));
    if (resultAction.type.endsWith("/rejected")) {
      setForm((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) return;
    await dispatch(forgotPassword(form.email));
  };

  if (isAuthenticated && user?.role) {
    const target = user.role === "employee" ? "/employee/dashboard" : "/admin/dashboard";
    return <Navigate to={target} replace />;
  }

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: "360px" }}>
        <h4 className="text-center mb-4">EMS Login</h4>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            onFocus={() => dispatch(clearAuthMessages())}
            required
          />

          <input
            type="password"
            className="form-control mb-2"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            onFocus={() => dispatch(clearAuthMessages())}
            required
          />

          <button
            type="button"
            className="btn btn-link p-0 mb-3"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            Forgot Password?
          </button>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {infoMessage && <div className="alert alert-success py-2">{infoMessage}</div>}

          <button className="btn btn-primary w-100" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
