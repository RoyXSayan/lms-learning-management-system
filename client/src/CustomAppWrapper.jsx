// src/CustomAppWrapper.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useLoadUserQuery } from "@/features/api/authApi";
import Preloader from "@/components/preloader";

const CustomAppWrapper = ({ children }) => {
  const { pathname } = useLocation();
  const { isLoading: userLoading } = useLoadUserQuery();

  const isFirstVisitToRoot = pathname === "/" && !sessionStorage.getItem("preloader-shown");

  const [preloaderDone, setPreloaderDone] = useState(!isFirstVisitToRoot);
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (!userLoading && preloaderDone) {
      const delay = setTimeout(() => setShowApp(true), 200);
      return () => clearTimeout(delay);
    }
  }, [userLoading, preloaderDone]);

  if (!preloaderDone && isFirstVisitToRoot) {
    return (
      <Preloader
        onComplete={() => {
          sessionStorage.setItem("preloader-shown", "true");
          setPreloaderDone(true);
        }}
      />
    );
  }

  if (!showApp) return null;

  return <>{children}</>;
};

export default CustomAppWrapper;
