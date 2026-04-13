import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import { fetchCurrentUser } from "./features/auth/authSlice";
import FullScreenLoader from "./components/FullScreenLoader";
import { useState } from "react";
import "./App.css"; // Import custom CSS for additional styling
const App = () => {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, token, user, loading]);

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (token && !user) {
    return <FullScreenLoader message="Loading app..." />;
  }

  return (
    <>
      <Navbar setSidebarOpen={setSidebarOpen} />

      <div className="d-flex">
        {/* OVERLAY (mobile only) */}
        {sidebarOpen && window.innerWidth < 1024 && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ background: "rgba(0,0,0,0.3)", zIndex: 30 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div
          className={`p-4 w-100 bg-light transition-all duration-300
    mt-[56px] 
${sidebarOpen ? "lg:ml-[190px]" : "ml-0"}
  `}
          style={{ minHeight: "calc(100vh - 56px)" }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default App;
