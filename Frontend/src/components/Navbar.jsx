import { useNavigate } from "react-router-dom";

const Navbar = () => {

  const navigate = useNavigate();
  const login = () => {


    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <span className="navbar-brand">EMS</span>

        <button onClick={() => login()} className="btn btn-outline-light btn-sm">
        Logout
      </button>
    </nav>
  );
};

export default Navbar;

