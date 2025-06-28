import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const PaymentSuccess = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Resize listener to make confetti responsive
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Countdown and redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(`/course-progress/${courseId}`);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, courseId]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center bg-white dark:bg-zinc-900 px-6 py-12">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={300}
        recycle={false}
      />

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
        className="mb-6"
      >
        <div className="w-24 h-24 flex items-center justify-center rounded-full bg-green-500 text-white text-4xl shadow-lg">
          ✓
        </div>
      </motion.div>

      <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
        Payment Successful!
      </h1>
      <p className="mt-2 text-gray-700 dark:text-gray-300">
        Congratulations! Your purchase was successful.
      </p>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        You will be redirected in{" "}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {countdown}
        </span>{" "}
        seconds.
      </p>

      <Button
        onClick={() => navigate(`/course-progress/${courseId}`)}
        className="mt-6"
      >
        Go to Course Progress
      </Button>
    </div>
  );
};

export default PaymentSuccess;
