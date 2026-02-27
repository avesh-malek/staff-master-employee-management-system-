import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchCurrentUser } from "./features/auth/authSlice";
import FullScreenLoader from "./components/FullScreenLoader";


const App = () => {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  if (token && !user) {
    return <FullScreenLoader message="Loading app..." />;
  }

  return (
    <>
  
      <Navbar />
      <div className="d-flex">
        <Sidebar role={user?.role} />
        <div className="p-4 w-100 bg-light" style={{ minHeight: "calc(100vh - 56px)" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
