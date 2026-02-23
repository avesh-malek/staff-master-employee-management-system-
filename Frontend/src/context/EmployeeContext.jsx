import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router";
export const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  const [active, setActive] = useState("");

  const location = useLocation();
  
  useEffect(() => {
    const path = location.pathname;

    if (path.includes("dashboard")) setActive("dashboard");
    else if (path.includes("employees")) setActive("employees");
    else if (path.includes("add-employee")) setActive("add-employee");
    else if (path.includes("attendance")) setActive("attendance");
    else if (path.includes("leave")) setActive("leave");
    else if (path.includes("profile")) setActive("profile");
    else if (path.includes("announcements")) setActive("announcements");
  }, [location.pathname, setActive]);

  return (
    <EmployeeContext.Provider value={{ active, setActive }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => useContext(EmployeeContext);
