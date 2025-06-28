import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RouteChangeLoader = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  const isInitialLoad = useRef(true); // 👈 to track first render

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false; // Skip first page load
      return;
    }

    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 700); // adjust loader duration as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] bg-black flex items-center justify-center"
        >
          <div className="flex flex-col items-center text-white gap-4">
            <div className="w-10 h-10 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            <p className="text-lg animate-pulse">Loading...</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RouteChangeLoader;
