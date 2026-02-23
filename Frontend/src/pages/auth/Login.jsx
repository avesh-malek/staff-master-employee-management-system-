import { useNavigate } from "react-router-dom";

const Login = () => {

  
  const navigate = useNavigate();


  const login = () => {
    const fakeResponse = {
      token: "jwt-token",
      role: "employee",
    };

    localStorage.setItem("token", fakeResponse.token);
    localStorage.setItem("role", fakeResponse.role);

    navigate("/employee/dashboard");
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: "360px" }}>
        <h4 className="text-center mb-4">EMS Login</h4>

        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
        />

        <input
          type="password"
          className="form-control mb-4"
          placeholder="Password"
        />

        <button className="btn btn-primary w-100" onClick={() => login()}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
