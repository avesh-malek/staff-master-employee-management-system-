import { createContext, useContext } from "react";
import { useSelector } from "react-redux";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  const role = user?.role;

  const isAdmin = role === "admin";
  const isHR = role === "hr";
  const isEmployee = role === "employee";

  const canManageRoles = isAdmin; // only admin
  const canAddEmployee = isAdmin || isHR;

  return (
    <RoleContext.Provider
      value={{
        role,
        isAdmin,
        isHR,
        isEmployee,
        canManageRoles,
        canAddEmployee,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);