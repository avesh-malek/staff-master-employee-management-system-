import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { EmployeeProvider } from "./context/EmployeeContext";

const App = () => {
  const role = localStorage.getItem("role");

  return (
       <EmployeeProvider>

          <Navbar />
      <div className="d-flex">
        <Sidebar  role={role}  />
        <div className="p-4 w-100 bg-light">
          <Outlet />
        </div>
      </div>
       </EmployeeProvider>

  );
};

export default App;
