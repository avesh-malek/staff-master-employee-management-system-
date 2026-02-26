import { useEffect, useState } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import { subscribeGlobalLoading } from "../services/globalLoading";

const GlobalOverlayLoader = () => {
  const [apiLoading, setApiLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => subscribeGlobalLoading(setApiLoading), []);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setRouteLoading(true);
    }, 0);
    const endTimer = setTimeout(() => {
      setRouteLoading(false);
    }, 180);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (navigation.state === "loading" || navigation.state === "submitting") {
      const startTimer = setTimeout(() => {
        setRouteLoading(true);
      }, 0);
      return () => clearTimeout(startTimer);
    }

    const endTimer = setTimeout(() => {
      setRouteLoading(false);
    }, 120);
    return () => {
      clearTimeout(endTimer);
    };
  }, [navigation.state]);

  useEffect(() => {
    const onNavigationIntent = (event) => {
      const anchor = event.target?.closest?.("a[href]");
      if (!anchor) return;
      if (anchor.target === "_blank") return;
      if (anchor.href.startsWith("http") && !anchor.href.startsWith(window.location.origin)) {
        return;
      }

      setRouteLoading(true);
    };

    window.addEventListener("popstate", onNavigationIntent);
    document.addEventListener("click", onNavigationIntent, true);

    return () => {
      window.removeEventListener("popstate", onNavigationIntent);
      document.removeEventListener("click", onNavigationIntent, true);
    };
  }, []);

  if (!apiLoading && !routeLoading) {
    return null;
  }

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center"
      style={{ zIndex: 2000, backgroundColor: "rgba(255, 255, 255, 0.72)" }}
    >
      <div className="spinner-border text-primary mb-2" role="status" />
      <small className="text-muted">Loading...</small>
    </div>
  );
};

export default GlobalOverlayLoader;
