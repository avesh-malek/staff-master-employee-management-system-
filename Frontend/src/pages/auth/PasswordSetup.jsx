import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { setSession } from "../../features/auth/authSlice";

const PasswordSetup = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isReset = location.pathname.includes("reset-password");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8 || password !== confirmPassword) {
      setError("Password validation failed");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isReset ? "/api/auth/reset-password" : "/api/auth/set-password";
      const data = await apiRequest({
        path: `${endpoint}/${token}`,
        method: "POST",
        body: { password },
      });

      dispatch(setSession({ token: data.token, user: data.user }));

      if (data.user.role === "employee") navigate("/employee/dashboard", { replace: true });
      else navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: "380px" }}>
        <h4 className="text-center mb-4">{isReset ? "Reset Password" : "Set Password"}</h4>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="form-control mb-3"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <div className="alert alert-danger py-2">{error}</div>}

          <button className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordSetup;
