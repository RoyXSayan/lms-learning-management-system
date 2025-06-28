import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { appStore } from "./app/store";
import { Toaster } from "./components/ui/sonner";
import { useLoadUserQuery } from "./features/api/authApi";

const Custom = ({ children }) => {
  const { isLoading: userLoading } = useLoadUserQuery();
  const [showApp, setShowApp] = useState(false);

  useEffect(() => {
    if (!userLoading) {
      // Always wait at least 3.5 seconds (longer than cube animation)
      const delay = setTimeout(() => {
        setShowApp(true);
      }, 800);

      return () => clearTimeout(delay);
    }
  }, [userLoading]);

  if (!showApp) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background text-primary">
        <div className="cube">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="cube-face" />
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Loading your app...</p>
      </div>
    );
  }

  return <>{children}</>;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster />
      </Custom>
    </Provider>
  </StrictMode>
);
